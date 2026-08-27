import { Figtree, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd, SITE_URL, identityGraph } from "@/lib/schema";

/* Type system
 * sans   Figtree, geometric with rounded terminals. Body and headings.
 * serif  Instrument Serif, high contrast editorial. Display accents only.
 * mono   IBM Plex Mono, the annotation layer: part numbers, field labels.
 */
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

/* Title and description carry the disambiguator.
 *
 * The name alone belongs to someone else with a far larger press footprint, so
 * competing for it bare is not the goal. These are written for the qualified
 * queries instead, the ones where intent is already specific: "Kane Jackson
 * space engineer", "Kane Jackson ANT61", "Kane Jackson satellite". Every one of
 * those terms appears here alongside the name, and Sydney is in both so the
 * location never has to be inferred.
 */
const title = "Kane Jackson — Space Software Engineer, Sydney | ANT61";
const description =
  "Kane Jackson is a space industry software engineer in Sydney, Australia. Mission Software Lead at ANT61, working on satellite and spacecraft ground software behind the ANT61 Beacon, with a mechatronics background covering robotics, mechanical design and flight hardware qualification. UNSW Mechatronic Engineering and Computer Science.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | Kane Jackson, Space Software Engineer",
  },
  description,
  applicationName: "Kane Jackson",
  authors: [{ name: "Kane Jackson", url: SITE_URL }],
  creator: "Kane Jackson",
  publisher: "Kane Jackson",
  category: "technology",
  // Qualified queries first. These are the ones worth owning outright.
  keywords: [
    "Kane Jackson space engineer",
    "Kane Jackson ANT61",
    "Kane Jackson satellite",
    "Kane Jackson software engineer",
    "Kane Jackson Sydney",
    "Kane Jackson UNSW",
    "Kane H. Jackson",
    "Kane Jackson",
    "space software engineer Sydney",
    "mechatronics engineer Sydney",
    "spacecraft ground software",
    "satellite telemetry software",
    "mission software",
    "robotics engineer",
    "ANT61",
    "ANT61 Beacon",
    "UNSW mechatronics",
    "cycloidal drive",
    "graph neural networks",
    "computer vision",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Kane Jackson",
    type: "profile",
    locale: "en_AU",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Kane Jackson, space software engineer in Sydney and Mission Software Lead at ANT61",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#0c0f13",
  colorScheme: "dark",
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en-AU"
      className={`${figtree.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
    >
      <body className="relative bg-paper font-sans text-ink antialiased">
        <JsonLd schemas={identityGraph()} />
        {/* The sheet: graph rule behind the hero, scrolling with the page and
            fading out before the first section of body copy. */}
        <div
          aria-hidden
          className="sheet-grid pointer-events-none absolute inset-x-0 top-0 z-0 h-[170vh] max-h-full md:h-[115vh]"
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
