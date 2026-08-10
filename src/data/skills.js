/**
 * Technical skills.
 *
 * These are deliberately NOT rendered as visible page copy. They are emitted
 * inside the Person structured data (`knowsAbout`) in src/lib/schema.js, which
 * is the mechanism search engines provide for machine readable facts about an
 * entity. That keeps the page clean while still telling Google what Kane works
 * on.
 *
 * Note on why it is done this way: hidden keyword text in the HTML (a
 * display:none block, white on white, off screen positioning) is listed under
 * Google's spam policies as "hidden text and links" and risks a manual action.
 * Structured data carries the same information and is explicitly sanctioned.
 *
 * Anything here that also appears in visible copy (a project's stack, a career
 * bullet) is doing double duty, and that visible mention is what actually
 * carries ranking weight.
 */

export const skills = {
  languages: ["C++", "Python", "JavaScript", "TypeScript", "SQL", "Java", "HTML", "CSS"],
  systems: [
    "System architecture",
    "System integration",
    "Thermal vacuum testing",
    "Vibration testing",
    "Structural analysis",
    "CAD",
    "Robotics",
    "Control systems",
    "Distributed systems",
    "Security engineering",
    "Mechatronics",
    "Spacecraft ground software",
  ],
  frameworks: [
    "React.js",
    "React Native",
    "Node.js",
    "Firebase",
    "MongoDB",
    "WebSockets",
    "REST APIs",
    "Docker",
    "Git",
    "GitLab CI/CD",
    "AWS",
    "Linux",
    "Postman",
  ],
  ai: [
    "Graph Neural Networks",
    "Computer vision",
    "OpenCV",
    "OpenAI API",
    "Google Gemini",
    "Machine learning",
  ],
};

/** Flat list, used for Person.knowsAbout. */
export const allSkills = [
  ...skills.languages,
  ...skills.systems,
  ...skills.frameworks,
  ...skills.ai,
];
