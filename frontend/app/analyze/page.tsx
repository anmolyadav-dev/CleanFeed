"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Loader from "../../components/Loader";
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";

const ContentAnalysisDashboard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<
        "upload" | "text" | "analysis"
    >("upload");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [analysisResult, setAnalysisResult] = useState<any>({});

    const [loadingState, setLoadingState] = useState(false);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setSelectedFiles(files);
            // setSelectedPage("analysis"); // Automatically move to analysis page after file selection
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
            // setSelectedPage("analysis"); // Automatically move to analysis page after file drop
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleImageSendToBackend = async () => {
        setLoadingState(true);
        if (selectedFiles.length === 0) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFiles[0]); // Assuming the first file is the image

        try {
            const response = await fetch(
                "http://localhost:8000/image",
                {
                    method: "POST",
                    body: formData, // Send formData directly, not as a string
                }
            );
            const result = await response.json();
            console.log("Backend Response:", result);
            setSelectedPage("analysis");
            setAnalysisResult(result);
            setLoadingState(false);
        } catch (error) {
            console.error("Network Error:", error);
            setLoadingState(false);
        }
    };

    // // Automatically send image once a file is selected and analysis page is shown
    // useEffect(() => {
    //   if (selectedFiles.length > 0 && selectedPage === 'analysis') {
    //     handleImageSendToBackend();
    //   }
    // }, [selectedFiles, selectedPage]);

    const renderUploadPage = () => (
        <div
            className={`flex flex-col items-center justify-center space-y-6 p-8 mt-${
                selectedFiles.length > 0 ? "10" : "0"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
                accept="image/*"
            />
            <div
                className="border-2 border-white/30 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-white/50 transition-all"
                onClick={triggerFileInput}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 mx-auto mb-4 text-white/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <p className="text-white/70 mb-4">
                    Drag and drop files here or click to select
                </p>
                <button className="bg-white/10 hover:bg-white/20 text-white/80 px-6 py-2 rounded-lg transition-all">
                    Select Image
                </button>
            </div>
            {selectedFiles.length > 0 && (
                <div className="mt-4 text-white/70">
                    <p>Selected Files:</p>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <div className="flex gap-2 items-center justify-center">
                                <li key={index}>{file.name}</li>{" "}
                                <button
                                    className="px-2 py-1 rounded-md cursor-pointer text-center"
                                    onClick={(e) => setSelectedFiles([])}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6 hover:scale-110"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <button
                    className={`${
                        !loadingState ? "cursor-pointer" : "cursor-not-allowed"
                    } px-8 py-4 bg-white/10 hover:bg-white/20 cursor-pointer mt-10 rounded-lg`}
                    disabled={!selectedFiles[0] || loadingState}
                    onClick={handleImageSendToBackend}
                >
                    {!loadingState ? "Analyze Image" : <Loader />}
                </button>
            </div>
        </div>
    );
    // --------------------------------------------------------------------------------------------------------------------

    const [inputText, setInputText] = useState("");
    //  sending text to backend with this function

    const handleTextSendToBackend = async () => {
        setLoadingState(true);
        if (inputText.length === 0) {
            alert("Please enter some text first");
            return;
        }

        const requestBody = {
            query: inputText, // Key 'query' with the text value
        };

        try {
            const response = await fetch(
                "http://localhost:8000/text",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Specify the Content-Type as JSON
                    },
                    body: JSON.stringify(requestBody), // Send formData directly, not as a string
                }
            );
            const result = await response.json();
            console.log("Backend Response:", result);
            setSelectedPage("analysis");
            setAnalysisResult(result);
            setLoadingState(false);
        } catch (error) {
            console.error("Network Error:", error);
            setLoadingState(false);
        }
    };

    // Rest of the component remains the same as in the original code
    const renderTextInputPage = () => (
        <div className="p-8">
            <textarea
                className="w-full h-64 bg-white/10 text-white/80 p-4 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex justify-end mt-4">
                <button
                    className={`${
                        !loadingState ? "cursor-pointer" : "cursor-not-allowed"
                    } hover:bg-white/20 bg-white/10 px-6 py-3 rounded-lg transition-all cursor-pointer 
                        
                    `}
                    onClick={handleTextSendToBackend}
                    disabled={loadingState || inputText.length == 0}
                >
                    {!loadingState ? "Analyze" : <Loader />}
                </button>
            </div>
        </div>
    );

    // -----------------------------------------------------------------------------------------------------------------

    // Render method and other parts remain the same as in the original code
    // values for analysis page
    // analysisResult.type
    // analysisResult.severity_label
    // analysisResult.severity_percentage
    // analysisResult.sensitivity_percentage
    // analysisResult.recommended_action
    // analysisResult.guideline_violated

    const [severity_label , setSeverityLabel] = useState("");


    const [guidelinesViolated, setGuidelinesViolated] = useState(null);
    useEffect(() => {
        if (
            analysisResult.type === "image" &&
            analysisResult.violations &&
            analysisResult.violations.length > 0
        ) {
            setGuidelinesViolated(analysisResult.violations[0].guideline_name);
        } else {
            setGuidelinesViolated(analysisResult.guideline_violated);
        }



        if (analysisResult.severity_percentage == 0 ){
            setSeverityLabel("none")
        }else if (analysisResult.severity_percentage < 25) {
            setSeverityLabel("Low")
        }
        else if (analysisResult.severity_percentage < 50) {
            setSeverityLabel("Medium")
        }
        else if (analysisResult.severity_percentage < 75) {
            setSeverityLabel("High")
        }
        else {
            setSeverityLabel("Critical")
        }
    }, [analysisResult]);

    const renderAnalysisPage = () => (
        <div className="grid grid-cols-1 mt-20 md:grid-cols-2 gap-8 ">
            {/* Left Side - Analysis */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 ">
                <h2 className="text-2xl font-bold mb-6 text-white/80">
                    Content Analysis
                </h2>

                <div className="flex flex-wrap justify-around gap-6 ">
                    {/* Sensitivity Radial Progress */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white/70 pl-10">
                            Sensitivity
                        </h3>
                        <motion.div
                            className="radial-progress"
                            style={
                                {
                                    "--value":
                                        analysisResult.sensitivity_percentage,
                                    "--size": "10rem",
                                    "--thickness": "1.5rem",
                                } as React.CSSProperties
                            }
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                {analysisResult.sensitivity_percentage}%
                            </motion.span>
                        </motion.div>
                    </div>

                    {/* Severity Radial Progress */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white/70 pl-10">
                            Severity
                        </h3>
                        <motion.div
                            className="radial-progress"
                            style={
                                {
                                    "--value":
                                        analysisResult.severity_percentage,
                                    "--size": "10rem",
                                    "--thickness": "1.5rem",
                                } as React.CSSProperties
                            }
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                {analysisResult.severity_percentage}%
                            </motion.span>
                        </motion.div>
                    </div>
                </div>

                {/* Severity Level Breakdown */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-white/70">
                        Severity Levels
                    </h3>
                    <div className="space-y-2">
                        {["Critical", "High", "Medium", "Low" ,"none"].map(
                            (level, index) => (
                                <div key={level} className="flex items-center">
                                    {level ==
                                    severity_label ? (
                                        <>
                                            {" "}
                                            <span
                                                className="w-4 h-4 rounded-full mr-2 opacity-50"
                                                style={{
                                                    backgroundColor: `rgba(255,255,255,${
                                                        1 - index * 0.25
                                                    })`,
                                                }}
                                            ></span>
                                            <span className="text-white/70">
                                                {level}: Risk Level
                                            </span>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Suggestions and Guidelines */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-white/80">
                    Recommendations
                </h2>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-white/70">
                        Violated Guidelines
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-white/60">
                        {analysisResult.severity_percentage > 10 ? (
                            <>
                                <li>{guidelinesViolated}</li>
                                <li>Potential Inappropriate Content</li>
                                <li>Risk of Harmful Language</li>
                            </>
                        ) : (
                            <li>No guidelines violated</li>
                        )}
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-white/70">
                        Suggested Actions
                    </h3>
                    {/* <ul className="list-disc list-inside space-y-2 text-white/60">
                        <li>Review and Modify Content</li>
                        <li>Apply Content Filters</li>
                        <li>Implement Contextual Warnings</li>
                        <li>Consult Content Guidelines</li>
                    </ul> */}

                    <ul className="list-disc list-inside space-y-2 text-white/60">
                        {analysisResult.severity_percentage > 10 ? (
                            <>
                                {analysisResult.recommended_action.split(" ")
                                    .length > 1 ? (
                                    <li>{analysisResult.recommended_action}</li>
                                ) : (
                                    <span></span>
                                )}
                                <li>Review and Modify Content</li>
                                <li>Apply Content Filters</li>
                                <li>Implement Contextual Warnings</li>
                            </>
                        ) : (
                            <li>No suggested action for this content</li>
                        )}
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
                    backgroundSize: "200% 200%",
                }}
                animate={{
                    backgroundPosition: [
                        "0% 0%",
                        "100% 50%",
                        "50% 100%",
                        "0% 0%",
                    ],
                }}
                transition={{
                    duration: 10,
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
                    backgroundSize: "100px 100px",
                    mixBlendMode: "overlay",
                }}
            />

            {/* Navigation */}

            <div className="absolute top-0 left-0 right-0 p-4 flex-col justify-center space-x-4 z-20">
                {/* <Link
                    href="/"
                    className="font-mono text-lg flex gap-2 items-center p-5"
                    passHref
                >
                    <div className="text-gray-200"> SentinelScan </div>
                </Link> */}
                <Navbar />
                <div className="w-full flex justify-center gap-7 my-5">
                    <button
                        className={`px-4 py-2 rounded-lg transition-all ${
                            selectedPage === "upload"
                                ? "bg-white/20 text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                        onClick={() => setSelectedPage("upload")}
                    >
                        Upload
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-all ${
                            selectedPage === "text"
                                ? "bg-white/20 text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                        onClick={() => setSelectedPage("text")}
                    >
                        Add Text
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-all ${
                            selectedPage === "analysis"
                                ? "bg-white/20 text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                        onClick={() => setSelectedPage("analysis")}
                    >
                        Analysis
                    </button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto p-8 text-white mt-16">
                {selectedPage === "upload" && renderUploadPage()}
                {selectedPage === "text" && renderTextInputPage()}
                {selectedPage === "analysis" && renderAnalysisPage()}
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
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: conic-gradient(
                        rgba(255, 255, 255, 0.5) calc(var(--value, 0) * 1%),
                        rgba(255, 255, 255, 0.1) calc(var(--value, 0) * 1%)
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
