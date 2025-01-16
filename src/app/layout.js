
import "./globals.css";


export const metadata = {
  title: "Kane Jackson",
  description: "Programmer, Engineer, space & AI enthusiast. Welcome to my little corner of the internet <3",
  keywords: [
    "computer science",
    "mechatronics",
    "mechanical",
    "software",
    "engineer",
    "node",
    "ANT61",
    "InnerSteps",
    "python",
    "javascript",
    "react",
    "machine learning",
    "data science"
  ],
  image:
    "https://media.licdn.com/dms/image/v2/D5603AQH0VL5n3_wESg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1706141727108?e=1742428800&v=beta&t=jIHjJrpF9nVeiPHTEHbHcx_YTHFuXotx4WJYUKrHWbk",
  dateCreated: "2024-01-11T11:35:00+07:00",
  datePublished: "2024-01-11T11:35:00+07:00",
  dateModified: "2024-01-11T11:35:00+07:00",
  author: {
    "@type": "Person",
    name: "Kane Jackson",
    url: "https://www.linkedin.com/in/kanehjackson"
  },
  publisher: {
    "@type": "Person",
    name: "Kane Jackson",
    logo: {
      "@type": "ImageObject",
      url: "https://media.licdn.com/dms/image/v2/D5603AQH0VL5n3_wESg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1706141727108?e=1742428800&v=beta&t=jIHjJrpF9nVeiPHTEHbHcx_YTHFuXotx4WJYUKrHWbk"
    }
  },
  isFamilyFriendly: "true",
  openGraph: {
    siteName: "Kane Jackson",
    type: "website",
    locale: "en_AU"
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
