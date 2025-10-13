"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function SearchBar({ setSearch }: { setSearch: (searchQuery: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text2)]"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search mods, parts, accessories..."
          className="pl-10 pr-4 py-3 w-full bg-[var(--bg-dark2)] border-[var(--bg-dark3)] text-[var(--text1)]"
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          value={searchQuery}
        />
      </div>
      <Button
        variant="outline"
        className="px-4 py-3"
        onClick={() => {
          setSearchQuery("");
        }}
      >
        <X size={18} />
      </Button>
    </div>
  );
}
