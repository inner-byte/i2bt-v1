import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const cardHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

export const microInteraction = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
};

export const slideIn: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: { 
    x: 20, 
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};
