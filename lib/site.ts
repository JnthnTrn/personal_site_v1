// Everything personal lives here. Edit this file to change what the site says.
export const site = {
  name: "Jonathan Tran",
  initials: "JT",
  role: "Computer Science & Data Science at UC Berkeley",
  tagline: "I build machine-learning and full-stack systems, and I like knowing what's happening underneath them.",
  about: [
    "I'm studying Computer Science and Data Science at UC Berkeley. Right now I'm an ML engineering intern at iPick.AI, building an LLM-powered portfolio tool and a reinforcement-learning loop that re-ranks picks across 5,000+ stocks from weekly performance.",
    "Before that I extended an ETL pipeline at ManuFlow so it could take schema changes on the fly, and built a combinatorial alarm-configuration system at Hatch for an app with more than four million users.",
    "Off the clock I'm at the gym, on a volleyball court, or dilly-dallying with friends. I watch a lot of movies, sci-fi above everything else, and there's always music on.",
    "I love learning history, which is most of why I travel: I'd rather stand where it happened than only read about it.",
  ],
  facts: [
    { label: "Based in", value: "San Francisco, CA" },
    { label: "Studying", value: "Computer Science & Data Science" },
    { label: "Currently", value: "ML Engineering Intern, iPick.AI" },
  ],
  location: { label: "San Francisco, CA", coords: "37.77°N 122.42°W", timeZone: "America/Los_Angeles" },
  email: "jnthntrn@berkeley.edu",
  github: "JnthnTrn",
  linkedin: "https://www.linkedin.com/in/JnthnTrn",
  resume: "/resume.pdf",
};

export const githubUrl = `https://github.com/${site.github}`;

// The sport being learned right now. When you move on, push the old one onto `completed` and swap in the new one.
export const sideQuest = {
  current: "Soccer",
  note: "Picked it up recently and learning the fundamentals.",
  goal: "Pull off an elastico in a real game.",
  completed: [] as string[],
};

// Shown in the Projects panel, in this order. Add a new entry to feature another project.
export const projects = [
  {
    name: "LoL Performance Analyzer",
    status: "Ongoing",
    description:
      "Full-stack match analyzer on the Riot Games API. A REST layer turns raw match data into per-player stats, cached in DynamoDB with a cache-aside pattern, and the whole stack ships through Docker and GitHub Actions.",
    stack: ["TypeScript", "Next.js", "Express", "AWS DynamoDB", "Docker"],
    url: `${githubUrl}/LeagueOfLegos`,
  },
  {
    name: "SaveBites",
    status: null,
    description:
      "Grocery tracker that cuts student food waste. Built the OCR receipt scanner, which reads more than ten receipt formats and feeds the ingredients into recipe generation.",
    stack: ["Next.js", "React", "Node.js", "FastAPI", "MongoDB"],
    url: `${githubUrl}/SaveBites`,
  },
];
