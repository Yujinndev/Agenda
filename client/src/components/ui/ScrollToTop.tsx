import { ArrowUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to handle the scroll event
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 200);
  };

  // Function to scroll to the top of the page
  const topScreen = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add event listener to handle scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <div className='fixed lg:right-4 right-0 bottom-4 p-4 cursor-pointer w-[80px] h-[80px] rounded-ful text-black flex items-center justify-center' onClick={topScreen}>
        <ArrowUp size={40} />
      </div>
    )
  );
};

export default ScrollToTop;
