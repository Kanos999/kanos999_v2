'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createNoise3D } from 'simplex-noise';
import { Courier_Prime, Poppins } from "next/font/google";
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
          <div className="z-30 w-full md:top-12">

            {/* border-sky-500/10 bg-sky-900/20 */}
            <div className="rounded-md p-12 md:w-auto w-full
                             text-white shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg"> 
              {/* <div className="rounded-full bg-gray-700 aspect-square h-6 my-4 left-0 right-0 mx-auto"></div>
              <div className="w-full h-12 bg-gray-300"></div> */}
              <div className={poppinsBold.className}><div className="text-4xl ">Kane Jackson</div></div>
              <div className="text-md mt-4">Mechatronics / Computer Science</div>
            </div>

            <div className="flex flex-row p-8 w-full">
              <a href="#about" className="rounded-full ring-offset-2 ring-2 m-2 py-2 px-4 w-1/3">About</a>
              <a className="rounded-full ring-offset-2 ring-2 m-2 py-2 px-4 w-1/3">Projects</a>
              <a className="rounded-full ring-offset-2 ring-2 m-2 py-2 px-4 w-1/3">Career</a>
            </div>

            <div className="z-20 w-full h-full flex pointer-events-none">
              <div className="md:w-1/2 xl:pr-40 xl:pl-12">

                <div className={`${poppinsBold.className} z-30 sticky top-0 md:relative p-6 pl-12 text-2xl mt-36 
                                backdrop-blur-sm bg-slate-800/30 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg
                                md:backdrop-blur-none md:bg-slate-800/0 md:shadow-none md:drop-shadow-none md:pl-6`}
                  id="about">
                  tl;dr
                </div>
                <div className="m-12 md:m-6 rounded-lg text-slate-400 duration-200 leading-loose">
                  Passionate about leveraging software development and robotics to drive innovation in the space industry. 
                  My journey as a coder and problem-solver has been fueled by a fascination with the limitless possibilities 
                  of technology and a deep admiration for the extraordinary accomplishments of the aerospace sector &#128640;
                </div>

                <div className={`${poppinsBold.className} z-30 sticky top-0 md:relative p-6 pl-12 text-2xl mt-36 
                                backdrop-blur-sm bg-slate-800/30 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg
                                md:backdrop-blur-none md:bg-slate-800/0 md:shadow-none md:drop-shadow-none md:pl-6`}>
                  Projects
                </div>
                <div className="p-12 rounded-md">asjdhaksdj</div>


                <div className={`${poppinsBold.className} z-30 sticky top-0 md:relative p-6 pl-12 text-2xl mt-36 
                                backdrop-blur-sm bg-slate-800/30 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg
                                md:backdrop-blur-none md:bg-slate-800/0 md:shadow-none md:drop-shadow-none md:pl-6`}>
                  Career
                </div>

              </div>
            </div>

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
