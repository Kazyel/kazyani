"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";

interface ComboBoxProps {
  characterNames: string[];
  placeholder?: string;
}

export const ComboBox = ({ characterNames, placeholder }: ComboBoxProps) => {
  const [characterSearch, setCharacterSet] = useState<string>("");
  const [openList, setOpenList] = useState<boolean>(false);

  const [sortedCharacterNames, setSortedCharacterNames] = useState<string[]>(
    characterNames.sort((a, b) => a.localeCompare(b))
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    if (searchTerm.length === 0) {
      setOpenList(false);
      setCharacterSet("");
      setSortedCharacterNames(characterNames);
      return;
    }

    setOpenList(true);
    setCharacterSet(searchTerm);
    setSortedCharacterNames(
      characterNames
        .filter((characterName) => characterName.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 10)
    );
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={characterSearch}
        onBlur={() => setOpenList(false)}
        onChange={(e) => handleSearch(e)}
      />

      {openList && sortedCharacterNames.length > 0 && (
        <div
          id="anime-list"
          className="bg-background overflow-scroll flex flex-col w-full absolute top-11 max-h-[172px] rounded-sm border border-white/25"
        >
          {sortedCharacterNames.map((characterName, index) => {
            return (
              <span className="text-sm hover:bg-muted-foreground/10 px-2 py-1" key={index}>
                {characterName}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
