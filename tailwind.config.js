/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)",
          2: "rgb(var(--paper-2-rgb) / <alpha-value>)",
        },
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        rule: "rgb(var(--rule-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["var(--font-serif)", "Iowan Old Style", "Georgia", "serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      /*
       * Tailwind's opacity scale runs in steps of 5, so `border-rule/12` never
       * generated and every element using it silently fell back to preflight's
       * default border colour (#e5e7eb, an opaque near-white). On a white page
       * that passes for a normal hairline; on a dark one it glares. These two
       * entries are the hairline weights the drawing language is built on.
       */
      opacity: {
        8: "0.08",
        12: "0.12",
      },
      maxWidth: {
        sheet: "78rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
