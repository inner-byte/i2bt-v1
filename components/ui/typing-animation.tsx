'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypingAnimationProps {
  words: string[];
  className?: string;
}

export const TypingAnimation = ({ words, className = '' }: TypingAnimationProps) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(150);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, delta, currentWord, isDeleting]);

  const tick = () => {
    let fullWord = words[currentWord];
    let updatedText = isDeleting
      ? fullWord.substring(0, text.length - 1)
      : fullWord.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullWord) {
      setIsDeleting(true);
      setDelta(1000);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setCurrentWord((prev) => (prev + 1) % words.length);
      setDelta(500);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={className}
      >
        {text}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          |
        </motion.span>
      </motion.span>
    </AnimatePresence>
  );
};
