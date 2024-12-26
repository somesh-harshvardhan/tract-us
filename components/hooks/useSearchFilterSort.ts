import { useState, useMemo } from "react";

type UseSearchFilterSortOptions<T> = {
  data: T[];
  searchBy: (item: T, query: string) => boolean;
  filterBy: (item: T, filter: string) => boolean;
  sortBy: (a: T, b: T, sortKey: string) => number;
};

export function useSearchFilterSort<T>({
  data,
  searchBy,
  filterBy,
  sortBy,
}: UseSearchFilterSortOptions<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("0");
  const [sortKey, setSortKey] = useState("name");

  const filteredData = useMemo(() => {
    return data
      .filter((item) => searchBy(item, search))
      .filter((item) => (filter === "0" ? true : filterBy(item, filter)))
      .sort((a, b) => (sortKey ? sortBy(a, b, sortKey) : 0));
  }, [data, search, filter, sortKey, searchBy, filterBy, sortBy]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    sortKey,
    setSortKey,
    filteredData,
  };
}
