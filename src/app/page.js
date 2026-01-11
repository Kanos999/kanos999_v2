'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';
import { Courier_Prime, Poppins, Homemade_Apple } from "next/font/google";
import { useInterval } from '../util/useInterval'

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
  const perlin = useMemo(() => createNoise3D(), []);
  const [currentSection, setCurrentSection] = useState("About me");
  const [openCareerDescription, setOpenCareerDescription] = useState(-1);
  
  return (
    <main className="relative min-h-screen flex flex-col">
      <div className="relative w-full">
        <div className={courier.className}>
          <Background perlin={perlin} currentSection={currentSection} setCurrentSection={setCurrentSection} />
        </div>

        <div className="relative top-0 left-0 right-0 h-[100vh] p-12 md:rounded-3xl text-white/80 z-30">
          <div className="heroShadow w-full h-full absolute top-0 left-0 right-0"></div>

          <div className={`${poppins.className} relative flex flex-col justify-center max-w-4xl h-full left-0 right-0 mx-auto`}>
            <div className={`${cedarville.className} text-md  italic !z-30`}>Hi! My name is</div>
            <div className={poppinsBold.className}><div className="text-4xl">Kane Jackson</div></div>
            <div className="text-md mt-4">Mechatronics / Computer Science</div>
          </div>
        </div>

        <div className={`${poppins.className} relative flex flex-col justify-center max-w-4xl left-0 right-0 mx-auto`}>


          <div className="bg-white w-full p-12 rounded-tr-3xl rounded-bl-3xl md:rounded-3xl text-zinc-950/80 relative z-30">
            {/* Links */}
            <div className="flex flex-row mb-10">
              <a href="https://www.linkedin.com/in/kanehjackson/">
                <img src="linkedin.png" className="opacity-50 mr-6 h-8" alt="Kane Jackson on LinkedIn" />
              </a>
              <a href="https://github.com/Kanos999">
                <img src="github.png" className="opacity-50 mr-4 h-10 -mt-1" alt="Kane Jackson on GitHub" />
              </a>
              <a href="https://www.instagram.com/kane.json/">
                <img src="instagram.png" className="opacity-30 mr-6 h-12 -mt-2" alt="Kane Jackson on Instagram" />
              </a>
            </div>

            <div className={`${poppinsBold.className} text-2xl mb-8 font-bold`}>About me</div>
            <div className="text-justify">
              Passionate about leveraging software development and robotics to drive innovation in the space industry. 
              My journey as a coder and problem-solver has been fueled by a fascination with the limitless possibilities 
              of technology and a deep admiration for the extraordinary accomplishments of the aerospace sector &#128640;
            </div>
            
            <div className="w-full h-1 border-t border-t-zinc-950/20 my-8 md:my-12"></div>

            <div className={`${poppinsBold.className} text-2xl mb-6 md:mb-8 font-bold`}>Career</div>

            <div className="divide-y divide-gray-200 md:divide-y-0">
              {career.map((job, i) => {
                return (
                  <div key={i} className={`${openCareerDescription == i ? "!border-l-zinc-900" : ""} transition-all duration-500 grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l`}>
                    {/* Job title, position, company, dates etc */}
                    <div className="mt-4 md:mt-0" onClick={() => { setOpenCareerDescription(openCareerDescription == i ? -1 : i) }}>
                      <div className={`absolute -ml-[29px] bg-white h-auto w-auto overflow-visible -mb-full
                                      ${openCareerDescription == i ? "text-zinc-900" : "text-gray-300"} transition-all duration-500`}>o</div>
                      <div className="font-bold">{job.position}</div>
                      <div className="italic">{job.company}</div>
                    </div>

                    {/* Description */}
                    <div className={`${openCareerDescription == i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} transition-all duration-500 ease-in-out overflow-y-hidden pl-4 md:max-h-96 md:opacity-100 md:mb-12`}>
                      <ul className="text-zinc-500 list-disc">
                        {job.description.map((descriptionItem, j) => {
                          return <li className="list-disc mb-4" key={j}>{descriptionItem}</li>;
                        })}
                      </ul>
                      {/* <div className="w-full h-1 border-t border-t-zinc-950/20 my-2"></div> */}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="text-white p-12 text-center">{"Made with <3 by @Kanos999"}</div>

        </div>
        
      </div>
    </main>
  );
}



const Background = ({ perlin }) => {
  const outerRef = useRef(null);
  const measureRef = useRef(null);
  const [frame, setFrame] = useState(0);

  const fps = 30;
  const chars = "..//{#(;%)!};..:''";
  const resolution = 80;
  const overscanRows = 10;

  const [metrics, setMetrics] = useState({
    charWidth: 1,
    charHeight: 1,
    cols: 0,
    totalRows: 0,
  });
  const [scrollState, setScrollState] = useState({
    scrollTop: 0,
    viewportHeight: 0,
  });
  const [rendered, setRendered] = useState({ startRow: 0, lines: [] });

  useEffect(() => {
    if (!outerRef.current || !measureRef.current) return;

    const recompute = () => {
      if (!outerRef.current || !measureRef.current) return;
      const charRect = measureRef.current.getBoundingClientRect();
      const outerRect = outerRef.current.getBoundingClientRect();

      const charWidth = Math.max(1, charRect.width);
      const charHeight = Math.max(1, charRect.height);
      const cols = Math.max(0, Math.ceil(outerRect.width / charWidth) + 2);
      const totalRows = Math.max(0, Math.ceil(outerRef.current.offsetHeight / charHeight) + 1);

      setMetrics({ charWidth, charHeight, cols, totalRows });
    };

    recompute();

    const ro = new ResizeObserver(() => {
      recompute();
    });
    ro.observe(outerRef.current);

    window.addEventListener('resize', recompute);
    return () => {
      window.removeEventListener('resize', recompute);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = window.requestAnimationFrame(() => {
        setScrollState({
          scrollTop: window.scrollY || 0,
          viewportHeight: window.innerHeight || 0,
        });
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const generateVisibleLines = (nextFrame) => {
    if (metrics.cols <= 0 || metrics.totalRows <= 0 || metrics.charHeight <= 0) {
      return { startRow: 0, lines: [] };
    }

    const startRow = Math.max(
      0,
      Math.floor(scrollState.scrollTop / metrics.charHeight) - overscanRows
    );
    const endRow = Math.min(
      metrics.totalRows - 1,
      Math.floor((scrollState.scrollTop + scrollState.viewportHeight) / metrics.charHeight) +
        overscanRows
    );

    const lines = [];
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      let line = "";
      for (let colIndex = 0; colIndex < metrics.cols; colIndex++) {
        const value = perlin(
          rowIndex / resolution,
          colIndex / resolution,
          (nextFrame * fps) / 6000
        );
        line += chars.charAt(Math.floor(Math.abs(value) * chars.length));
      }
      lines.push(line);
    }

    return { startRow, lines };
  };

  useInterval(() => {
    const nextFrame = frame + 1;
    setRendered(generateVisibleLines(nextFrame));
    setFrame(nextFrame);
  }, 1000 / fps);

  return (
    <div
      ref={outerRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none bg-zinc-950 text-slate-900"
    >
      <span
        ref={measureRef}
        className="absolute invisible whitespace-pre leading-4 text-nowrap"
      >
        M
      </span>

      <div
        className="absolute left-0 top-0 leading-4 text-nowrap select-none"
        style={{
          transform: `translateY(${rendered.startRow * metrics.charHeight}px)`,
        }}
      >
        {rendered.lines.map((line, idx) => (
          <div key={rendered.startRow + idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
