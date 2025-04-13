import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Check,
  HelpCircle,
  Heart,
  Loader2,
  Camera,
} from "lucide-react";

// Shuffle function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Main game component
export default function IdentityExplorer() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [showFullImage, setShowFullImage] = useState(null);

  // Add new state for shuffled items
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

  // Sample game levels data with images
  const levels = [
    {
      title: "Gender Identity Basics",
      question:
        "Match these gender identity terms with their visual representations",
      items: [
        {
          id: 1,
          term: "Cisgender",
          definition: "When gender identity matches sex assigned at birth",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing cisgender identity",
          color: "#4F46E5", // indigo-600
        },
        {
          id: 2,
          term: "Transgender",
          definition: "When gender identity differs from sex assigned at birth",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing transgender identity",
          color: "#9333EA", // purple-600
        },
        {
          id: 3,
          term: "Non-binary",
          definition:
            "Gender identity that doesn't fit exclusively as male or female",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing non-binary identity",
          color: "#10B981", // emerald-500
        },
        {
          id: 4,
          term: "Gender fluid",
          definition: "Gender identity that varies over time",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing gender fluid identity",
          color: "#3B82F6", // blue-500
        },
      ],
      explanation:
        "Gender identity is one's internal sense of their gender, which may or may not align with the sex assigned at birth. Understanding these terms helps us recognize and respect diverse gender experiences.",
    },
    {
      title: "Sexual Orientation",
      question: "Connect each orientation with its visual representation",
      items: [
        {
          id: 1,
          term: "Heterosexual",
          definition: "Attraction to people of a different gender",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing heterosexual orientation",
          color: "#EC4899", // pink-500
        },
        {
          id: 2,
          term: "Homosexual",
          definition: "Attraction to people of the same gender",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing homosexual orientation",
          color: "#F59E0B", // amber-500
        },
        {
          id: 3,
          term: "Bisexual",
          definition: "Attraction to two or more genders",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing bisexual orientation",
          color: "#8B5CF6", // violet-500
        },
        {
          id: 4,
          term: "Asexual",
          definition: "Little to no sexual attraction to any gender",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing asexual orientation",
          color: "#6366F1", // indigo-500
        },
      ],
      explanation:
        "Sexual orientation describes patterns of emotional, romantic, or sexual attraction. There are many valid orientations, and all deserve respect and understanding.",
    },
    {
      title: "Gender Expression",
      question: "Match expressions with their visual representations",
      items: [
        {
          id: 1,
          term: "Masculine",
          definition: "Traits traditionally associated with men or boys",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing masculine expression",
          color: "#0284C7", // sky-600
        },
        {
          id: 2,
          term: "Feminine",
          definition: "Traits traditionally associated with women or girls",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing feminine expression",
          color: "#DB2777", // pink-600
        },
        {
          id: 3,
          term: "Androgynous",
          definition: "Expressing both masculine and feminine characteristics",
          image: "/api/placeholder/250/250",
          imageAlt: "Illustration representing androgynous expression",
          color: "#7C3AED", // violet-600
        },
        {
          id: 4,
          term: "Gender non-conforming",
          definition: "Expression that doesn't follow gender norms",
          image: "/api/placeholder/250/250",
          imageAlt:
            "Illustration representing gender non-conforming expression",
          color: "#059669", // emerald-600
        },
      ],
      explanation:
        "Gender expression is how someone presents their gender through behavior, clothing, hairstyle, etc. Expression is personal and doesn't have to match societal expectations or one's gender identity.",
    },
  ];

  // Sound effects (simulated)
  const playSound = (soundType) => {
    if (!soundEnabled) return;
    console.log(`Playing sound: ${soundType}`);
  };

  // Handle drag start
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ ...item, type });
    playSound("drag");
  };

  // Handle drop
  const handleDrop = (e, targetItem, targetType) => {
    e.preventDefault();

    if (!draggedItem) return;

    // If we're matching a term with its definition
    if (draggedItem.type !== targetType && draggedItem.id === targetItem.id) {
      setIsCorrect(true);
      setFeedback("Correct match!");
      playSound("correct");
      setScore(score + 10);
      setCompleted([...completed, draggedItem.id]);

      // Check if level is complete
      if (completed.length + 1 === levels[currentLevel].items.length) {
        setTimeout(() => {
          if (currentLevel < levels.length - 1) {
            setFeedback("Level complete! Moving to next level...");
            setTimeout(() => {
              setCurrentLevel(currentLevel + 1);
              setCompleted([]);
              setFeedback("");
              setIsCorrect(null);
            }, 2000);
          } else {
            setFeedback("Congratulations! You completed all levels!");
          }
        }, 1000);
      }
    } else {
      setIsCorrect(false);
      setFeedback("Not quite. Try again!");
      playSound("incorrect");
      setTimeout(() => {
        setIsCorrect(null);
        setFeedback("");
      }, 1500);
    }

    setDraggedItem(null);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Reset current level
  const resetLevel = () => {
    setCompleted([]);
    setFeedback("");
    setIsCorrect(null);
    setShuffledTerms(shuffleArray(currentLevelData.items));
    setShuffledDefinitions(shuffleArray(currentLevelData.items));
    playSound("reset");
  };

  // Toggle game explanations
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
    playSound("click");
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Get current level data
  const currentLevelData = levels[currentLevel];

  // Add useEffect to handle shuffling when level changes
  useEffect(() => {
    if (currentLevelData) {
      setShuffledTerms(shuffleArray(currentLevelData.items));
      setShuffledDefinitions(shuffleArray(currentLevelData.items));
    }
  }, [currentLevel]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      {/* Game header */}
      <header className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            Visual Identity Explorer
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
            >
              {soundEnabled ? (
                <Volume2 className="text-indigo-600" />
              ) : (
                <VolumeX className="text-gray-400" />
              )}
            </button>
            <button
              onClick={resetLevel}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Reset level"
            >
              <Loader2 className="text-indigo-600" />
            </button>
            <button
              onClick={toggleExplanation}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Show explanation"
            >
              <HelpCircle className="text-indigo-600" />
            </button>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-gray-600">
            Level: {currentLevel + 1}/{levels.length}
          </div>
          <div className="text-indigo-600 font-semibold">Score: {score}</div>
        </div>
      </header>

      {/* Game content */}
      <main className="flex-grow flex flex-col bg-white rounded-lg shadow-md p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-center text-purple-700 mb-2">
          {currentLevelData.title}
        </h2>
        <p className="text-center text-gray-700 mb-6">
          {currentLevelData.question}
        </p>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mb-6 p-3 rounded-lg text-center font-medium ${
              isCorrect === true
                ? "bg-green-100 text-green-700"
                : isCorrect === false
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Game explanation */}
        {showExplanation && (
          <div className="bg-indigo-50 p-4 rounded-lg mb-6 border-l-4 border-indigo-500">
            <h3 className="font-bold text-indigo-700 mb-2">How to Play</h3>
            <p className="text-gray-700 mb-2">
              Drag terms and drop them onto their matching visual
              representations. Get all matches correct to advance to the next
              level.
            </p>
            <p className="text-gray-700">{currentLevelData.explanation}</p>
          </div>
        )}

        {/* Game board */}
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Terms column */}
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="font-semibold text-center text-indigo-700">Terms</h3>
            {shuffledTerms.map((item) => (
              <div
                key={`term-${item.id}`}
                className={`p-4 bg-indigo-100 rounded-lg shadow-sm cursor-pointer transition-all ${
                  completed.includes(item.id)
                    ? "opacity-50"
                    : "hover:shadow-md hover:bg-indigo-200"
                }`}
                draggable={!completed.includes(item.id)}
                onDragStart={(e) => handleDragStart(e, item, "term")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item, "term")}
                style={{
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <div className="flex items-center">
                  {completed.includes(item.id) && (
                    <Check className="text-green-500 mr-2" size={16} />
                  )}
                  <span className="font-medium">{item.term}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {item.definition}
                </div>
              </div>
            ))}
          </div>

          {/* Visual representations column */}
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <h3 className="font-semibold text-center text-purple-700 col-span-full">
              Visual Representations
            </h3>
            {shuffledDefinitions.map((item) => (
              <div
                key={`def-${item.id}`}
                className={`p-4 bg-white border rounded-lg shadow-sm cursor-pointer transition-all ${
                  completed.includes(item.id)
                    ? "opacity-70 border-green-500"
                    : "hover:shadow-md hover:border-purple-300 border-gray-200"
                }`}
                draggable={!completed.includes(item.id)}
                onDragStart={(e) => handleDragStart(e, item, "definition")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item, "definition")}
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-3 bg-gray-50 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowFullImage(item)}
                    />
                    {completed.includes(item.id) && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                  </div>
                  {completed.includes(item.id) && (
                    <span className="text-sm font-medium text-center text-gray-700">
                      {item.term}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress visualization */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-center text-gray-700 mb-4">
            Progress
          </h3>
          <div className="flex justify-center items-center h-16">
            <div className="w-full max-w-md bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{
                  width: `${
                    (completed.length / currentLevelData.items.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <span className="ml-4 font-medium">
              {completed.length}/{currentLevelData.items.length}
            </span>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {completed.map((itemId) => {
              const matchedItem = currentLevelData.items.find(
                (item) => item.id === itemId
              );
              return (
                <div
                  key={`icon-${itemId}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: matchedItem?.color || "#4F46E5" }}
                >
                  <Check className="text-white" size={16} />
                </div>
              );
            })}
            {Array(currentLevelData.items.length - completed.length)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300"
                ></div>
              ))}
          </div>
        </div>
      </main>

      {/* Full image modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullImage(null)}
        >
          <div className="bg-white rounded-lg max-w-xl w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{showFullImage.term}</h3>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setShowFullImage(null)}
              >
                ✕
              </button>
            </div>
            <div className="rounded-md overflow-hidden mb-4">
              <img
                src={showFullImage.image}
                alt={showFullImage.imageAlt}
                className="w-full h-auto"
              />
            </div>
            <p className="text-gray-700 mb-3">{showFullImage.definition}</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => setShowFullImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game footer */}
      <footer className="mt-4 text-center text-gray-500 text-sm">
        <p>
          Educational game designed to promote understanding and respect for
          diverse identities through visual learning
        </p>
      </footer>
    </div>
  );
}
