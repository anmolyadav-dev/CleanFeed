"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import GradientBackground from '@/components/GradientBackground';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const words = ['Secure.', 'Protect.', 'Analyze.'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorBlink);
  }, []);

  const handleTryMe = () => {
    window.location.href = '/analyze';
  };

  return (
    <div className="relative min-h-screen flex flex-col text-center">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <GradientBackground />
      </div>
      
      {/* Navbar */}
      <div className="relative z-10 w-full">
        <Navbar />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
        <main className="w-full max-w-4xl text-center px-4">
          <div className='text-7xl font-bold text-white mt-10 h-12 flex justify-center items-center'>
            <motion.span
              key={words[currentWordIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mr-2"
            >
              {words[currentWordIndex]}
            </motion.span>
            {/* {showCursor && <span className="text-white">|</span>} */}
          </div>
          
          <p className="text-xl text-gray-400 mt-10 mb-8 max-w-2xl mx-auto">
            Unveil the hidden layers of your text. Understand sensitivity before you share.
          </p>
          
          <button 
            onClick={handleTryMe}
            className="relative inline-flex h-16 w-48 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:scale-105 transition-transform duration-300"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-2 text-xl font-semibold text-white backdrop-blur-3xl">
              Try now 
            </span>
          </button>

        </main>
      </div>
    </div>
  );
};

export default Home;