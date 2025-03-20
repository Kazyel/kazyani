"use client";

import { useState, useEffect } from "react";
import { AnimesMediaResponse } from "@/lib/types/api";

const fetchCharacters = async () => {
  const response = await fetch("http://localhost:3000/api/characters");

  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }

  const data: AnimesMediaResponse = await response.json();

  if (!data) {
    throw new Error("Failed to parse characters JSON");
  }

  return data;
};

export const useGetCharacters = () => {
  const [data, setData] = useState<AnimesMediaResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchCharacters();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
