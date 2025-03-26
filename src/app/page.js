'use client'

import { Courier_Prime, Poppins, Homemade_Apple, Roboto_Condensed } from "next/font/google";
import React, { useState } from "react";
import Image from 'next/image';
import gpsIcon from "../../public/icons/gps.svg";
import donutIcon from "../../public/icons/donut.svg";

import { World } from "./World";
import { motion } from 'framer-motion';
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const variants = {
  hidden: { opacity: 0, x: 100, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
};

//👇 Configure our font object
const roboto = Roboto_Condensed({
  subsets: ['latin'],
  weight: '800',
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


export default function Main({children}) {
  const currentTab = usePathname()
  const [commWindows, setCommWindows] = useState([]);

  // console.log(currentTab)
  return (
    <main className="h-screen w-screen fixed flex flex-col background-gradient p-1">
      <div className="w-full grow z-20 border border-gray-500/50 rounded-b-3xl rounded-t-xl background-gradient-dark flex flex-row">

        <div className="w-1/3 border-r border-gray-500/50 p-6">
          <div className={`${roboto.className} p-6 text-center text-2xl font-bold`}>Upcoming windows</div>

          
          {commWindows.map((commWindow => {
            return (
              <div className="">{commWindow.name}</div>
            );
          }))}
        </div>

        {/* Main body */}
        <div className="w-2/3 grow h-full relative overflow-hidden">
          {/* Flight view */}
          <div className="h-full rounded-br-xl p-6 ">
            <World setCommWindows={setCommWindows} />
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="w-full h-auto p-6 text-center text-4xl font-bold">
        <div className={roboto.className}>Time to next: 00:00</div>
      </div>
    </main>
  );
}