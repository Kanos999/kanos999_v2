'use client'

import R3fGlobe from 'r3f-globe';
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import * as satellite from 'satellite.js';

const EARTH_RADIUS_KM = 6371; // km
const PREDICTION_DURATION_MS = 60 * 60 * 1000; // 1 hour
const STEP_MS = 10 * 1000; // 10 seconds
const ELEVATION_THRESHOLD_DEG = 60; // Min elevation for visibility

const World = ({ setCommWindows }) => {
  const [satData, setSatData] = useState([]);
  const [missionControlCoords, setMissionControlCoords] = useState({});
  const [time, setTime] = useState(new Date());

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(position => {
        // save the geolocation coordinates in two variables
        const { latitude, longitude } = position.coords;
        // update the value of userlocation variable
        setMissionControlCoords({ 
          lat: latitude, 
          lng: longitude,
          color: 'green'
        });
      },
      // if there was an error getting the users location
      (error) => {
        console.error('Error getting user location:', error);
      });
    }
    // if geolocation is not supported by the users browser
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    // time ticker
    (function frameTicker() {
      requestAnimationFrame(frameTicker);
      setTime(new Date());
    })();
  }, []);
  
  useEffect(() => {
    const fetchTLEs = async () => {
      const resIridium = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium&FORMAT=TLE');
      const resIridiumNext = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-NEXT&FORMAT=TLE');
      let data = await resIridium.text();
      data += await resIridiumNext.text();
      const lines = data.split('\n');
      let sats = [];

      for (let i = 0; i < lines.length; i += 3) {
        const name = lines[i].trim();
        const tle1 = lines[i + 1];
        const tle2 = lines[i + 2];
        
        try {
          const satrec = satellite.twoline2satrec(tle1, tle2);
          sats.push({ satrec });
        } catch (error) {
          console.log(error);
        }
      }
      setSatData(sats);
    };

    fetchTLEs();
    getUserLocation();

  }, []);

  useEffect(() => {
    if (!missionControlCoords.lat || !satData.length) return;

    const observerGd = {
      latitude: satellite.degreesToRadians(missionControlCoords.lat),
      longitude: satellite.degreesToRadians(missionControlCoords.lng),
      height: 0.1
    };

    const now = new Date();
    const future = new Date(now.getTime() + PREDICTION_DURATION_MS);
    const windows = [];

    for (const sat of satData) {
      let inWindow = false;
      let startTime = null;
      let endTime = null;

      for (let t = now.getTime(); t < future.getTime(); t += STEP_MS) {
        const date = new Date(t);
        const positionAndVelocity = satellite.propagate(sat.satrec, date);
        if (!positionAndVelocity.position) continue;

        const gmst = satellite.gstime(date);
        const eci = positionAndVelocity.position;
        const lookAngles = satellite.ecfToLookAngles(
          observerGd,
          satellite.eciToEcf(eci, gmst)
        );

        const elevationDeg = satellite.radiansToDegrees(lookAngles.elevation);

        if (elevationDeg > ELEVATION_THRESHOLD_DEG) {
          if (!inWindow) {
            inWindow = true;
            startTime = date;
          }
          endTime = date;
        } else if (inWindow) {
          windows.push({
            name: sat.satrec.satnum,
            start: startTime,
            end: endTime,
            duration: (endTime - startTime) / 1000 // seconds
          });
          inWindow = false;
          startTime = null;
          endTime = null;
        }
      }
    }

    setCommWindows(windows.sort((a, b) => a.start - b.start));
    console.log(missionControlCoords);
  }, [missionControlCoords, satData]);

  const particlesData = useMemo(() => {
    if (!satData) return [];

    // Update satellite positions
    const gmst = satellite.gstime(time);
    return [
      satData.map(d => {
        const eci = satellite.propagate(d.satrec, time);
        if (eci.position) {
          const gdPos = satellite.eciToGeodetic(eci.position, gmst);
          const lat = satellite.radiansToDegrees(gdPos.latitude);
          const lng = satellite.radiansToDegrees(gdPos.longitude);
          const alt = gdPos.height / EARTH_RADIUS_KM;
          return { ...d, lat, lng, alt };
        }
        return d;
      }).filter(d => !isNaN(d.lat) && !isNaN(d.lng) && !isNaN(d.alt))
    ];
  }, [satData, time]);

  const colorInterpolator = useCallback(t => `rgba(0,255,0,${1-t*t})`, []);

  return (
    <Canvas
      flat
      camera={useMemo(() => ({ position: [0, 0, 200] }), [])}
      raycaster={useMemo(() => ({ params: { Points: { threshold: 0.2 } } }), [])}
    >
      <OrbitControls minDistance={101} maxDistance={1e4} dampingFactor={0.1} zoomSpeed={0.3} rotateSpeed={0.3} />
      <ambientLight color={0xcccccc} intensity={Math.PI}/>
      <directionalLight intensity={0.6 * Math.PI}/>

      <R3fGlobe 
        globeImageUrl={"./earth-blue-marble.jpg"}
        // pointsData={myData}
        particlesData={particlesData}
        particleLabel="name"
        particleLat="lat"
        particleLng="lng"
        particleAltitude="alt"
        particlesColor={useCallback(() => '#ffcc33', [])}
        particlesSize={2}
        ringsData={[missionControlCoords]}
        ringColor={() => colorInterpolator}
        ringMaxRadius={4}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}
        pointsData={[missionControlCoords]}
        pointColor="color"
        pointRadius={0.8}
        pointAltitude={0}
      />
      <ambientLight intensity={Math.PI}/>
      <directionalLight intensity={0.6 * Math.PI}/>
    </Canvas>
  );
};

export { World }