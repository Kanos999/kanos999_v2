import { Figtree, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd, SITE_URL, personSchema, websiteSchema } from "@/lib/schema";

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

const title = "Kane Jackson | Space, Robotics and Mechatronics Engineer";
const description =
  "Kane Jackson is a space industry engineer in Sydney. Mission Software Lead at ANT61, working on spacecraft ground software, robotics and AI, with a mechatronics background covering mechanical design and flight hardware qualification.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | Kane Jackson",
  },
  description,
  applicationName: "Kane Jackson",
  authors: [{ name: "Kane Jackson", url: SITE_URL }],
  creator: "Kane Jackson",
  publisher: "Kane Jackson",
  category: "technology",
  keywords: [
    "Kane Jackson",
    "Kane Jackson engineer",
    "Kane Jackson Sydney",
    "mechatronics engineer Sydney",
    "space software engineer",
    "spacecraft ground software",
    "mission software",
    "robotics engineer",
    "ANT61",
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
        alt: "Kane Jackson, space, robotics and mechatronics engineer",
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
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-AU"
      className={`${figtree.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
    >
      <body className="relative bg-paper font-sans text-ink antialiased">
        <JsonLd schemas={[personSchema(), websiteSchema()]} />
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
