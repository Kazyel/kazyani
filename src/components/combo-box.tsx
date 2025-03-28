"use client";

import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from "react";
import { Input } from "./ui/input";

interface ComboBoxProps {
  data: string[];
  placeholder?: string;
}

export const ComboBox = ({ data, placeholder }: ComboBoxProps) => {
  const [characterSearch, setCharacterSearch] = useState<string>("");

  const [openList, setOpenList] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [sortedCharacterNames, setSortedCharacterNames] = useState<string[]>(
    data.sort((a, b) => a.localeCompare(b))
  );

  useEffect(() => {
    setHighlightedIndex(sortedCharacterNames.length > 0 ? 0 : -1);
  }, [sortedCharacterNames]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    if (searchTerm.length === 0) {
      setOpenList(false);
      setCharacterSearch("");
      setSortedCharacterNames(data);
      return;
    }

    setOpenList(true);
    setCharacterSearch(searchTerm);
    setSortedCharacterNames(
      data
        .filter((characterName) => characterName.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 10)
    );
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
          setCharacterSearch(sortedCharacterNames[highlightedIndex]);
          setOpenList(false);
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

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  const handleSelect = (characterName: string) => {
    setCharacterSearch(characterName);
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

      {openList && sortedCharacterNames.length > 0 && (
        <ul
          ref={listRef}
          id="anime-list"
          role="listbox"
          className="bg-background overflow-auto flex flex-col w-full absolute top-11 max-h-[172px] rounded-sm border border-white/25 z-10"
          tabIndex={-1}
        >
          {sortedCharacterNames.map((characterName, index) => {
            return (
              <li
                key={index}
                role="option"
                className={`text-sm px-2 py-1 cursor-pointer ${
                  highlightedIndex === index ? "bg-muted-foreground/20" : ""
                }`}
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
