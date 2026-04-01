"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoryOption = {
  value: string;
  label: string;
};

type InlineStyle = {
  [key: string]: string | number;
};

type Props = {
  requestedCategory: string;
  options: CategoryOption[];
  labelStyle: InlineStyle;
  selectStyle: InlineStyle;
};

export default function ArticleCategoryFilter({
  requestedCategory,
  options,
  labelStyle,
  selectStyle,
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
    <div>
      <label htmlFor="article-category" style={labelStyle}>
        Article Category
      </label>
      <select
        id="article-category"
        name="category"
        value={requestedCategory}
        style={selectStyle}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
