"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export interface FilterState {
  faculty: string;
  educationLevel: string;
  year: string;
  academicYear: string;
  rating: string;
  search: string;
}

export const EMPTY_FILTERS: FilterState = {
  faculty: "all",
  educationLevel: "all",
  year: "all",
  academicYear: "all",
  rating: "all",
  search: "",
};

interface FilterBarProps {
  faculties: string[];
  academicYears: string[];
  onChange: (filters: FilterState) => void;
}

export function FilterBar({
  faculties,
  academicYears,
  onChange,
}: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  const update = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
  };

  const hasActive =
    filters.faculty !== "all" ||
    filters.educationLevel !== "all" ||
    filters.year !== "all" ||
    filters.academicYear !== "all" ||
    filters.rating !== "all" ||
    filters.search !== "";

  return (
    <div className="bg-white border border-border rounded-lg p-4 shadow-sm space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Пошук за ПІБ, компанією або темою..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Select
          value={filters.faculty}
          onValueChange={(v) => update("faculty", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Факультет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі факультети</SelectItem>
            {faculties.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.educationLevel}
          onValueChange={(v) => update("educationLevel", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Рівень освіти" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі рівні</SelectItem>
            <SelectItem value="Бакалавр">Бакалавр</SelectItem>
            <SelectItem value="Магістр">Магістр</SelectItem>
            <SelectItem value="Аспірант">Аспірант</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.year} onValueChange={(v) => update("year", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Курс" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі курси</SelectItem>
            {[1, 2, 3, 4, 5, 6].map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y} курс
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.academicYear}
          onValueChange={(v) => update("academicYear", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Навчальний рік" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі роки</SelectItem>
            {academicYears.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.rating}
          onValueChange={(v) => update("rating", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Рейтинг" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Будь-який рейтинг</SelectItem>
            <SelectItem value="5">😁 Відмінно</SelectItem>
            <SelectItem value="4">😊 Дуже добре</SelectItem>
            <SelectItem value="3">🙂 Добре</SelectItem>
            <SelectItem value="2">😐 Задовільно</SelectItem>
            <SelectItem value="1">😞 Незадовільно</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActive && (
        <div className="flex justify-end pt-1">
          <Button variant="ghost" size="sm" onClick={reset}>
            <X className="h-4 w-4" />
            Скинути фільтри
          </Button>
        </div>
      )}
    </div>
  );
}
