export const site = {
  name: "Nishan's Gists",
  author: "Nishan Dhakal",
  url: process.env.SITE_URL || "https://gist.dhakalnishan.com.np",
  description:
    "Code snippets, ideas and notes — all in one place. Gists by Nishan Dhakal.",
  tagline: "Code snippets, ideas and notes — all in one place.",
  roles: ["Developer", "Learner", "Builder"] as const,
  location: "Nepal",
  avatar: process.env.GITHUB_USERNAME
    ? `https://github.com/${process.env.GITHUB_USERNAME}.png?size=240`
    : "https://avatars.githubusercontent.com/u/9919?s=240",
};
