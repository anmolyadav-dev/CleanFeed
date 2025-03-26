"use client"
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileImage, X } from "lucide-react";

interface AnalysisResult {
  score: number;
  severity: string;
  recommendation: string;
}

const Analyze: React.FC = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const performAnalysis = () => {
    const sensitivityScore = calculateSensitivity(text);
    setAnalysis({
      score: sensitivityScore,
      severity: getSeverityLevel(sensitivityScore),
      recommendation: getRecommendation(sensitivityScore)
    });
  };

  const calculateSensitivity = (inputText: string): number => {
    // Api call
    
    return 100;
  };

  const getSeverityLevel = (score: number): string => {
    if (score < 20) return 'Low';
    if (score < 50) return 'Moderate';
    if (score < 80) return 'High';
    return 'Critical';
  };

  const getRecommendation = (score: number): string => {
    if (score < 20) return 'Content appears safe to share.';
    if (score < 50) return 'Consider reviewing before sharing.';
    if (score < 80) return 'Significant sensitivity detected. Careful review recommended.';
    return 'Content is highly sensitive. Do not share.';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
          <CardTitle className="text-zinc-100 text-center">Content Sensitivity Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-zinc-900">
          <div className="space-y-4 p-2">
            <Input
              type="text"
              placeholder="Enter text to analyze"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-100 border-zinc-700 placeholder-zinc-500 focus:ring-2 focus:ring-zinc-600"
            />

            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-6 text-center 
                transition-all duration-300 ease-in-out
                ${dragActive 
                  ? 'border-zinc-600 bg-zinc-800/80' 
                  : 'border-zinc-800 bg-zinc-900/50'}
                text-zinc-400 hover:border-zinc-600
              `}
            >
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-zinc-600 mb-2" />
                  <p className="text-zinc-500">
                    Drag and drop an image here, or click to select
                  </p>
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between bg-zinc-800 p-2 rounded-md">
                <div className="flex items-center">
                  <FileImage className="w-6 h-6 mr-2 text-zinc-500" />
                  <span className="text-zinc-200 truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Button 
              onClick={performAnalysis}
              className="w-full bg-zinc-700 text-zinc-100 hover:bg-zinc-600 transition-colors duration-300"
              disabled={!text && !selectedFile}
            >
              Analyze Content
            </Button>

            {analysis && (
              <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <h3 className="text-xl font-semibold mb-4 text-zinc-100">Analysis Results</h3>
                <div className="space-y-2">
                  <p className="text-zinc-300">
                    <strong className="text-zinc-100 mr-2">Sensitivity Score:</strong> 
                    <span>{analysis.score.toFixed(2)}/100</span>
                  </p>
                  <p className="text-zinc-300">
                    <strong className="text-zinc-100 mr-2">Severity Level:</strong> 
                    <span>{analysis.severity}</span>
                  </p>
                  <p className="text-zinc-300">
                    <strong className="text-zinc-100 mr-2">Recommendation:</strong> 
                    <span>{analysis.recommendation}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analyze;