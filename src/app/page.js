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
    description: "Satellite testing and validation"
  },
  {
    position: "Lead Software Engineer",
    company: "InnerSteps",
    description: "• Coordinated with a team of skilled engineers to deliver a high-quality, child-friendly mobile app for InnerSteps. \
                  • Produced an MVP in a few months, leading to a user base growth of over 700. \
                  • Implemented agile methodologies to ensure efficient project delivery and meet tight deadlines."
  },
  {
    position: "Software Engineer",
    company: "Gaming Entertainment Systems",
    description: "CAD/CAM, Javascript, Node.js..."
  }
];

export default function Home() {
  const perlin = createNoise3D();
  const [currentSection, setCurrentSection] = useState("About me");
  
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <div className="w-full h-full overflow-hidden">
        <div className={courier.className}>
          <Background perlin={perlin} currentSection={currentSection} setCurrentSection={setCurrentSection} />
        </div>

        <div className={`${poppins.className} absolute top-0 flex flex-col`}>
          <div className=" w-full md:top-12">

            {/* border-sky-500/10 bg-sky-900/20 */}
            <div className="rounded-md px-12 mt-48 mb-6 md:w-auto w-full text-white"> 
              {/* <div className="rounded-full bg-gray-700 aspect-square h-6 my-4 left-0 right-0 mx-auto"></div>
              <div className="w-full h-12 bg-gray-300"></div> */}
              <div className={`${cedarville.className} text-md  italic text-white/80`}>Hi! My name is</div>
              <div className={poppinsBold.className}><div className="text-4xl">Kane Jackson</div></div>
              <div className="text-md mt-4">Mechatronics / Computer Science</div>
            </div>

            <div className="bg-white w-full p-12 rounded-tr-3xl rounded-bl-3xl text-zinc-950/80 relative z-30">
              {/* Links */}
              <div className="flex flex-row mb-6">
                <a href="https://www.linkedin.com/in/kanehjackson/"><img src="linkedin.png" className="opacity-50 mr-6 h-10" /></a>
                <a href="https://github.com/Kanos999"><img src="github.png" className="opacity-50 mr-4 h-12 -mt-1" /></a>
                <a href="https://www.instagram.com/kane.json/"><img src="instagram.png" className="opacity-30 mr-6 h-14 -mt-2" /></a>
              </div>

              <div className={`${poppinsBold.className} text-2xl mb-8`}>tl;dr</div>
              <div className="text-justify">
                Passionate about leveraging software development and robotics to drive innovation in the space industry. 
                My journey as a coder and problem-solver has been fueled by a fascination with the limitless possibilities 
                of technology and a deep admiration for the extraordinary accomplishments of the aerospace sector &#128640;
              </div>
              
              <div className="w-full h-1 border-t border-t-zinc-950/20 my-8"></div>

              <div className={`${poppinsBold.className} text-2xl mb-8`}>Career</div>
              {career.map((job, i) => {
                return (<div key={i} className="mb-4">
                  <div className="font-bold">{job.position}</div>
                  <div className="italic">{job.company}</div>
                  
                </div>);
              })}
            </div>

            <div className="text-white p-12">{"Made with <3 by @Kanos999"}</div>

          </div>
          
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
    <main ref={outer} className="flex min-h-screen flex-col justify-between overflow-x-hidden">
      <div className="fixed h-full w-full z-10"></div>
      <div ref={inner} className=" fixed self-start h-auto w-auto bg-zinc-950 text-slate-900 text-nowrap leading-4 select-none">
        {backgroundCharacters.split("\n").map((i,key) => {
          return <div key={key}>{i}</div>;
        })}
      </div>

      {/* Manually plice text into background ocean */}
      {/* <div
        onClick={() => {setCurrentSection("About me")}}
        className={`z-40 -mt-1 top-[22rem] ml-72 p-0 m-0 fixed bg-zinc-950 text-slate-400 h-auto w-auto transition-all duration-150 cursor-pointer hover:text-slate-100`}>
        {currentSection === "About me" ? "-- " : ""} About me
      </div>
      <div 
        onClick={() => {setCurrentSection("Projects")}}
        className={`z-40 -mt-1 top-[25rem] ml-72 p-0 m-0 fixed bg-zinc-950 text-slate-400 h-auto w-auto transition-all duration-150 cursor-pointer hover:text-slate-100`}>
        {currentSection === "Projects" ? "-- " : ""} Projects
      </div>
      <div 
        onClick={() => {setCurrentSection("Career")}}
        className={`z-40 -mt-1 top-[28rem] ml-72 p-0 m-0 fixed bg-zinc-950 text-slate-400 h-auto w-auto transition-all duration-150 cursor-pointer hover:text-slate-100`}>
        {currentSection === "Career" ? "-- " : ""} Career
      </div> */}
    </main>
  );
}
