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
  address?: string;
  profession?: string;
  city?: string;
  country?: string;
  areas_of_interest?: string;
  profile_picture?: string | { id?: string } | null;
  contact_email?: string;
  contact_phone?: string;
};

type DashboardSection = 'members' | 'profile' | 'settings';
type SortKey = 'name' | 'country' | 'profession';

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
  const [professionFilter, setProfessionFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [connectingId, setConnectingId] = useState<string>('');
  const [shareContact, setShareContact] = useState<'none' | 'email' | 'phone'>('none');
  const [requestMessage, setRequestMessage] = useState('');

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

  const extractInterests = (value?: string) =>
    value ? value.split(/[,;/]/).map((item) => item.trim()).filter(Boolean) : [];

  const filterOptions = useMemo(() => {
    const getUnique = (items: Array<string | undefined>) =>
      Array.from(new Set(items.filter(Boolean).map((item) => item!.trim()).filter(Boolean))).sort();

    return {
      professions: getUnique(otherMembers.map((item) => item.profession)),
      countries: getUnique(otherMembers.map((item) => item.country)),
      interests: getUnique(otherMembers.flatMap((item) => extractInterests(item.areas_of_interest))),
    };
  }, [otherMembers]);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const professionKey = professionFilter.toLowerCase();
    const countryKey = countryFilter.toLowerCase();
    const interestKey = interestFilter.toLowerCase();

    return otherMembers.filter((item) => {
      if (professionFilter !== 'all' && (item.profession || '').toLowerCase() !== professionKey) {
        return false;
      }
      if (countryFilter !== 'all' && (item.country || '').toLowerCase() !== countryKey) {
        return false;
      }
      if (interestFilter !== 'all') {
        const interests = extractInterests(item.areas_of_interest).map((value) => value.toLowerCase());
        if (!interests.includes(interestKey)) {
          return false;
        }
      }
      if (!term) return true;

      return [item.full_name, item.profession, item.city, item.country, item.areas_of_interest]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [otherMembers, searchTerm, professionFilter, countryFilter, interestFilter]);

  const sortedMembers = useMemo(() => {
    const list = [...filteredMembers];
    list.sort((a, b) => {
      const aValue =
        sortBy === 'name'
          ? (a.full_name || '').toLowerCase()
          : sortBy === 'country'
            ? (a.country || '').toLowerCase()
            : (a.profession || '').toLowerCase();

      const bValue =
        sortBy === 'name'
          ? (b.full_name || '').toLowerCase()
          : sortBy === 'country'
            ? (b.country || '').toLowerCase()
            : (b.profession || '').toLowerCase();

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
  }, [searchTerm, professionFilter, countryFilter, interestFilter, sortBy, sortDirection]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const memberStats = useMemo(() => {
    const countries = new Set(otherMembers.map((item) => (item.country || '').trim()).filter(Boolean));
    const professions = new Set(otherMembers.map((item) => (item.profession || '').trim()).filter(Boolean));
    const interests = new Set(otherMembers.flatMap((item) => extractInterests(item.areas_of_interest)));

    return {
      members: otherMembers.length,
      countries: countries.size,
      professions: professions.size,
      interests: interests.size,
    };
  }, [otherMembers]);

  const activeFilters = useMemo(() => {
    const chips: Array<{ key: 'search' | 'profession' | 'country' | 'interest'; label: string }> = [];
    if (searchTerm.trim()) chips.push({ key: 'search', label: `Search: ${searchTerm.trim()}` });
    if (professionFilter !== 'all') chips.push({ key: 'profession', label: `Profession: ${professionFilter}` });
    if (countryFilter !== 'all') chips.push({ key: 'country', label: `Country: ${countryFilter}` });
    if (interestFilter !== 'all') chips.push({ key: 'interest', label: `Interest: ${interestFilter}` });
    return chips;
  }, [searchTerm, professionFilter, countryFilter, interestFilter]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setProfessionFilter('all');
    setCountryFilter('all');
    setInterestFilter('all');
  };

  const clearSingleFilter = (key: 'search' | 'profession' | 'country' | 'interest') => {
    if (key === 'search') setSearchTerm('');
    if (key === 'profession') setProfessionFilter('all');
    if (key === 'country') setCountryFilter('all');
    if (key === 'interest') setInterestFilter('all');
  };

  const handleLogout = async () => {
    await fetch('/api/member-auth/logout', { method: 'POST' }).catch(() => null);
    router.push('/member-login');
  };

  const openConnectModal = (memberItem: MembersListItem) => {
    setSelectedMember(memberItem);
    setIsModalOpen(true);
    setSuccess('');
    setError('');
  };

  const closeConnectModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleConnect = async () => {
    if (!selectedMember?.id) return;

    setConnectingId(selectedMember.id);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/member-auth/request-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetMemberId: selectedMember.id,
          shareContact,
          message: requestMessage,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || 'Failed to send message.');
        return;
      }

      setSuccess('Message sent successfully.');
      setRequestMessage('');
      closeConnectModal();
    } catch {
      setError('Failed to send message.');
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
                        <span className={styles.statLabel}>Professions</span>
                        <span className={styles.statIcon}>
                          <i className="fa-solid fa-briefcase"></i>
                        </span>
                      </div>
                      <strong className={styles.statValue}>{memberStats.professions}</strong>
                      <p className={styles.statMeta}>Diverse expertise for collaboration and mentorship.</p>
                    </div>
                    <div className={`${styles.statCard} ${styles.statCardInterests}`}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Interests</span>
                        <span className={styles.statIcon}>
                          <i className="fa-solid fa-lightbulb"></i>
                        </span>
                      </div>
                      <strong className={styles.statValue}>{memberStats.interests}</strong>
                      <p className={styles.statMeta}>Shared initiatives and high-impact focus areas.</p>
                    </div>
                  </div>

                  <div className={styles.cardHead}>
                    <h2>Members Directory</h2>
                    <span>{filteredMembers.length} total</span>
                  </div>

                  <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Profession</label>
                      <select
                        className={styles.selectInput}
                        value={professionFilter}
                        onChange={(event) => setProfessionFilter(event.target.value)}
                      >
                        <option value="all">All professions</option>
                        {filterOptions.professions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
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
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Interest</label>
                      <select
                        className={styles.selectInput}
                        value={interestFilter}
                        onChange={(event) => setInterestFilter(event.target.value)}
                      >
                        <option value="all">All interests</option>
                        {filterOptions.interests.map((option) => (
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
                      placeholder="Search by name, profession, city or country"
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
                        <option value="profession">Profession</option>
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
                            <th>Profession</th>
                            <th>Location</th>
                            <th>Interest</th>
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
                                    <span>{item.contact_email || 'No email shared'}</span>
                                  </div>
                                </div>
                              </td>
                            <td>{item.profession || '-'}</td>
                            <td>{[item.city || '', item.country || ''].filter(Boolean).join(', ') || '-'}</td>
                            <td>{item.areas_of_interest || '-'}</td>
                            <td>
                              <button type="button" className={styles.actionBtn} onClick={() => openConnectModal(item)}>
                                View & Connect
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
              <div className={styles.modalTop}>
                <h3>Connect With Member</h3>
                <p>Send a short professional introduction message.</p>
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
                  <p>{selectedMember.profession || 'Profession not shared'}</p>
                  <span className={styles.modalLocation}>
                    {[selectedMember.city || '', selectedMember.country || ''].filter(Boolean).join(', ') || 'Location not shared'}
                  </span>
                </div>
              </div>

              <div className={styles.modalForm}>
                <div>
                  <label className={styles.modalLabel}>Share contact</label>
                  <select
                    className={styles.selectInput}
                    value={shareContact}
                    onChange={(event) =>
                      setShareContact(event.target.value as 'none' | 'email' | 'phone')
                    }
                  >
                    <option value="none">No contact details</option>
                    <option value="email">Share my email</option>
                    <option value="phone">Share my phone</option>
                  </select>
                </div>
                <div>
                  <label className={styles.modalLabel}>Message</label>
                  <textarea
                    className={styles.modalTextArea}
                    value={requestMessage}
                    onChange={(event) => setRequestMessage(event.target.value)}
                    placeholder="Write a short message to introduce yourself"
                  />
                  <p className={styles.modalHelper}>This message will be sent directly to the member by email.</p>
                </div>
              </div>

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
                  {connectingId === selectedMember.id ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
