"use client"
import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/navbar';

const Home: React.FC = () => {
  const handleTryMe = () => {
    window.location.href = '/analyze';
  };

  return (
    <div className="min-h-screen bg-zinc-800 flex flex-col justify-center items-center">
      <div className='w-full -mt-30'>
        <Navbar/>
      </div>
      <main className="max-w-2xl w-full text-center">
        <div className="flex justify-center -mt-10">
          <Image 
            src="/logo.png" 
            alt="ContentGuard Logo" 
            width={600} 
            height={600}
          />
        </div>
        
        <p className="text-xl text-gray-400 -mt-30 mb-8">
          Unveil the hidden layers of your text. Understand sensitivity before you share.
        </p>
        
        <button 
          onClick={handleTryMe}
          className="bg-indigo-800 hover:bg-indigo-900 text-xl text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 inline-block"
        >
          Try Me
        </button>
      </main>
    </div>
  );
};

export default Home;