"use client";
import { motion } from "framer-motion";
import React from "react";

const GradientBackground: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Gradient Base with Random Motion */}
      <motion.div
        className="absolute w-full h-full bg-gradient-to-br from-[#160A30] via-[#24133F] to-[#420035]"
        style={{
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: [
            '0% 0%', 
            '100% 50%', 
            '50% 100%', 
            '0% 0%'
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Static Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{
          backgroundImage: `
            repeating-radial-gradient(#ffffff 0 0.0001%, #00000010 0 0.0002%), 
            repeating-radial-gradient(#ffffff 0 0.0001%, #00000010 0 0.0002%)
          `,
          backgroundSize: '100px 100px',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Static Blue Glow (Top Left) */}
      <div
        className="absolute w-[40%] h-[40%] bg-blue-500/20 blur-[200px] rounded-full"
        style={{
          top: '0%',
          left: '0%',
        }}
      />

      {/* Static Red Glow (Bottom Right) */}
      <div
        className="absolute w-[40%] h-[40%] bg-red-500/20 blur-[200px] rounded-full"
        style={{
          bottom: '0%',
          right: '0%',
        }}
      />
    </div>
  );
};

export default GradientBackground;