import { Variants } from 'framer-motion';

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Stagger animation for child elements
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Individual item animation
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Button interaction animations
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

// Motor rotation animation
export const motorRotation = {
  rotate: 360,
  transition: {
    duration: 2,
    ease: "linear",
    repeat: Infinity,
  },
};

// Current flow animation
export const currentFlowVariants: Variants = {
  animate: {
    strokeDashoffset: [20, 0],
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

// Pulse animation for indicators
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Fade in animation
export const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Slide animations
export const slideVariants: Variants = {
  initial: (direction: string) => ({
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
    opacity: 0,
  }),
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: (direction: string) => ({
    x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  }),
};

// Spring animations
export const springVariants: Variants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

// Shake animation for errors
export const shakeVariants: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.6,
    },
  },
};

// Glow effect animation
export const glowVariants: Variants = {
  animate: {
    boxShadow: [
      "0 0 5px rgba(34, 197, 94, 0.5)",
      "0 0 20px rgba(34, 197, 94, 0.8)",
      "0 0 5px rgba(34, 197, 94, 0.5)",
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Loading spinner animation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

// Typing animation
export const typingVariants: Variants = {
  animate: {
    width: ["0%", "100%"],
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

// Progress bar animation
export const progressVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

// Floating animation
export const floatingVariants: Variants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};
