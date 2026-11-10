import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'


function App() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white">
                    Online Course Platform
                </h1>

                <p className="mt-4 text-lg text-gray-400">
                    Learn. Practice. Grow.
                </p>

                <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default App;
