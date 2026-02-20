import type { ExternalFunction, ExecutionContext } from "@jiki/interpreters";
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

const userArtistIds: Record<string, string[]> = {
  fred: ["3TVXtAsR1Inumwj472S9r4", "8G9QnLx9NcXJF7cbZcHeqV", "A2qGv8w9Ne6wN6fYuaEz4n", "3YQKmKGau1PzlVlkL1iodx"],
  iHiD: [
    "0vEsuISMWAKNctLlUAhSZC",
    "2d0hyoQ5ynDBnkvAbJKORj",
    "14r9dR01KeBLFfylVSKCZQ",
    "7dGJo4pcD2V6oG8kP0tJRR",
    "7EQ0qTo7fWT7DPxmxtSYEc"
  ]
};

const artistNames: Record<string, string> = {
  "0vEsuISMWAKNctLlUAhSZC": "Counting Crows",
  "2d0hyoQ5ynDBnkvAbJKORj": "Rage Against The Machine",
  "14r9dR01KeBLFfylVSKCZQ": "Damien Rice",
  "7dGJo4pcD2V6oG8kP0tJRR": "Eminem",
  "7EQ0qTo7fWT7DPxmxtSYEc": "Bastille",
  "3TVXtAsR1Inumwj472S9r4": "Glee",
  "8G9QnLx9NcXJF7cbZcHeqV": "NSYNC",
  A2qGv8w9Ne6wN6fYuaEz4n: "Beethoven",
  "3YQKmKGau1PzlVlkL1iodx": "Limp Bizkit"
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockFetch(_ctx: ExecutionContext, url: any, _params: any): Record<string, any> {
  const urlStr = url.value ?? url;

  if (typeof urlStr === "string" && urlStr.startsWith("https://api.spotify.com/v1/users/")) {
    const match = urlStr.match(/https:\/\/api\.spotify\.com\/v1\/users\/([a-zA-Z]+)/);
    if (match?.[1] === undefined) return { error: "Could not parse URL" };

    const artists = userArtistIds[match[1]];
    if (artists === undefined) return { error: "Unknown user" };

    return {
      items: artists.map((id) => ({
        urls: { spotify_api: `https://api.spotify.com/v1/artists/${id}` }
      }))
    };
  }

  if (typeof urlStr === "string" && urlStr.startsWith("https://api.spotify.com/v1/artists/")) {
    const match = urlStr.match(/https:\/\/api\.spotify\.com\/v1\/artists\/([a-zA-Z0-9]+)/);
    if (match?.[1] === undefined) return { error: "Could not parse URL" };

    const name = artistNames[match[1]];
    if (!name) return { error: "Unknown artist" };
    return { name };
  }

  return { error: "Unknown URL" };
}

export default class SpotifyExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions: ExternalFunction[] = [
    {
      name: "fetch",
      func: mockFetch,
      description: "fetched data from the provided URL",
      arity: 2
    }
  ];
}
