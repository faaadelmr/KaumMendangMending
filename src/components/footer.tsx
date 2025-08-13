"use client";

import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [typedText, setTypedText] = useState('#Coba');
  const words = ['AjaDulu', 'Lagi', 'AjaDulu', 'Mulai', 'AjaDulu', 'Berani', 'AjaDulu', 'Gagal', 'AjaDulu', 'in Nakama'];

  useEffect(() => {
    let wordIndex = 0;
    let isDeleting = false;
    let currentWord = '';
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const fullWord = words[wordIndex];
      
      if (isDeleting) {
        currentWord = fullWord.substring(0, currentWord.length - 1);
      } else {
        currentWord = fullWord.substring(0, currentWord.length + 1);
      }
      
      setTypedText(`#Coba${currentWord}`);
      
      let typeSpeed = isDeleting ? 100 : 150;

      if (!isDeleting && currentWord === fullWord) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentWord === '') {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before new word
      }

      timeoutId = setTimeout(type, typeSpeed);
    };

    type();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <footer className="bg-card/95 py-4 mt-8 border-t">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>
          Created by <a href="https://github.com/faaadelmr" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent font-semibold transition-colors">
            faaadelmr
          </a>
          <span> | Powered by Gemini AI</span>
        </p>
        <p className="font-code mt-2">
            {typedText}
            <span className="animate-ping">|</span>
        </p>
      </div>
    </footer>
  );
}
