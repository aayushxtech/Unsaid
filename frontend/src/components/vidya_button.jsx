import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Vidya from './vidya';

const VidyaButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  // Animation variants for the button
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10
      }
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    }
  };

  // Animation variants for the robot emoji
  const robotVariants = {
    initial: { y: 0 },
    hover: { 
      y: [-2, 0, -2], 
      transition: { 
        repeat: Infinity, 
        duration: 1.2 
      }
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-full px-5 py-3 flex items-center space-x-2 z-40 shadow-lg border-2 border-white"
        onClick={handleOpenChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={showChat ? { opacity: 0, scale: 0, y: 20 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          y: { duration: 0.3 }
        }}
      >
        <motion.span
          className="text-xl"
          variants={robotVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
        >
          🤖
        </motion.span>
        <span className="font-bold text-base">Talk to Vidya!</span>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full -z-10 opacity-0"
          animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {showChat && <Vidya onClose={handleCloseChat} />}
    </>
  );
};

export default VidyaButton;