"use client";

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import '../css/custome.css';

export default function LoginPrompt() {
    const [progress, setProgress] = useState(0);
    const [countdown, setCountdown] = useState(2);
    const progressBarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let animationFrameId;
        const startTime = Date.now();
        const duration = 2000;

        const updateProgress = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            const remainingTime = Math.ceil((duration - elapsed) / 1000);
            setProgress(newProgress);
            setCountdown(remainingTime);

            if (newProgress < 100) {
                animationFrameId = requestAnimationFrame(updateProgress);
            }
        };

        // Start immediately
        animationFrameId = requestAnimationFrame(updateProgress);

        const timer = setTimeout(() => {
            navigate('/login');
        }, duration);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            clearTimeout(timer);
        };        
        
    }, [navigate]);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-lg transition-opacity" />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl transform transition-all duration-300 scale-95 animate-scale-in">
                <div className="text-center space-y-6">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    {/* Text Content */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Login Required
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Please login to purchase credits
                        </p>
                    </div>

                    {/* Animated Progress Bar - FIXED */}
                    <div className="pt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                ref={progressBarRef}
                                className="progress-bar-fill"
                                style={{
                                    width: `${progress.toFixed(0)}%`,
                                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                                    height: '12px',
                                    borderRadius: '6px',
                                    transition: 'width 50ms linear'
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                            Redirecting in {countdown}s...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}