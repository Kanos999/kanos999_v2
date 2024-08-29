'use client'

import { useEffect, useState } from 'react';
import { createNoise2D } from 'simplex-noise';
import { Geologica } from "next/font/google";

const geologica = Geologica({
  subsets: ['latin'],
  variable: '--font-geologica',
})

export default function Background() {
  const perlin = createNoise2D();
  let frame = 0;
  const chars = "..//{#(;%)!};..:''" //"@%#*+=-:.   ";
  const fps = 10;
  const [backgroundCharacters, setBackgroundCharacters] = useState("");

  // Generate the 2d array of characters
  useEffect(() => {
    const interval = setInterval(() => {
      let allCharacters = "";
      for (var i = 0; i < 30; i++) {
        let row = [];
        for (var j = 0; j < 30; j++) {
          // All noise functions return values in the range of -1 to 1.
          var value = perlin(i, j, frame);
          row[j] = chars.charAt(Math.abs(value) * chars.length); 
        }
        
        allCharacters += row.join('') + '\n';
      }
      console.log(allCharacters);//.append('\n');
      setBackgroundCharacters(allCharacters);
      frame++;
    }, 2000)

    return () => {
      clearInterval(interval);
    }
  }, []);
    
    
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <div className="w-full h-full whitespace-pre-line">
        {backgroundCharacters.split("\n").map((i,key) => {
          return <div key={key}>{i}</div>;
        })}
      </div>
    </main>
  );
}