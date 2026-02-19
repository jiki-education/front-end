import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "format-response" as const,
    name: "Format the response",
    description:
      "Create a favoriteArtists function that takes a username, fetches their data from the Spotify API, and returns a formatted sentence listing their favorite artists.",
    hints: [
      "Build the user API URL by concatenating the base URL with the username",
      "Check for errors in the response using hasKey() before processing",
      "Loop through items to get artist URLs, then fetch each one for the artist name",
      "Format the artist names into a sentence with commas and ', and ' before the last name"
    ],
    requiredScenarios: ["spotify-fred", "spotify-ihid", "spotify-griffin"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "spotify-fred",
    name: "Fred's favourites",
    description: "Retrieve and format Fred's favourite artists.",
    taskId: "format-response",
    functionName: "favorite_artists",
    args: ["fred"],
    expected: "fred's most listened to artists are: Glee, NSYNC, Beethoven, and Limp Bizkit!"
  },
  {
    slug: "spotify-ihid",
    name: "iHiD's favourites",
    description: "Retrieve and format iHiD's favourite artists.",
    taskId: "format-response",
    functionName: "favorite_artists",
    args: ["iHiD"],
    expected:
      "iHiD's most listened to artists are: Counting Crows, Rage Against The Machine, Damien Rice, Eminem, and Bastille!"
  },
  {
    slug: "spotify-griffin",
    name: "griffin is hiding",
    description: "Handle an unknown user error gracefully.",
    taskId: "format-response",
    functionName: "favorite_artists",
    args: ["griffin"],
    expected: "Error: Unknown user"
  }
];
