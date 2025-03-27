"use client";
import { motion } from "framer-motion";
import React, { useState, useRef, ChangeEvent } from "react";

const ContentAnalysisDashboard: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<'upload' | 'text' | 'analysis'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
      setSelectedPage('analysis'); // Automatically move to analysis page after file selection
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      setSelectedFiles(files);
      setSelectedPage('analysis'); // Automatically move to analysis page after file drop
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderUploadPage = () => (
    <div 
      className="flex flex-col items-center justify-center space-y-6 p-8"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        multiple 
        className="hidden" 
        accept=".txt,.pdf,.docx,.doc" 
      />
      <div 
        className="border-2 border-white/30 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-white/50 transition-all"
        onClick={triggerFileInput}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-white/70 mb-4">Drag and drop files here or click to select</p>
        <button 
          className="bg-white/10 hover:bg-white/20 text-white/80 px-6 py-2 rounded-lg transition-all"
          onClick={triggerFileInput}
        >
          Select Files
        </button>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-4 text-white/70">
          <p>Selected Files:</p>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Rest of the component remains the same as in the original code
  const renderTextInputPage = () => (
    <div className="p-8">
      <textarea 
        className="w-full h-64 bg-white/10 text-white/80 p-4 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
        placeholder="Paste your text here..."
      />
      <div className="flex justify-end mt-4">
        <button 
          className="bg-white/10 hover:bg-white/20 text-white/80 px-6 py-2 rounded-lg transition-all"
          onClick={() => setSelectedPage('analysis')}
        >
          Analyze
        </button>
      </div>
    </div>
  );

  // Render method and other parts remain the same as in the original code
  const renderAnalysisPage = () => (
    <div className="grid grid-cols-2 gap-8">
      {/* Left Side - Analysis */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-white/80">Content Analysis</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Sensitivity Radial Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white/70">Sensitivity</h3>
            <motion.div 
              className="radial-progress" 
              style={{
                '--value': 45,
                '--size': '10rem',
                '--thickness': '1.5rem'
              } as React.CSSProperties}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                45%
              </motion.span>
            </motion.div>
          </div>

          {/* Severity Radial Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white/70">Severity</h3>
            <motion.div 
              className="radial-progress" 
              style={{
                '--value': 75,
                '--size': '10rem',
                '--thickness': '1.5rem'
              } as React.CSSProperties}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                75%
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Severity Level Breakdown */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-white/70">Severity Levels</h3>
          <div className="space-y-2">
            {['Critical', 'High', 'Medium', 'Low'].map((level, index) => (
              <div key={level} className="flex items-center">
                <span 
                  className="w-4 h-4 rounded-full mr-2 opacity-50"
                  style={{ 
                    backgroundColor: `rgba(255,255,255,${1 - index * 0.25})` 
                  }}
                ></span>
                <span className="text-white/70">{level}: Risk Level</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Suggestions and Guidelines */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-white/80">Recommendations</h2>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white/70">Violated Guidelines</h3>
          <ul className="list-disc list-inside space-y-2 text-white/60">
            <li>Potential Inappropriate Content</li>
            <li>Risk of Harmful Language</li>
            <li>Sensitive Topic Detection</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-white/70">Suggested Actions</h3>
          <ul className="list-disc list-inside space-y-2 text-white/60">
            <li>Review and Modify Content</li>
            <li>Apply Content Filters</li>
            <li>Implement Contextual Warnings</li>
            <li>Consult Content Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );

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

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-center space-x-4 z-20">
        <button 
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedPage === 'upload' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          onClick={() => setSelectedPage('upload')}
        >
          Upload
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedPage === 'text' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          onClick={() => setSelectedPage('text')}
        >
          Add Text
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedPage === 'analysis' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          onClick={() => setSelectedPage('analysis')}
        >
          Analysis
        </button>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto p-8 text-white mt-16">
        {selectedPage === 'upload' && renderUploadPage()}
        {selectedPage === 'text' && renderTextInputPage()}
        {selectedPage === 'analysis' && renderAnalysisPage()}
      </div>

      {/* Custom CSS for Radial Progress */}
      <style jsx global>{`
        .radial-progress {
          --size: 12rem;
          --thickness: 2rem;
          --value: 0;
          width: var(--size);
          height: var(--size);
          position: relative;
          display: inline-grid;
          place-content: center;
          font-weight: bold;
          color: white;
        }

        .radial-progress::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(
            rgba(255,255,255,0.5) calc(var(--value, 0) * 1%), 
            rgba(255,255,255,0.1) calc(var(--value, 0) * 1%)
          );
          mask: radial-gradient(
            farthest-side, 
            transparent calc(100% - var(--thickness)), 
            black calc(100% - var(--thickness))
          );
          -webkit-mask: radial-gradient(
            farthest-side, 
            transparent calc(100% - var(--thickness)), 
            black calc(100% - var(--thickness))
          );
        }
      `}</style>
    </div>
  );
};

export default ContentAnalysisDashboard;