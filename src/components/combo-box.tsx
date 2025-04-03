"use client";

import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent, useCallback } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
interface ComboBoxProps {
  data: string[];
  placeholder?: string;
  isCorrect: boolean;
  showHint?: boolean;
  hasChecked?: boolean;
  onSelect: (value: string) => void;
  onChange: (value: string) => void;
}

export const ComboBox = ({
  data,
  placeholder,
  isCorrect,
  showHint,
  hasChecked,
  onSelect,
  onChange,
}: ComboBoxProps) => {
  const [characterSearch, setCharacterSearch] = useState<string>("");
  const [sortedCharacterNames, setSortedCharacterNames] = useState<string[]>(
    data.sort((a, b) => a.localeCompare(b))
  );
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [openList, setOpenList] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    setHighlightedIndex(sortedCharacterNames.length > 0 ? 0 : -1);
  }, [sortedCharacterNames]);

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    if (searchTerm.length === 0 && !characterSearch) {
      setOpenList(false);
      return;
    }

    setOpenList(true);
    setCharacterSearch(searchTerm);

    setSortedCharacterNames(
      data
        .filter((characterName) => characterName.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
          const aStartsWith = a.toLowerCase().startsWith(searchTerm.toLowerCase());
          const bStartsWith = b.toLowerCase().startsWith(searchTerm.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return a.localeCompare(b);
        })
        .slice(0, 10)
    );

    onChange(searchTerm);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!openList || sortedCharacterNames.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev === sortedCharacterNames.length - 1 ? 0 : prev + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev <= 0 ? sortedCharacterNames.length - 1 : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < sortedCharacterNames.length) {
          handleSelect(sortedCharacterNames[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setOpenList(false);
        break;
      case "Tab":
        setOpenList(false);
        break;
    }
  };

  const handleSelect = (inputValue: string) => {
    onSelect(inputValue);
    setCharacterSearch(inputValue);
    setOpenList(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={characterSearch}
        className={cn(
          "bg-background rounded-md border border-indigo-border focus-visible:ring-indigo-border focus-visible:ring-[2px] focus-visible:border-indigo-500/50 pr-6 placeholder:text-indigo-200/65",
          showHint &&
            !hasChecked &&
            "border-red-500/50 focus-visible:ring-red-500/50 focus-visible:ring-[2px] focus-visible:border-red-500/50"
        )}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpenList(false)}
        onFocus={() => {
          if (characterSearch && sortedCharacterNames.length > 0) {
            setOpenList(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={openList}
        aria-controls="anime-list"
      />

      {characterSearch && !hasChecked && (
        <span
          onClick={() => {
            setCharacterSearch("");
            onSelect("");
          }}
          className="absolute right-2 top-1.5 cursor-pointer"
        >
          ×
        </span>
      )}

      {hasChecked && (
        <div className="h-6 mt-1">
          {isCorrect ? (
            <span className="text-green-500 text-sm">✓ Correct</span>
          ) : (
            <div className="text-red-500 text-sm">✗ Incorrect</div>
          )}
        </div>
      )}

      {openList && sortedCharacterNames.length > 0 && (
        <ul
          id="anime-list"
          role="listbox"
          className="bg-background overflow-auto flex flex-col  w-full absolute top-11 max-h-[192px] rounded-sm border border-indigo-border z-10"
          tabIndex={-1}
        >
          {sortedCharacterNames.map((characterName, index) => {
            return (
              <li
                key={index}
                role="option"
                className={cn(
                  "text-sm px-2 py-2 cursor-pointer bg-background",
                  highlightedIndex === index && "bg-indigo-500/15"
                )}
                ref={(el) => {
                  if (el) itemRefs.current[index] = el;
                }}
                onMouseDown={() => handleSelect(characterName)}
                onMouseEnter={() => setHighlightedIndex(index)}
                aria-selected={highlightedIndex === index}
              >
                {characterName}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
