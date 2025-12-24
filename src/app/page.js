'use client'

import { Courier_Prime, Poppins, Homemade_Apple } from "next/font/google";
import Background from '../ascii-ocean/Background';

//👇 Configure our font object
const courier = Courier_Prime({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})
const poppinsBold = Poppins({
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
})
const cedarville = Homemade_Apple({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const career = [
  {
    position: "Mechanical Engineering Intern",
    company: "ANT61",
    description: [
      "Designed mechanical fixtures for validating our product in a vibration test, qualifying it for space flight.",
      "Facilitated thermal cycling tests (vacuum and in-air) in accordance with SpaceX qualification standards.",
      "Analytically verified designs of product enclosures and its overall mechanical integrity."
    ]
  },
  {
    position: "Lead Software Engineer",
    company: "InnerSteps",
    description: [
      "Coordinated with a team of skilled engineers to deliver a high-quality, child-friendly mobile app.",
      "Produced an MVP in a few months, leading to a user base growth of over 700.",
      "Implemented agile methodologies to ensure efficient project delivery and meet tight deadlines."
    ]
  },
  {
    position: "Software Engineer",
    company: "Gaming Entertainment Systems",
    description: [
      "Implemented engaging visual displays using HTML, CSS and JavaScript.",
      "Designed printable CAD models to enhance product presentations for potential clients."
    ]
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <div className="w-full h-[100vh] bg-white p-2 flex flex-row">
        <div className={`w-1/2 h-full rounded-3xl overflow-hidden ${courier.className}`}>
          <Background />
        </div>
        <div className="w-1/2 h-full px-8 flex flex-col text-black justify-end">
          <div className="text-2xl mb-4" style={courier.style}>Minimalism</div>
          <div className="text-md mb-8" style={poppins.style}>/ˈmɪnɪməlɪz(ə)m/</div>
        </div>
      </div>

        
    </main>
  );
}
