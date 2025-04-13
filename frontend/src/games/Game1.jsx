import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Trophy,
  RefreshCw,
  Check,
  ChevronRight,
  ArrowLeft,
  Info,
  XCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const Game1 = () => {
  const [draggingItem, setDraggingItem] = useState(null);
  const [matches, setMatches] = useState({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [shuffledTexts, setShuffledTexts] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [revealingHint, setRevealingHint] = useState(false);
  const [activeHintIndex, setActiveHintIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Game levels data with increasing difficulty
  const levels = [
    {
      id: 1,
      title: "Level 1: Basic Body Language",
      description: "Match basic body language cues with verbal expressions",
      bgGradient: "from-blue-100 to-purple-100",
      items: [
        {
          id: 1,
          image: "/api/placeholder/300/200",
          text: "Yes, I am comfortable",
          correctMatch: 1,
          description: "Open posture with relaxed shoulders",
          hint: "Look for signs of openness and comfort",
        },
        {
          id: 2,
          image: "/api/placeholder/300/200",
          text: "I am not okay with this",
          correctMatch: 2,
          description: "Crossed arms and leaning away",
          hint: "Consider defensive body postures",
        },
        {
          id: 3,
          image: "/api/placeholder/300/200",
          text: "I feel safe and respected",
          correctMatch: 3,
          description: "Maintaining eye contact with a relaxed smile",
          hint: "Eye contact often indicates trust",
        },
      ],
    },
    {
      id: 2,
      title: "Level 2: Professional Settings",
      description: "Match body language in workplace situations",
      bgGradient: "from-indigo-100 to-teal-100",
      items: [
        {
          id: 1,
          image: "/api/placeholder/300/200",
          text: "I'm interested in your proposal",
          correctMatch: 1,
          description: "Leaning forward with attentive gaze",
          hint: "Engagement often shows through leaning posture",
        },
        {
          id: 2,
          image: "/api/placeholder/300/200",
          text: "I'm skeptical about these numbers",
          correctMatch: 2,
          description: "Slight frown with hand on chin",
          hint: "Critical thinking has distinct facial expressions",
        },
        {
          id: 3,
          image: "/api/placeholder/300/200",
          text: "I need more time to consider",
          correctMatch: 3,
          description: "Leaning back with thoughtful expression",
          hint: "Creating distance can indicate processing time",
        },
        {
          id: 4,
          image: "/api/placeholder/300/200",
          text: "I'm ready to collaborate",
          correctMatch: 4,
          description: "Open palms and engaged posture",
          hint: "Open hands often signal openness to ideas",
        },
      ],
    },
    {
      id: 3,
      title: "Level 3: Social Interactions",
      description: "Interpret complex social cues and subtle expressions",
      bgGradient: "from-rose-100 to-amber-100",
      items: [
        {
          id: 1,
          image: "/api/placeholder/300/200",
          text: "I'm enjoying our conversation",
          correctMatch: 1,
          description: "Mirroring posture with genuine smile",
          hint: "Mirroring often indicates rapport",
        },
        {
          id: 2,
          image: "/api/placeholder/300/200",
          text: "I'd like to leave soon",
          correctMatch: 2,
          description: "Feet pointed toward exit with quick glances away",
          hint: "Foot direction reveals intended movement",
        },
        {
          id: 3,
          image: "/api/placeholder/300/200",
          text: "I disagree but I'm being polite",
          correctMatch: 3,
          description: "Tight-lipped smile with slight tension",
          hint: "Look for incongruence between smile and tension",
        },
        {
          id: 4,
          image: "/api/placeholder/300/200",
          text: "I'm nervous about this situation",
          correctMatch: 4,
          description: "Fidgeting with hands and avoiding direct eye contact",
          hint: "Self-touch behaviors often indicate anxiety",
        },
        {
          id: 5,
          image: "/api/placeholder/300/200",
          text: "I'm impressed by what I'm hearing",
          correctMatch: 5,
          description: "Raised eyebrows with nodding and engaged posture",
          hint: "Eyebrow movement often signals surprise or interest",
        },
      ],
    },
  ];

  // Get current level data
  const currentLevelData = useMemo(
    () => levels.find((level) => level.id === currentLevel) || levels[0],
    [currentLevel]
  );

  const items = currentLevelData.items;

  // Shuffle items function
  const shuffleItems = useCallback(() => {
    const textItems = items.map((item) => ({
      id: item.id,
      text: item.text,
    }));
    return textItems.sort(() => Math.random() - 0.5);
  }, [items]);

  // Initialize or reset game state
  useEffect(() => {
    setShuffledTexts(shuffleItems());
    setMatches({});
    setGameCompleted(false);
    setFeedback(null);
    setAttempts(0);
  }, [currentLevel, shuffleItems]);

  // Check game completion
  useEffect(() => {
    if (Object.keys(matches).length === items.length) {
      setGameCompleted(true);
      // Calculate level score based on attempts
      const levelScore = Math.max(100 - attempts * 10, 50);
      setScore((prevScore) => prevScore + levelScore);
    }
  }, [matches, items.length, attempts]);

  const handleDragStart = (e, id, text) => {
    e.target.classList.add("opacity-50");
    setDraggingItem({ id, text });
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("opacity-50");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add(
      "border-dashed",
      "border-4",
      "border-purple-400"
    );
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove(
      "border-dashed",
      "border-4",
      "border-purple-400"
    );
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    e.currentTarget.classList.remove(
      "border-dashed",
      "border-4",
      "border-purple-400"
    );

    if (!draggingItem) return;

    const targetItem = items.find((item) => item.id === targetId);
    setAttempts((prev) => prev + 1);

    if (targetItem) {
      if (draggingItem.id === targetItem.correctMatch) {
        // Correct match
        setMatches((prev) => ({ ...prev, [targetId]: draggingItem.id }));
        setFeedback({
          type: "success",
          message: "Correct match! Well done!",
        });

        // Add match animation effect
        const imageElement = document.getElementById(`image-${targetId}`);
        if (imageElement) {
          imageElement.classList.add("scale-105");
          setTimeout(() => {
            imageElement.classList.remove("scale-105");
          }, 500);
        }
      } else {
        // Incorrect match
        setFeedback({
          type: "error",
          message: "Not quite right. Try another match!",
        });
      }

      // Clear feedback after 2 seconds
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const handleRestartGame = () => {
    setMatches({});
    setGameCompleted(false);
    setFeedback(null);
    setAttempts(0);
    setShuffledTexts(shuffleItems());
  };

  const handleNextLevel = () => {
    const nextLevel = currentLevel < levels.length ? currentLevel + 1 : 1;
    setCurrentLevel(nextLevel);
  };

  const handlePreviousLevel = () => {
    const prevLevel = currentLevel > 1 ? currentLevel - 1 : levels.length;
    setCurrentLevel(prevLevel);
  };

  const toggleHint = (index) => {
    if (activeHintIndex === index) {
      setActiveHintIndex(null);
    } else {
      setActiveHintIndex(index);
      setRevealingHint(true);
      setTimeout(() => setRevealingHint(false), 300);
    }
  };

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return (Object.keys(matches).length / items.length) * 100;
  }, [matches, items.length]);

  return (
    <div
      className={`flex flex-col items-center min-h-screen bg-gradient-to-br ${currentLevelData.bgGradient} text-gray-800 p-6 transition-all duration-500`}
    >
      {/* Game Header */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg bg-white mb-8 border-b-4 border-purple-500">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4 sm:mb-0">
            Body Language Matching Game
          </h1>
          <div className="flex space-x-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setCurrentLevel(level.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  currentLevel === level.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {level.id}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-purple-600 mb-2">
              {currentLevelData.title}
            </h2>
            <p className="text-gray-600">{currentLevelData.description}</p>
          </div>

          <div className="mt-4 sm:mt-0 bg-purple-100 rounded-lg px-4 py-2 flex items-center">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="font-bold text-purple-800">Score: {score}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Instructions Callout - Collapsible */}
      {!gameCompleted && (
        <div className="w-full max-w-4xl mb-6">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex justify-between items-center w-full p-4 rounded-t-lg bg-blue-100 hover:bg-blue-200 transition-colors border-b-2 border-blue-300"
          >
            <div className="flex items-center">
              <Info className="w-5 h-5 text-blue-700 mr-2" />
              <h3 className="font-semibold text-blue-800">How to play</h3>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-blue-700 transition-transform duration-300 ${
                showInstructions ? "rotate-90" : ""
              }`}
            />
          </button>

          {showInstructions && (
            <div className="bg-white shadow-md rounded-b-lg p-4 border-l-4 border-blue-500 transition-all duration-300">
              <ol className="list-decimal list-inside text-gray-700 pl-4 space-y-2">
                <li>Drag the verbal cues from the right panel</li>
                <li>
                  Drop them onto the matching body language image on the left
                </li>
                <li>Match all pairs correctly to complete the level</li>
                <li>
                  Hints are available if you need help with a particular match
                </li>
                <li>The fewer attempts you make, the higher your score!</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Game Content */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Body Language Images */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-semibold text-center text-purple-700 mb-2 flex items-center justify-center">
            <span className="relative">
              Body Language
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-purple-400 rounded-full"></span>
            </span>
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              id={`image-${item.id}`}
              className={`relative w-full h-[200px] rounded-xl shadow-lg transition-all duration-300 overflow-hidden
                ${
                  matches[item.id]
                    ? "ring-4 ring-green-500"
                    : "bg-white hover:shadow-xl"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={`Body language example ${item.id}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3 text-sm text-white">
                {item.description}
              </div>

              {/* Hint button */}
              {!matches[item.id] && (
                <button
                  onClick={() => toggleHint(item.id)}
                  className="absolute top-2 right-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full p-1 transition-colors"
                  title="Show hint"
                >
                  <Lightbulb className="w-5 h-5" />
                </button>
              )}

              {/* Hint popup */}
              {activeHintIndex === item.id && (
                <div
                  className={`absolute top-10 right-2 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-3 shadow-lg max-w-xs z-10 ${
                    revealingHint ? "animate-fade-in" : ""
                  }`}
                >
                  <p className="text-yellow-800 text-sm">
                    <span className="font-bold">Hint:</span> {item.hint}
                  </p>
                </div>
              )}

              {/* Matched Overlay */}
              {matches[item.id] && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-30 flex items-center justify-center">
                  <div className="bg-green-600 rounded-full p-2 animate-bounce">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Verbal Cues */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-semibold text-center text-purple-700 mb-2 flex items-center justify-center">
            <span className="relative">
              Verbal Cues
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-purple-400 rounded-full"></span>
            </span>
          </h2>

          {shuffledTexts.map((item) => {
            // Check if this item has been matched already
            const isMatched = Object.values(matches).includes(item.id);

            return (
              <div
                key={item.id}
                className={`w-full h-[200px] py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center
                  ${
                    isMatched
                      ? "bg-green-100 border-2 border-green-500 text-green-700 opacity-75"
                      : "bg-white hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 text-gray-800 cursor-grab hover:-translate-y-1"
                  }`}
                draggable={!isMatched}
                onDragStart={(e) =>
                  !isMatched && handleDragStart(e, item.id, item.text)
                }
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-lg text-center w-full">
                    {item.text}
                  </span>
                  {isMatched && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 ml-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`w-full max-w-4xl p-4 rounded-lg text-center mb-6 transition-all duration-300 transform ${
            feedback ? "scale-100" : "scale-95 opacity-0"
          }
            ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
        >
          <div className="flex items-center justify-center">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 mr-2 text-red-600" />
            )}
            <p className="font-bold">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Game Completed */}
      {gameCompleted && (
        <div className="w-full max-w-4xl p-8 rounded-xl shadow-lg bg-white text-center border-4 border-green-500 animate-fade-in-up">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Trophy className="w-20 h-20 text-yellow-500 mb-4" />
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-500 mb-2">
              Congratulations! Level {currentLevel} Completed!
            </h2>

            <p className="text-gray-600 mb-4">
              You've matched all the body language cues correctly!
            </p>

            <div className="mb-6 p-4 bg-purple-50 rounded-xl">
              <p className="text-lg font-bold text-purple-800">
                Level Score: +{Math.max(100 - attempts * 10, 50)}
              </p>
              <p className="text-sm text-purple-600">
                Based on {attempts} attempts
              </p>
              <p className="text-lg font-bold text-purple-800 mt-2">
                Total Score: {score}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleRestartGame}
                className="bg-purple-100 text-purple-700 border-2 border-purple-500 py-3 px-6 rounded-lg hover:bg-purple-200 transition-colors flex items-center font-bold group"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform" />
                Try Again
              </button>

              {currentLevel < levels.length && (
                <button
                  onClick={handleNextLevel}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-600 transition-colors flex items-center font-bold group"
                >
                  Next Level
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {currentLevel === levels.length && (
                <button
                  onClick={() => setCurrentLevel(1)}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors flex items-center font-bold"
                >
                  Start Over
                  <RefreshCw className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Level Navigation */}
      {!gameCompleted && (
        <div className="w-full max-w-4xl flex justify-between mb-6">
          <button
            onClick={handlePreviousLevel}
            className="flex items-center text-purple-700 hover:text-purple-900 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Previous Level
          </button>

          <div className="text-gray-800 bg-white px-6 py-2 rounded-lg shadow-sm font-medium">
            Level {currentLevel} of {levels.length}
          </div>

          <button
            onClick={handleNextLevel}
            className="flex items-center text-purple-700 hover:text-purple-900 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
          >
            Next Level
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}

      {/* Game credits */}
      <div className="w-full max-w-4xl text-center mt-8 text-sm text-gray-500">
        <p>
          Body Language Matching Game • Educational Interactive Learning Tool
        </p>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Game1;
