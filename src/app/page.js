'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createNoise3D } from 'simplex-noise';
import { Courier_Prime, Poppins, Homemade_Apple } from "next/font/google";
import { useInterval } from '../util/useInterval'
import alea from 'alea';

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
  const perlin = createNoise3D();
  const [currentSection, setCurrentSection] = useState("About me");
  const [openCareerDescription, setOpenCareerDescription] = useState(-1);
  
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <div className="w-full h-[100vh] bg-white p-2 flex flex-row">
        <div className={`w-1/2 h-full rounded-3xl overflow-hidden ${courier.className}`}>
          <Background perlin={perlin} currentSection={currentSection} setCurrentSection={setCurrentSection} />
        </div>
        <div className="w-1/2 h-full px-8 flex flex-col text-black justify-end">
          <div className="text-2xl mb-4" style={courier.style}>Minimalism</div>
          <div className="text-md mb-8" style={poppins.style}>/ˈmɪnɪməlɪz(ə)m/</div>
        </div>
      </div>

        
    </main>
  );
}



const Background = ({ perlin, currentSection, setCurrentSection }) => {
  const inner = useRef(null);
  const outer = useRef(null);
  const [frame, setFrame] = useState(0);
  //const perlin = createNoise2D();
  //let frame = 0;
  
  const fps = 30;
  const [backgroundCharacters, setBackgroundCharacters] = useState("_");
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });
  const [characterDimensions, setCharacterDimensions] = useState({height: 1, width: 1});

  useEffect(() => {
    console.log(inner.current ? inner.current.offsetWidth : 0);
    setCharacterDimensions({
      height: inner.current.offsetHeight,
      width: inner.current.offsetWidth
    });

    
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: outer.current.offsetWidth / characterDimensions.width * 1.1,
        height: outer.current.offsetHeight / characterDimensions.height
      });
    }
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    //console.log(outer.current.offsetHeight / inner.current.offsetHeight);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [characterDimensions])

  // Generate the 2d array of characters
  const generateBackground = () => {
    const chars = "..//{#(;%)!};..:''" //"@%#*+=-:.   ";
    const resolution = 80;
    //console.log("generating background, ", frame);
    let allCharacters = "";
    for (var i = 0; i < dimensions.height; i++) {
      let row = [];
      for (var j = 0; j < dimensions.width; j++) {
        // All noise functions return values in the range of -1 to 1.
        var value = perlin(i / resolution, j / resolution, frame * fps / 6000);
        row[j] = chars.charAt(Math.abs(value) * chars.length); 
      }
      allCharacters += row.join('') + '\n';
    }
    setBackgroundCharacters(allCharacters);
  };

  useInterval(() => {
    generateBackground();
    setFrame(frame + 1);
  }, 1000 / fps);
    
  return (
    <main ref={outer} className="flex min-h-screen flex-col justify-between overflow-hidden">
      <div className="h-full w-full z-10"></div>
      <div ref={inner} className="self-start h-auto w-auto bg-black text-slate-800 text-nowrap leading-4 select-none">
        {backgroundCharacters.split("\n").map((i,key) => {
          return <div key={key}>{i}</div>;
        })}
      </div>

      {/* Manually plice text into background ocean */}
      {/* <div
        onClick={() => {setCurrentSection("About me")}}
        className={`z-40 -mt-1 top-[22rem] ml-72 p-0 m-0 bg-zinc-950 text-slate-400 h-auto w-auto transition-all duration-150 cursor-pointer hover:text-slate-100`}>
        {currentSection === "About me" ? "-- " : ""} About me
      </div>
      <div 
        onClick={() => {setCurrentSection("Projects")}}
        className={`z-40 -mt-1 top-[25rem] ml-72 p-0 m-0 bg-zinc-950 text-slate-400 h-auto w-auto transition-all duration-150 cursor-pointer hover:text-slate-100`}>
        {currentSection === "Projects" ? "-- " : ""} Projects
      </div>
      <div 
        onClick={() => {setCurrentSection("Career")}}
        className={`z-40 -mt-1 top-[28rem] ml-72 p-0 m-0 bg-zinc-950 text-slate-400 h-auto w-auto transition-all duration-150 cursor-pointer hover:text-slate-100`}>
        {currentSection === "Career" ? "-- " : ""} Career
      </div> */}
    </main>
  );
}
