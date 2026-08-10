'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';
import { Courier_Prime } from "next/font/google";
import Link from 'next/link';
import { useInterval } from '../util/useInterval'

// The ASCII ocean needs a fixed-width face so the character grid stays square.
const courier = Courier_Prime({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

export default function NotFound() {
  const perlin = useMemo(() => createNoise3D(), []);

  return (
    <main className="flex min-h-screen flex-col justify-between">
      <div className="w-full h-full overflow-hidden">
        <div className={courier.className}>
          <Background perlin={perlin} />
        </div>
      </div>

      <div className="z-40 absolute h-full w-full flex flex-col items-center justify-center px-6 text-center">
        <div className="label text-white/40">Error 404 / Sheet not found</div>
        <div className="mt-6 font-serif text-4xl italic text-white md:text-5xl">
          Umm... this is awkward.
        </div>
        <div className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400">
          Nothing is filed at this address. The ocean behind this text is generated
          character by character. It used to be the whole site.
        </div>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-[13px] font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
        >
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          Return to index
        </Link>
      </div>
    </main>
  );
}



const Background = ({ perlin }) => {
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
    </main>
  );
}
