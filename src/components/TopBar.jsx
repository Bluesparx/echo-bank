import React, { useState, useEffect } from 'react';
import { BsFacebook, BsGithub, BsWhatsapp, BsTwitter } from "react-icons/bs";
import dayjs from 'dayjs';

function TopBar() {
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs().format("DD/MM/YYYY, hh:mm:ss A"));
    }, 1000);
    
    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);
  
  return (
    <header className="bg-gradient-to-r from-gray-900 to-blue-900 py-3 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-white text-sm font-medium">{time}</p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/Bluesparx" 
              className="text-blue-300 hover:text-white transition-colors duration-200" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <BsGithub className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;