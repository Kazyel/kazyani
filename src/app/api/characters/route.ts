import { NextRequest, NextResponse } from "next/server";
import { AnimeResponse } from "../animes/route";

export async function GET(req: NextRequest, res: NextResponse) {
  const response = await fetch("http://localhost:3000/api/animes?pageCount=5");

  const { franchiseList, allMainAnimes }: AnimeResponse = await response.json();

  return NextResponse.json({});
}
