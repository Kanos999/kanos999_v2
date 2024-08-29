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
          <div className="z-30 w-full p-12 md:fixed md:top-12 md:h-full md:w-1/2 xl:pl-60 md:pr-24">
            {/* border-sky-500/10 bg-sky-900/20 */}
            <div className="rounded-md p-12 md:w-auto w-full
                            backdrop-blur-sm bg-slate-800/30 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg"> 
              {/* <div className="rounded-full bg-gray-700 aspect-square h-6 my-4 left-0 right-0 mx-auto"></div>
              <div className="w-full h-12 bg-gray-300"></div> */}
              <div className={poppinsBold.className}><div className="text-4xl ">Kane Jackson</div></div>
              <div className="text-md mt-4">Mechatronics / Computer Science</div>
            </div>
          </div>

          <div className="md:top-0 md:left-1/2 z-20 w-full h-full flex justify-end pointer-events-none">
            <div className="md:w-1/2 xl:pr-40 xl:pl-12">

              <div className={`${poppinsBold.className} z-30 sticky top-0 md:relative p-6 pl-12 text-2xl mt-36 
                              backdrop-blur-sm bg-slate-800/30 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg
                              md:backdrop-blur-none md:bg-slate-800/0 md:shadow-none md:drop-shadow-none md:pl-6`}>
                tl;dr
              </div>
              <div className="m-12 md:m-6 rounded-lg text-slate-400 duration-200 leading-loose">
                I am a student at the University of New South Wales, pursuing a dual degree in Mechatronics and Computer Science. 
                I am deeply fascinated by the world of coding and robotics, and I love to explore the possibilities of technology 
                through innovation and creativity.
                <br />
                Apart from my academic pursuits, I enjoy playing the piano, reading, playing chess, and snowboarding. 
                Additionally, I am captivated by space and the extraordinary accomplishments exhibited in the aerospace 
                industry, and I wish to contribute to the space industry in the future.
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
      <div
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
      </div>
    </main>
  );
}
