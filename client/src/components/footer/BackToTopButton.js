import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add scroll event listener to track scroll position
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Set isVisible to true when scroll position is greater than a certain threshold
      setIsVisible(scrollY > 300);
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // for smooth scrolling
    });
  };

  return (
    <div>
      {isVisible && (
        <button className="back-to-top" onClick={scrollToTop}>
          	&#8593;
        </button>
      )}
    </div>
  );
};

export default BackToTopButton;
