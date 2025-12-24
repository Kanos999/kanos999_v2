'use client'

import { useEffect, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';
import { useInterval } from './useInterval';

export default function Background({
  fps = 30,
  resolution = 80,
  chars = "..//{#(;%)!};..:''",
  className = 'bg-black text-slate-800',
}) {
  const inner = useRef(null);
  const outer = useRef(null);
  const noiseRef = useRef(null);
  const [frame, setFrame] = useState(0);
  const [backgroundCharacters, setBackgroundCharacters] = useState('_');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [characterDimensions, setCharacterDimensions] = useState({ height: 1, width: 1 });

  if (!noiseRef.current) {
    noiseRef.current = createNoise3D();
  }

  useEffect(() => {
    if (!inner.current) {
      return;
    }

    setCharacterDimensions({
      height: inner.current.offsetHeight || 1,
      width: inner.current.offsetWidth || 1,
    });
  }, []);

  useEffect(() => {
    if (!outer.current || !characterDimensions.width || !characterDimensions.height) {
      return;
    }

    const updateDimensions = () => {
      if (!outer.current) {
        return;
      }
      setDimensions({
        width: (outer.current.offsetWidth / characterDimensions.width) * 1.1,
        height: outer.current.offsetHeight / characterDimensions.height,
      });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, [characterDimensions]);

  const generateBackground = () => {
    if (!dimensions.width || !dimensions.height) {
      return;
    }

    const perlin = noiseRef.current;
    let allCharacters = '';
    for (let i = 0; i < dimensions.height; i++) {
      const row = [];
      for (let j = 0; j < dimensions.width; j++) {
        const value = perlin(i / resolution, j / resolution, (frame * fps) / 6000);
        row[j] = chars.charAt(Math.abs(value) * chars.length);
      }
      allCharacters += row.join('') + '\n';
    }
    setBackgroundCharacters(allCharacters);
  };

  useInterval(() => {
    generateBackground();
    setFrame((prev) => prev + 1);
  }, fps > 0 ? 1000 / fps : null);

  return (
    <main ref={outer} className={`flex min-h-screen flex-col justify-between overflow-hidden ${className}`}>
      <div className="h-full w-full z-10 grain opacity-40 absolute"></div>
      <div ref={inner} className="self-start h-auto w-auto text-nowrap leading-4 select-none">
        {backgroundCharacters.split('\n').map((line, key) => (
          <div key={`ascii-line-${key}`}>{line}</div>
        ))}
      </div>
    </main>
  );
}