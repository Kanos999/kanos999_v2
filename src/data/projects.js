/**
 * Projects index.
 *
 * Add entries at the top: the page reads this array in order. Every field
 * except `id`, `title` and `summary` is optional; the card degrades cleanly
 * when one is missing.
 *
 *   id          Part number shown in the card gutter. Keep the PRJ-00n format.
 *   title       Project name.
 *   year        String, so ranges like "2024 to 25" work.
 *   disciplines Any of DISCIPLINES below. Drives the filter chips.
 *   summary     One or two sentences. This is the card body.
 *   note        Optional serif one liner, the editorial aside under the title.
 *   stack       Tools, languages, materials, processes.
 *   status      "Live" | "Complete" | "In progress" | "Archived" | "Case study soon"
 *   href        Optional link. External URLs open in a new tab automatically.
 *   role        Optional, shown in structured data.
 */

export const DISCIPLINES = ["Software", "Mechanical", "Mechatronics"];

export const projects = [
  {
    id: "PRJ-001",
    title: "Convoii",
    year: "2025",
    disciplines: ["Software"],
    role: "Solo founder and developer",
    summary:
      "A cross platform mobile app for real time proximity voice communication between motorcyclists, with open comms for nearby riders and private crew channels. I designed and built the whole thing: the app, the interface, the icon pipeline, and the product strategy around a cold start density problem.",
    note: "Proximity voice comms for motorcyclists.",
    stack: ["React Native", "Expo", "Reanimated", "Node.js"],
    status: "In progress",
    href: "",
  },
  {
    id: "PRJ-002",
    title: "GNN for Mechanical Health Monitoring",
    year: "2026",
    disciplines: ["Software", "Mechatronics"],
    role: "Thesis",
    summary:
      "My thesis. A graph neural network approach to health monitoring of robotic systems, modelling mechanical components and the interactions between them so degradation and faults show up before they become failures.",
    note: "Teaching a network the shape of a machine.",
    stack: ["Python", "Graph Neural Networks", "PyTorch"],
    status: "Complete",
    href: "",
  },
  {
    id: "PRJ-003",
    title: "Cycloidal Drive and Robot Arm",
    year: "2025",
    disciplines: ["Mechanical", "Mechatronics"],
    role: "Design and build",
    summary:
      "A dual disc cycloidal drive designed from first principles, as the basis for a 4 to 5 DoF robot arm. The drawing on the home page is generated from this design: the disc profile, pin ring and reduction are all computed from its real parameters. Drive built, arm next.",
    note: "The drive the home page is drawn from.",
    stack: ["CAD", "Mechanical design", "Kinematics"],
    status: "In progress",
    href: "",
  },
  {
    id: "PRJ-004",
    title: "Table Tennis Computer Vision",
    year: "2024",
    disciplines: ["Software"],
    summary:
      "A real time ball tracking system using HSV filtering and motion analysis to measure ball speed accurately from ordinary video.",
    note: "Tracking a 40mm ball at speed.",
    stack: ["Python", "OpenCV"],
    status: "Archived",
    href: "",
  },
  {
    id: "PRJ-005",
    title: "Stockman",
    year: "2024",
    disciplines: ["Software"],
    summary:
      "A full stack inventory management system with complete CRUD functionality and a clean interface, plus a web scraper that automates product data collection.",
    note: "Stock management, end to end.",
    stack: ["React.js", "Node.js", "MongoDB", "Tailwind"],
    status: "Archived",
    href: "",
  },
  {
    id: "PRJ-006",
    title: "Click and Collect Valet",
    year: "2023",
    disciplines: ["Software"],
    summary:
      "A real time order management system deployed in a working retail environment, handling up to 12 concurrent valets and hundreds of orders a day.",
    note: "Built for a live shop floor.",
    stack: ["JavaScript", "Firebase", "HTML", "CSS"],
    status: "Live",
    href: "https://officeworkscollect.web.app",
  },
  {
    id: "PRJ-007",
    title: "ASCII Ocean",
    year: "2024",
    disciplines: ["Software"],
    summary:
      "A generative ocean rendered entirely in text. 3D simplex noise sampled per character cell and redrawn at 30fps in the browser. It was the background of the previous version of this site, and it now lives on the 404 page.",
    note: "Fluid motion out of a fixed character grid.",
    stack: ["JavaScript", "React", "simplex-noise"],
    status: "Live",
    href: "/this-page-does-not-exist",
  },
];
