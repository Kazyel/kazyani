"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const fetchRequest = async () => {
  const response = await fetch("http://localhost:3000/api/character");
  const data = await response.json();
  return data;
};

export default function GuessCharacter() {
  const [currentCharacter, setCurrentCharacter] = useState<any>(null);

  const fetchData = async () => {
    const data = await fetchRequest();
    console.log(data);
  };

  return (
    <div>
      Guess Character
      <Button onClick={fetchData}>GET REQUEST</Button>
      {/* <div className="text-white">{JSON.stringify(currentCharacter?.data?.data?.name)}</div> */}
    </div>
  );
}
