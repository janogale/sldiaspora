'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type DashboardMember = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  country_of_nationality?: string;
  profession?: string;
  areas_of_interest?: string;
  additional_notes?: string;
  profile_picture?: string | { id?: string } | null;
  status: string;
};

type MembersListItem = {
  id: string;
  full_name: string;
  city?: string;
  country?: string;
  profile_picture?: string | { id?: string } | null;
};

type DashboardSection = 'members' | 'profile' | 'settings';
type SortKey = 'name' | 'country' | 'city';

const resolveAssetPath = (
  fileValue: string | { id?: string } | null | undefined
): string | null => {
  if (!fileValue) return null;
  if (typeof fileValue === 'string') return `/api/directus-assets/${fileValue}`;
  if (fileValue.id) return `/api/directus-assets/${fileValue.id}`;
  return null;
};

export default function MemberDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [member, setMember] = useState<DashboardMember | null>(null);
  const [members, setMembers] = useState<MembersListItem[]>([]);

  const [activeSection, setActiveSection] = useState<DashboardSection>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [connectingId, setConnectingId] = useState<string>('');
  const [requestMessage, setRequestMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MembersListItem | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const [profileBio, setProfileBio] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/member-auth/me', { method: 'GET' });

        if (response.status === 401) {
          router.push('/member-login');
          return;
        }

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setError(result?.message || 'Unable to load dashboard.');
          return;
        }

        setMember(result.member || null);
        setProfileBio(result?.member?.additional_notes || '');
        setMembers(Array.isArray(result.members) ? result.members : []);
      } catch {
        setError('Unable to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const otherMembers = useMemo(
    () => members.filter((item) => item.id && item.id !== member?.id),
    [members, member?.id]
  );

  const filterOptions = useMemo(() => {
    const getUnique = (items: Array<string | undefined>) =>
      Array.from(new Set(items.filter(Boolean).map((item) => item!.trim()).filter(Boolean))).sort();

    return {
      countries: getUnique(otherMembers.map((item) => item.country)),
    };
  }, [otherMembers]);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const countryKey = countryFilter.toLowerCase();

    return otherMembers.filter((item) => {
      if (countryFilter !== 'all' && (item.country || '').toLowerCase() !== countryKey) {
        return false;
      }
      if (!term) return true;

      return [item.full_name, item.city, item.country]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [otherMembers, searchTerm, countryFilter]);

  const sortedMembers = useMemo(() => {
    const list = [...filteredMembers];
    list.sort((a, b) => {
      const aValue =
        sortBy === 'name'
          ? (a.full_name || '').toLowerCase()
          : sortBy === 'country'
            ? (a.country || '').toLowerCase()
            : (a.city || '').toLowerCase();

      const bValue =
        sortBy === 'name'
          ? (b.full_name || '').toLowerCase()
          : sortBy === 'country'
            ? (b.country || '').toLowerCase()
            : (b.city || '').toLowerCase();

      const order = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? order : -order;
    });
    return list;
  }, [filteredMembers, sortBy, sortDirection]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(sortedMembers.length / pageSize));
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMembers.slice(start, start + pageSize);
  }, [sortedMembers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, countryFilter, sortBy, sortDirection]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const memberStats = useMemo(() => {
    const countries = new Set(otherMembers.map((item) => (item.country || '').trim()).filter(Boolean));
    const cities = new Set(otherMembers.map((item) => (item.city || '').trim()).filter(Boolean));

    return {
      members: otherMembers.length,
      countries: countries.size,
      cities: cities.size,
    };
  }, [otherMembers]);

  const activeFilters = useMemo(() => {
    const chips: Array<{ key: 'search' | 'country'; label: string }> = [];
    if (searchTerm.trim()) chips.push({ key: 'search', label: `Search: ${searchTerm.trim()}` });
    if (countryFilter !== 'all') chips.push({ key: 'country', label: `Country: ${countryFilter}` });
    return chips;
  }, [searchTerm, countryFilter]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setCountryFilter('all');
  };

  const clearSingleFilter = (key: 'search' | 'country') => {
    if (key === 'search') setSearchTerm('');
    if (key === 'country') setCountryFilter('all');
  };

  const handleLogout = async () => {
    await fetch('/api/member-auth/logout', { method: 'POST' }).catch(() => null);
    router.push('/member-login');
  };

  const openConnectModal = (memberItem: MembersListItem) => {
    setSelectedMember(memberItem);
    setIsModalOpen(true);
    setRequestMessage('');
    setSuccess('');
    setError('');
    setModalSuccess('');
    setModalError('');
  };

  const closeConnectModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    setRequestMessage('');
    setModalSuccess('');
    setModalError('');
  };

  const handleConnect = async () => {
    if (!selectedMember?.id) return;

    setConnectingId(selectedMember.id);
    setModalError('');
    setModalSuccess('');

    try {
      const response = await fetch('/api/member-auth/request-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetMemberId: selectedMember.id,
          message: requestMessage,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setModalError(result?.message || 'Failed to send connection request.');
        return;
      }

      setModalSuccess(
        result?.message ||
          'Connection request sent. If accepted, you will receive the member email.'
      );
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedMember(null);
        setModalSuccess('');
      }, 4000);
      
    } catch {
      setModalError('Failed to send connection request.');
    } finally {
      setConnectingId('');
    }
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setError('');
    setSuccess('');

    try {
      const payload = new FormData();
      payload.append('bio', profileBio.trim());
      if (profilePictureFile) {
        payload.append('profilePicture', profilePictureFile);
      }

      const response = await fetch('/api/member-auth/profile', {
        method: 'PATCH',
        body: payload,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || 'Unable to update profile.');
        return;
      }

      if (result?.member) {
        setMember(result.member);
      }
      setProfilePictureFile(null);
      setSuccess(result?.message || 'Profile updated successfully.');
    } catch {
      setError('Unable to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    setSavingPassword(true);
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please complete all password fields.');
      setSavingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      setSavingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      setSavingPassword(false);
      return;
    }

    try {
      const response = await fetch('/api/member-auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || 'Unable to update password.');
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(result?.message || 'Password updated successfully.');
    } catch {
      setError('Unable to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <main className={styles.dashboardPage}>
      {loading ? (
        <div className={styles.stateCard}>Loading dashboard...</div>
      ) : error && !member ? (
        <div className={styles.errorCard}>{error}</div>
      ) : !member ? (
        <div className={styles.stateCard}>No member profile available.</div>
      ) : (
        <div className={styles.layoutGrid}>
          <aside className={styles.sidebar}>
            <div className={styles.brandBlock}>
              <div className={styles.brandLogoWrap}>
                <img src="/logo.svg" alt="Somaliland Diaspora" className={styles.brandLogo} />
              </div>
              <h3>Somaliland Diaspora</h3>
              <p>Professional Member Dashboard</p>
            </div>

            <nav className={styles.sidebarNav}>
              <button
                type="button"
                className={`${styles.navBtn} ${activeSection === 'members' ? styles.navBtnActive : ''}`}
                onClick={() => setActiveSection('members')}
              >
                <i className="fa-solid fa-users"></i>
                Members
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${activeSection === 'profile' ? styles.navBtnActive : ''}`}
                onClick={() => setActiveSection('profile')}
              >
                <i className="fa-solid fa-user"></i>
                Profile
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${activeSection === 'settings' ? styles.navBtnActive : ''}`}
                onClick={() => setActiveSection('settings')}
              >
                <i className="fa-solid fa-gear"></i>
                Settings
              </button>
              <button
                className={`${styles.navBtn} ${styles.logoutBtn}`}
                type="button"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            </nav>
          </aside>

          <section className={styles.mainPanel}>
            <header className={styles.topBar}>
              <div className={styles.topBarTitle}>
                <h1>Welcome, {member.full_name || 'Member'}</h1>
                <p>Manage your network and profile information from one place.</p>
              </div>
              <div className={styles.topBarRight}>
                <span className={styles.statusBadge}>{String(member.status || 'active').toUpperCase()}</span>
                <div className={styles.profileMenu} ref={profileMenuRef}>
                  <button
                    type="button"
                    className={styles.profileMenuTrigger}
                    onClick={() => setIsProfileMenuOpen((current) => !current)}
                    aria-label="Open profile menu"
                  >
                    <img
                      src={
                        resolveAssetPath(member.profile_picture) ||
                        '/favicon.png'
                      }
                      alt={member.full_name}
                    />
                  </button>
                  {isProfileMenuOpen && (
                    <div className={styles.profileDropdown}>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={styles.dropdownLogoutBtn}
                      >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>
            <div className={styles.contentWrap}>
              {success && <div className={styles.successBanner}>{success}</div>}
              {error && <div className={styles.errorBanner}>{error}</div>}

              {activeSection === 'members' && (
                <div className={styles.card}>
                  <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.statCardMembers}`}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Members</span>
                        <span className={styles.statIcon}>
                          <i className="fa-solid fa-users"></i>
                        </span>
                      </div>
                      <strong className={styles.statValue}>{memberStats.members}</strong>
                      <p className={styles.statMeta}>Directory members available for networking.</p>
                    </div>
                    <div className={`${styles.statCard} ${styles.statCardCountries}`}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Countries</span>
                        <span className={styles.statIcon}>
                          <i className="fa-solid fa-earth-africa"></i>
                        </span>
                      </div>
                      <strong className={styles.statValue}>{memberStats.countries}</strong>
                      <p className={styles.statMeta}>Global representation across active regions.</p>
                    </div>
                    <div className={`${styles.statCard} ${styles.statCardProfessions}`}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Cities</span>
                        <span className={styles.statIcon}>
                          <i className="fa-solid fa-city"></i>
                        </span>
                      </div>
                      <strong className={styles.statValue}>{memberStats.cities}</strong>
                      <p className={styles.statMeta}>Cities currently represented in the directory.</p>
                    </div>
                  </div>

                  <div className={styles.cardHead}>
                    <h2>Members Directory</h2>
                    <span>{filteredMembers.length} total</span>
                  </div>

                  <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Country</label>
                      <select
                        className={styles.selectInput}
                        value={countryFilter}
                        onChange={(event) => setCountryFilter(event.target.value)}
                      >
                        <option value="all">All countries</option>
                        {filterOptions.countries.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className={styles.filterButton}
                      onClick={clearAllFilters}
                    >
                      Clear filters
                    </button>
                  </div>

                  <div className={styles.searchWrap}>
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by name, city or country"
                      className={styles.searchInput}
                    />
                  </div>

                  <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Sort by</label>
                      <select
                        className={styles.selectInput}
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value as SortKey)}
                      >
                        <option value="name">Name</option>
                        <option value="country">Country</option>
                        <option value="city">City</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className={styles.filterButton}
                      onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    >
                      {sortDirection === 'asc' ? 'Sort: A-Z' : 'Sort: Z-A'}
                    </button>
                  </div>

                  {activeFilters.length > 0 && (
                    <div className={styles.activeFiltersWrap}>
                      {activeFilters.map((chip) => (
                        <button
                          key={chip.key}
                          type="button"
                          className={styles.filterChip}
                          onClick={() => clearSingleFilter(chip.key)}
                        >
                          {chip.label} <span aria-hidden="true">×</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredMembers.length === 0 ? (
                    <div className={styles.emptyState}>No members found.</div>
                  ) : (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Member</th>
                            <th>Country</th>
                            <th>City</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedMembers.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className={styles.memberCell}>
                                  <img
                                    src={
                                      resolveAssetPath(item.profile_picture) ||
                                      '/favicon.png'
                                    }
                                    alt={item.full_name}
                                  />
                                  <div>
                                    <strong>{item.full_name}</strong>
                                    <span>Private contact details</span>
                                  </div>
                                </div>
                              </td>
                            <td>{item.country || '-'}</td>
                            <td>{item.city || '-'}</td>
                            <td>
                              <button type="button" className={styles.actionBtn} onClick={() => openConnectModal(item)}>
                                Request Connection
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className={styles.paginationWrap}>
                      <button
                        type="button"
                        className={styles.filterButton}
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        type="button"
                        className={styles.filterButton}
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'profile' && (
              <div className={styles.card}>
                <div className={styles.profileHead}>
                  <img
                    src={
                      resolveAssetPath(member.profile_picture) ||
                      '/assets/imgs/about/about-big-img.png'
                    }
                    alt={member.full_name}
                  />
                  <div>
                    <h2>{member.full_name}</h2>
                    <p>Profile Information</p>
                  </div>
                </div>

                <div className={styles.profileGrid}>
                  <div>
                    <span>Email</span>
                    <strong>{member.email || '-'}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{member.phone || '-'}</strong>
                  </div>
                  <div>
                    <span>City</span>
                    <strong>{member.city || '-'}</strong>
                  </div>
                  <div>
                    <span>Country</span>
                    <strong>{member.country || '-'}</strong>
                  </div>
                  <div>
                    <span>Nationality</span>
                    <strong>{member.country_of_nationality || '-'}</strong>
                  </div>
                  <div>
                    <span>Areas of Interest</span>
                    <strong>{member.areas_of_interest || '-'}</strong>
                  </div>
                </div>

                <div className={styles.profileEditor}>
                  <h3>Edit Profile (Photo & Bio Only)</h3>
                  <div className={styles.settingsGrid}>
                    <div>
                      <label>Profile Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.selectInput}
                        onChange={(event) => setProfilePictureFile(event.target.files?.[0] || null)}
                      />
                    </div>
                    <div>
                      <label>Bio</label>
                      <textarea
                        className={styles.textArea}
                        value={profileBio}
                        onChange={(event) => setProfileBio(event.target.value)}
                        placeholder="Write your short bio"
                      />
                    </div>
                  </div>
                  <div className={styles.profileActions}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={handleProfileSave}
                      disabled={savingProfile}
                    >
                      {savingProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h2>Password Settings</h2>
                </div>
                <div className={styles.settingsGrid}>
                  <div>
                    <label>Current Password</label>
                    <input
                      type="password"
                      className={styles.selectInput}
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label>New Password</label>
                    <input
                      type="password"
                      className={styles.selectInput}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      className={styles.selectInput}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className={styles.profileActions}>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={handlePasswordSave}
                    disabled={savingPassword}
                  >
                    {savingPassword ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
          </section>
        </div>
      )}

      {isModalOpen && selectedMember && (
        <div className={styles.modalBackdrop} onClick={closeConnectModal}>
          <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={closeConnectModal}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className={styles.modalContent}>
              {modalSuccess ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem 2rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{ 
                    width: '72px', 
                    height: '72px', 
                    backgroundColor: '#d1fae5', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)'
                  }}>
                    <svg style={{ width: '36px', height: '36px', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Request Sent</h3>
                  <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6', maxWidth: '350px', marginBottom: '0.5rem' }}>{modalSuccess}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '2rem' }}>This window will close automatically...</p>
                  <button 
                    type="button" 
                    className={styles.primaryBtn} 
                    onClick={closeConnectModal} 
                    style={{ width: '100%', maxWidth: '200px' }}
                  >
                    Close Now
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.modalTop}>
                    <h3>Request Connection</h3>
                    <p>Only the member name, city, and country are shown here. Email stays hidden unless the member accepts.</p>
                  </div>

                  <div className={styles.modalHeader}>
                    <img
                      src={
                        resolveAssetPath(selectedMember.profile_picture) ||
                        '/favicon.png'
                      }
                      alt={selectedMember.full_name}
                    />
                    <div className={styles.modalIdentity}>
                      <h3>{selectedMember.full_name}</h3>
                      <span className={styles.modalLocation}>
                        {[selectedMember.city || '', selectedMember.country || ''].filter(Boolean).join(', ') || 'Location not shared'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.modalForm}>
                    <div>
                      <p className={styles.modalHelper}>
                        Click &apos;Send Request&apos; to notify this member. If they accept your request, you will receive their email address so you can message them directly.
                      </p>
                    </div>
                  </div>

                  {modalError && (
                    <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {modalError}
                    </div>
                  )}

                  <div className={styles.modalActions}>
                    <button type="button" className={styles.secondaryBtn} onClick={closeConnectModal}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={handleConnect}
                      disabled={connectingId === selectedMember.id}
                    >
                      {connectingId === selectedMember.id ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
