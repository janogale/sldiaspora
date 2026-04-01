"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoryOption = {
  value: string;
  label: string;
};

type Props = {
  requestedCategory: string;
  options: CategoryOption[];
};

export default function ArticleCategoryFilter({
  requestedCategory,
  options,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div style={{ minWidth: "min(100%, 420px)" }}>
      <label
        htmlFor="article-category"
        style={{
          fontSize: "1.12rem",
          fontWeight: 800,
          color: "#36554d",
          letterSpacing: "0.3px",
          textTransform: "uppercase",
          marginBottom: "12px",
          display: "block",
        }}
      >
        Filter by Category
      </label>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {options.map((option) => {
          const isActive = requestedCategory === option.value;

          return (
            <button
              key={option.value || "all-pill"}
              type="button"
              onClick={() => handleChange(option.value)}
              style={{
                border: isActive ? "1px solid #0a6d3a" : "1px solid #cadfd3",
                background: isActive ? "#0a6d3a" : "#ffffff",
                color: isActive ? "#ffffff" : "#26453c",
                borderRadius: "999px",
                padding: "11px 18px",
                fontSize: "1.08rem",
                fontWeight: 800,
                minHeight: "48px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
