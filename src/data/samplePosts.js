const daysAgo = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const samplePosts = [
  {
    id: 1,
    title: "How We Plan a Month of Blog Content",
    author: "Mia Carter",
    content:
      "Planning a month of content becomes much easier when every post starts with a clear goal, target reader, and publishing date. A simple shared calendar helps the team stay aligned and avoid last-minute confusion.",
    tags: ["Planning", "Workflow"],
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
  },
  {
    id: 2,
    title: "Writing Product Updates Readers Actually Finish",
    author: "Noah Bennett",
    content:
      "Readers stay engaged when product updates focus on outcomes instead of internal process. Short sections, plain language, and one clear takeaway per update make every announcement easier to understand.",
    tags: ["Writing", "Product"],
    createdAt: daysAgo(16),
    updatedAt: daysAgo(4),
  },
  {
    id: 3,
    title: "A Simple SEO Checklist for New Articles",
    author: "Olivia Reed",
    content:
      "A lightweight SEO checklist keeps new articles consistent without slowing down the team. Start with search intent, use descriptive headings, add helpful internal links, and make the introduction answer the reader's first question quickly.",
    tags: ["SEO", "Content"],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(6),
  },
  {
    id: 4,
    title: "Why Editorial Dashboards Should Feel Calm",
    author: "Mia Carter",
    content:
      "A calm dashboard helps content teams focus on decisions instead of noise. Clear summaries, clean spacing, and visible priorities make it easier to spot what matters and move the next post forward.",
    tags: ["Design", "Dashboard"],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(8),
  },
  {
    id: 5,
    title: "Refreshing Old Posts Without Rewriting Everything",
    author: "Liam Scott",
    content:
      "Refreshing older posts can deliver strong results even with small updates. Improving examples, checking links, tightening structure, and updating statistics often gives existing content a second life.",
    tags: ["Optimization", "Editing"],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
];
