"use client";
import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <nav className="sticky inset-x-0 top-0 z-30 text-black mt-5 bg-transparent flex items-center justify-between px-4 max-w-lg lg:max-w-6xl md:max-w-2xl mx-auto transition-all border-gray-200">
            <div className="flex items-center">
                <Link
                    href="/"
                    className="font-mono text-lg flex gap-2 items-center"
                    passHref
                >
                    <div className="text-gray-200"> SentinelScan </div>
                </Link>
            </div>

            <div className="flex items-center space-x-5 border border-zinc-700 rounded-xl p-2 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-700">
                <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                >
                    <button className="text-gray-200 flex font-mono gap-2 items-center justify-center w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-github mr-2"
                        >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                        Github
                    </button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
