'use client'

import { useEffect, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';
import { useInterval } from './useInterval';

const DEFAULT_OUTER_STYLE = Object.freeze({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'hidden',
  backgroundColor: '#050505',
  color: '#94a3b8',
  fontFamily: '"Courier Prime", "Courier New", Consolas, "Liberation Mono", Menlo, monospace',
  position: 'relative',
});

const DEFAULT_TEXT_STYLE = Object.freeze({
  alignSelf: 'flex-start',
  backgroundColor: 'transparent',
  whiteSpace: 'pre',
  lineHeight: 1.1,
  userSelect: 'none',
  letterSpacing: '0.05em',
  fontVariantLigatures: 'none',
  position: 'relative',
  zIndex: 2,
});

const DEFAULT_OVERLAY_STYLE = Object.freeze({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  opacity: 0.2,
  backgroundImage:
    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
  backgroundSize: '4px 4px',
});

export default function Background({
  fps = 30,
  resolution = 80,
  chars = "..//{#(;%)!};..:''",
  className = '',
  style = {},
  textStyle = {},
  overlayStyle = {},
  showOverlay = true,
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
    <main
      ref={outer}
      className={className}
      style={{ ...DEFAULT_OUTER_STYLE, ...style }}
    >
      {showOverlay && (
        <div
          aria-hidden="true"
          style={{ ...DEFAULT_OVERLAY_STYLE, ...overlayStyle }}
        ></div>
      )}
      <div
        ref={inner}
        style={{ ...DEFAULT_TEXT_STYLE, ...textStyle }}
      >
        {backgroundCharacters.split('\n').map((line, key) => (
          <div key={`ascii-line-${key}`}>{line}</div>
        ))}
      </div>
    </main>
  );
}