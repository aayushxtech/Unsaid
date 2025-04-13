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
  const [currentPart, setCurrentPart] = useState(0);

  // Add new state for shuffled items
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

  // Sample game levels data with images
  const levels = [
    {
      title: "Online Safety Basics",
      parts: [
        {
          title: "Basic Protection",
          question: "Match these basic online protection terms with their meanings",
          items: [
            {
              id: 1,
              term: "Strong Password",
              definition: "Mix of letters, numbers, and symbols, at least 12 characters long",
              image: "/password.jpeg",
              imageAlt: "Illustration of a secure password",
              color: "#4F46E5",
            },
            {
              id: 2,
              term: "Two-Factor Authentication",
              definition: "Additional security step beyond password, like a code sent to phone",
              image: "/2fa.jpeg",
              imageAlt: "Illustration of 2FA process",
              color: "#9333EA",
            },
            {
              id: 3,
              term: "Privacy Settings",
              definition: "Controls who can see your personal information online",
              image: "/privacy.jpeg",
              imageAlt: "Illustration of privacy controls",
              color: "#10B981",
            }
          ]
        },
        {
          title: "Advanced Protection",
          question: "Match these advanced security features with their meanings",
          items: [
            {
              id: 4,
              term: "Data Encryption",
              definition: "Converting information into a code to prevent unauthorized access",
              image: "/api/safety/encryption",
              imageAlt: "Illustration of data encryption",
              color: "#DC2626",
            },
            {
              id: 5,
              term: "Secure Browsing",
              definition: "Using HTTPS and verified websites for safe internet navigation",
              image: "/api/safety/browsing",
              imageAlt: "Illustration of secure browsing",
              color: "#2563EB",
            },
            {
              id: 6,
              term: "Antivirus Software",
              definition: "Program that protects against malware and cyber threats",
              image: "/api/safety/antivirus",
              imageAlt: "Illustration of antivirus protection",
              color: "#059669",
            }
          ]
        }
      ]
    },
    {
      title: "Birth Control Methods",
      parts: [
        {
          title: "Basic Contraception",
          question: "Match these basic contraceptive methods with their descriptions",
          items: [
            {
              id: 1,
              term: "Birth Control Pills",
              definition: "Daily oral medication that prevents pregnancy through hormones",
              image: "/api/contraception/pills",
              imageAlt: "Illustration of birth control pills",
              color: "#EC4899",
            },
            {
              id: 2,
              term: "IUD",
              definition: "Long-term device inserted in uterus for pregnancy prevention",
              image: "/api/contraception/iud",
              imageAlt: "Illustration of IUD device",
              color: "#F59E0B",
            },
            {
              id: 3,
              term: "Barrier Methods",
              definition: "Physical prevention of sperm reaching egg (condoms, diaphragms)",
              image: "/api/contraception/barrier",
              imageAlt: "Illustration of barrier methods",
              color: "#8B5CF6",
            }
          ]
        },
        {
          title: "Advanced Contraception",
          question: "Match these advanced contraceptive methods with their descriptions",
          items: [
            {
              id: 4,
              term: "Contraceptive Patch",
              definition: "Adhesive patch worn on skin that releases hormones",
              image: "/api/contraception/patch",
              imageAlt: "Illustration of contraceptive patch",
              color: "#D946EF",
            },
            {
              id: 5,
              term: "Contraceptive Implant",
              definition: "Small rod inserted under skin providing long-term protection",
              image: "/api/contraception/implant",
              imageAlt: "Illustration of contraceptive implant",
              color: "#14B8A6",
            },
            {
              id: 6,
              term: "Vaginal Ring",
              definition: "Flexible ring inserted monthly that releases hormones",
              image: "/api/contraception/ring",
              imageAlt: "Illustration of vaginal ring",
              color: "#6366F1",
            }
          ]
        }
      ],
      explanation: "Understanding different contraceptive methods helps make informed decisions about reproductive health.",
    },
    {
      title: "Understanding Gender Fluidity",
      parts: [
        {
          title: "Gender Basics",
          question: "Match these gender expressions with their meanings",
          items: [
            {
              id: 1,
              term: "Gender Expression Spectrum",
              definition: "Range of ways people express gender through appearance and behavior",
              image: "/api/gender/spectrum",
              imageAlt: "Illustration of gender expression spectrum",
              color: "#0284C7",
            },
            {
              id: 2,
              term: "Gender Transition",
              definition: "Process of changing one's gender presentation to match identity",
              image: "/api/gender/transition",
              imageAlt: "Illustration of gender transition",
              color: "#DB2777",
            },
            {
              id: 3,
              term: "Gender Non-Conforming",
              definition: "Expression that doesn't align with traditional gender norms",
              image: "/api/gender/nonconforming",
              imageAlt: "Illustration of gender non-conforming expression",
              color: "#7C3AED",
            }
          ]
        },
        {
          title: "Gender Identity",
          question: "Match these gender identities with their meanings",
          items: [
            {
              id: 4,
              term: "Gender Identity",
              definition: "Internal sense of one's gender, which may differ from assigned sex",
              image: "/api/gender/identity",
              imageAlt: "Illustration of gender identity",
              color: "#EA580C",
            },
            {
              id: 5,
              term: "Gender Pronouns",
              definition: "Words used to refer to someone that reflect their gender identity",
              image: "/api/gender/pronouns",
              imageAlt: "Illustration of gender pronouns",
              color: "#4F46E5",
            },
            {
              id: 6,
              term: "Gender Affirming Care",
              definition: "Healthcare that supports and validates one's gender identity",
              image: "/api/gender/care",
              imageAlt: "Illustration of gender affirming care",
              color: "#0D9488",
            }
          ]
        }
      ],
      explanation: "Gender fluidity recognizes that gender can be dynamic and may change over time or express differently in various contexts.",
    }
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

      // Check if part is complete
      if (completed.length + 1 === currentLevelData.parts[currentPart].items.length) {
        setTimeout(() => {
          if (currentPart < currentLevelData.parts.length - 1) {
            setFeedback("Part complete! Moving to next part...");
            setTimeout(() => {
              setCurrentPart(currentPart + 1);
              setCompleted([]);
              setFeedback("");
              setIsCorrect(null);
            }, 2000);
          } else {
            // Move to next level
            if (currentLevel < levels.length - 1) {
              setFeedback("Level complete! Moving to next level...");
              setTimeout(() => {
                setCurrentLevel(currentLevel + 1);
                setCurrentPart(0);
                setCompleted([]);
                setFeedback("");
                setIsCorrect(null);
              }, 2000);
            } else {
              setFeedback("Congratulations! You completed all levels!");
            }
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
    const partData = getCurrentPartData();
    setCompleted([]);
    setFeedback("");
    setIsCorrect(null);
    if (partData?.items) {
      setShuffledTerms(shuffleArray(partData.items));
      setShuffledDefinitions(shuffleArray(partData.items));
    }
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

  // Add a safe getter for current level data
  const getCurrentLevelData = () => {
    return levels[currentLevel] || null;
  };

  // Add a safe getter for current part data
  const getCurrentPartData = () => {
    const levelData = getCurrentLevelData();
    return levelData?.parts?.[currentPart] || null;
  };

  // Use these getters in your component
  const currentLevelData = getCurrentLevelData();
  const currentPartData = getCurrentPartData();

  // Add useEffect to handle shuffling when level changes
  useEffect(() => {
    if (currentLevelData && currentLevelData.parts && currentLevelData.parts[currentPart]) {
      const currentItems = currentLevelData.parts[currentPart].items;
      setShuffledTerms(shuffleArray(currentItems));
      setShuffledDefinitions(shuffleArray(currentItems));
    }
  }, [currentLevel, currentPart]);

  useEffect(() => {
    const partData = getCurrentPartData();
    if (partData?.items) {
      setShuffledTerms(shuffleArray(partData.items));
      setShuffledDefinitions(shuffleArray(partData.items));
    }
  }, [currentLevel, currentPart]);

  return (
    <div 
      className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.05) 10%, transparent 20%),
          radial-gradient(circle at 90% 30%, rgba(139, 92, 246, 0.05) 15%, transparent 25%),
          radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 20%, transparent 30%)
        `,
        backgroundSize: '100% 100%',
      }}
    >
      {/* Update header background */}
      <header className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg shadow-indigo-100 p-4 mb-4 border border-indigo-100">
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
            Level: {currentLevel + 1}/{levels.length} - Part: {currentPart + 1}/2
          </div>
          <div className="text-indigo-600 font-semibold">Score: {score}</div>
        </div>
      </header>

      {/* Update main content background */}
      <main className="flex-grow flex flex-col bg-white/80 backdrop-blur-sm rounded-lg shadow-lg shadow-indigo-100 p-6 overflow-y-auto border border-indigo-100">
        {!currentLevelData || !currentPartData ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-600">
              <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
              <p>Loading game...</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-center text-purple-700 mb-2">
              {currentLevelData.parts[currentPart].title}
            </h2>
            <p className="text-center text-gray-700 mb-6">
              {currentLevelData.parts[currentPart].question}
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
              <div className="bg-indigo-50/50 p-4 rounded-lg mb-6 border-l-4 border-indigo-400">
                <h3 className="font-bold text-indigo-600 mb-2">How to Play</h3>
                <p className="text-slate-700 mb-2">
                  Drag terms and drop them onto their matching visual
                  representations. Get all matches correct to advance to the next
                  level.
                </p>
                <p className="text-slate-700">{currentLevelData.explanation}</p>
              </div>
            )}

            {/* Game board layout and card dimensions */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center">
              {/* Terms column */}
              <div className="w-full lg:w-1/2 grid grid-cols-1 gap-4">
                <h3 className="font-semibold text-center text-indigo-700">Terms</h3>
                {shuffledTerms.map((item) => (
                  <div
                    key={`term-${item.id}`}
                    className={`term-card rounded-lg shadow-sm cursor-pointer ${
                      completed.includes(item.id)
                        ? "opacity-50"
                        : "hover:shadow-md hover:bg-indigo-50/50"
                    }`}
                    draggable={!completed.includes(item.id)}
                    onDragStart={(e) => handleDragStart(e, item, "term")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item, "term")}
                    style={{
                      borderLeft: `4px solid ${item.color}`,
                    }}
                  >
                    <div className="term-content">
                      <div>
                        <div className="flex items-center mb-3">
                          {completed.includes(item.id) && (
                            <Check className="text-green-500 mr-2" size={16} />
                          )}
                          <span className="font-medium text-lg">{item.term}</span>
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-4">
                          {item.definition}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual representations column */}
              <div className="w-full lg:w-1/2 grid grid-cols-1 gap-4">
                <h3 className="font-semibold text-center text-purple-700">
                  Visual Representations
                </h3>
                {shuffledDefinitions.map((item) => (
                  <div
                    key={`def-${item.id}`}
                    className={`definition-card rounded-lg shadow-sm cursor-pointer ${
                      completed.includes(item.id)
                        ? "opacity-70 border-green-500"
                        : "hover:shadow-md hover:border-purple-300 border-gray-200"
                    }`}
                    draggable={!completed.includes(item.id)}
                    onDragStart={(e) => handleDragStart(e, item, "definition")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item, "definition")}
                  >
                    <div className="definition-content">
                      <div className="image-container mb-3">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="cursor-pointer"
                          onClick={() => setShowFullImage(item)}
                        />
                        {completed.includes(item.id) && (
                          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                            <Check className="text-white" size={16} />
                          </div>
                        )}
                      </div>
                      {completed.includes(item.id) && (
                        <div className="px-4 pb-4 text-sm font-medium text-center text-gray-700">
                          {item.term}
                        </div>
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
                <div className="w-full max-w-md bg-slate-100 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
                    style={{
                      width: `${
                        (completed.length / currentLevelData.parts[currentPart].items.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="ml-4 font-medium">
                  {completed.length}/{currentLevelData.parts[currentPart].items.length}
                </span>
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                {completed.map((itemId) => {
                  const matchedItem = currentPartData?.items?.find(
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
                {Array(currentPartData?.items?.length - completed.length || 0)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300"
                    ></div>
                  ))}
              </div>
            </div>
          </>
        )}
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

      {/* Update footer text color */}
      <footer className="mt-4 text-center text-slate-500 text-sm">
        <p>
          Educational game designed to promote understanding and respect for
          diverse identities through visual learning
        </p>
      </footer>
      <style jsx global>{`
        .term-card,
        .definition-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.2s ease-in-out;
          display: flex;
          flex-direction: column;
          height: 280px; /* Fixed height for both cards */
          width: 100%;
          position: relative;
        }
        
        .term-card:hover,
        .definition-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .term-content {
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .definition-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .image-container {
          height: 200px;
          overflow: hidden;
          border-radius: 0.375rem;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
