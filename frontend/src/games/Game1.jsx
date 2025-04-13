import React, { useState } from "react";
import { motion } from "framer-motion"; // For animations
import { Trophy } from "lucide-react";

const Game1 = () => {
  const [matches, setMatches] = useState({});
  const [gameCompleted, setGameCompleted] = useState(false);

  const items = [
    {
      id: 1,
      image: "/images/body-language-1.jpg",
      text: "Yes, I am comfortable",
      correctMatch: "Yes, I am comfortable",
    },
    {
      id: 2,
      image: "/images/body-language-2.jpg",
      text: "I am not okay with this",
      correctMatch: "I am not okay with this",
    },
    {
      id: 3,
      image: "/images/body-language-3.jpg",
      text: "I feel safe and respected",
      correctMatch: "I feel safe and respected",
    },
  ];

  const handleDrop = (e, itemId) => {
    const draggedText = e.dataTransfer.getData("text");
    const item = items.find((i) => i.id === itemId);

    if (item && draggedText === item.correctMatch) {
      setMatches((prev) => ({ ...prev, [itemId]: true }));
    } else {
      alert("Incorrect match! Try again.");
    }

    // Check if all matches are correct
    if (Object.keys(matches).length + 1 === items.length) {
      setGameCompleted(true);
    }
  };

  const handleDragStart = (e, text) => {
    e.dataTransfer.setData("text", text);
  };

  const handleRestartGame = () => {
    setMatches({});
    setGameCompleted(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
      {/* Game Header */}
      <motion.div
        className="w-full max-w-4xl p-6 rounded-lg shadow-lg bg-blue-700"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Match the Body Language with Verbal Cues
        </h1>
        <p className="text-gray-300">
          Drag and drop the verbal cues onto the correct body language images.
        </p>
      </motion.div>

      {/* Game Content */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Body Language Images */}
        <div className="flex flex-col space-y-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              className={`w-64 h-64 bg-gray-200 rounded-lg shadow-lg ${matches[item.id] ? "bg-green-500" : "bg-gray-200"
                }`}
              style={{
                backgroundImage: url(${item.image}),
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              {matches[item.id] && (
                <motion.div
                  className="text-white text-center font-bold mt-24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Matched!
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Verbal Cues */}
        <div className="flex flex-col space-y-6">
          {items.map((item) => (
            <motion.div
              key={item.text}
              className="bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg cursor-pointer"
              draggable
              onDragStart={(e) => handleDragStart(e, item.text)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Completed */}
      {gameCompleted && (
        <motion.div
          className="w-full max-w-4xl mt-6 p-6 rounded-lg shadow-lg bg-green-700 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Congratulations! You've matched all the cues correctly!
          </h2>
          <motion.button
            onClick={handleRestartGame}
            className="bg-yellow-500 text-gray-800 py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again <Trophy className="w-4 h-4 ml-2 inline" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Game1;