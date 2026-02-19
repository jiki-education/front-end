import { type ExecutionContext, type ExternalFunction, type Shared, isString, isDictionary } from "@jiki/interpreters";
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class SpotifyExercise extends IOExercise {
  static slug = metadata.slug;

  static availableFunctions: ExternalFunction[] = [
    {
      name: "fetch",
      func: SpotifyExercise.fetchData,
      description: "fetched data from the provided URL",
      arity: 2
    }
  ];

  private static fetchData(
    executionCtx: ExecutionContext,
    url: Shared.JikiObject,
    _params: Shared.JikiObject
  ): Record<string, unknown> {
    if (!isString(url)) {
      return executionCtx.logicError("URL must be a string");
    }
    if (!isDictionary(_params)) {
      return executionCtx.logicError("Params must be a dictionary");
    }

    const urlStr = url.value;

    if (urlStr.startsWith("https://api.spotify.com/v1/users/")) {
      return SpotifyExercise.spotifyUserRequest(urlStr);
    }
    if (urlStr.startsWith("https://api.spotify.com/v1/artists/")) {
      return SpotifyExercise.spotifyArtistRequest(urlStr);
    }
    return { error: "Unknown URL" };
  }

  private static spotifyUserRequest(url: string): Record<string, unknown> {
    const match = url.match(/https:\/\/api\.spotify\.com\/v1\/users\/([a-zA-Z]+)/);
    if (!match || !match[1]) {
      return { error: "Could not parse URL" };
    }
    const username = match[1];

    const artistMap: Record<string, string[]> = {
      fred: ["3TVXtAsR1Inumwj472S9r4", "8G9QnLx9NcXJF7cbZcHeqV", "A2qGv8w9Ne6wN6fYuaEz4n", "3YQKmKGau1PzlVlkL1iodx"],
      iHiD: [
        "0vEsuISMWAKNctLlUAhSZC",
        "2d0hyoQ5ynDBnkvAbJKORj",
        "14r9dR01KeBLFfylVSKCZQ",
        "7dGJo4pcD2V6oG8kP0tJRR",
        "7EQ0qTo7fWT7DPxmxtSYEc"
      ]
    };

    const artists = artistMap[username];
    if (!artists) {
      return { error: "Unknown user" };
    }

    return {
      items: artists.map((id) => ({
        urls: { spotify_api: `https://api.spotify.com/v1/artists/${id}` }
      }))
    };
  }

  private static spotifyArtistRequest(url: string): Record<string, unknown> {
    const match = url.match(/https:\/\/api\.spotify\.com\/v1\/artists\/([a-zA-Z0-9]+)/);
    if (!match || !match[1]) {
      return { error: "Could not parse URL" };
    }

    const nameMap: Record<string, string> = {
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

    const name = nameMap[match[1]];
    if (!name) {
      return { error: "Unknown artist" };
    }
    return { name };
  }
}
