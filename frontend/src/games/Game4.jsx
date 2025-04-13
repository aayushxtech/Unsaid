import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Heart,
  AlertTriangle,
  Award,
  Info,
  Star,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Game scenarios with child-friendly descriptions
const touchScenarios = [
  {
    id: 1,
    text: "A doctor examining you with a parent present",
    good: true,
    icon: <Shield className="w-8 h-8 text-blue-600" />,
    explanation:
      "It's okay for doctors to examine you when a parent is there to keep you safe.",
  },

  {
    id: 3,
    text: "A hug from a family member that feels safe",
    good: true,
    icon: <Heart className="w-8 h-8 text-pink-600" />,
    explanation: "Hugs that feel safe and comfortable from family are okay.",
  },
  {
    id: 4,
    text: "Someone asking you to keep a touch secret",
    good: false,
    icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
    explanation: "No one should ask you to keep secrets about touching.",
  },
  {
    id: 5,
    text: "A high-five from a friend",
    good: true,
    icon: <Heart className="w-8 h-8 text-green-600" />,
    explanation:
      "Friendly touches like high-fives are fine when everyone feels comfortable.",
  },
  {
    id: 6,
    text: "Someone touching private parts of your body",
    good: false,
    icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
    explanation:
      "No one should touch the private parts of your body except for health reasons with a parent present.",
  },
  {
    id: 7,
    text: "A parent helping you get dressed when you're very young",
    good: true,
    icon: <Shield className="w-8 h-8 text-blue-600" />,
    explanation:
      "Parents help young children with getting dressed and that's okay.",
  },
  {
    id: 8,
    text: "Someone showing you pictures that make you uncomfortable",
    good: false,
    icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
    explanation:
      "No one should show you pictures that make you feel uncomfortable.",
  },
  {
    id: 9,
    text: "A teacher patting your back for good work",
    good: true,
    icon: <Heart className="w-8 h-8 text-yellow-600" />,
    explanation:
      "Teachers might pat your back to congratulate you, which is okay.",
  },
  {
    id: 10,
    text: "Someone asking to see or touch your private parts",
    good: false,
    icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
    explanation: "No one should ask to see or touch your private parts.",
  },
];

// Background elements for decoration
const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cloud shapes */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${30 + Math.random() * 60}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 40}%`,
            filter: "blur(4px)",
            transform: "scale(1.5, 1)",
          }}
        />
      ))}

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 4}s infinite alternate`,
          }}
        >
          <Star
            size={Math.random() * 16 + 10}
            className="text-yellow-300 opacity-70"
            fill="#FBBF24"
          />
        </div>
      ))}
    </div>
  );
};

const Game4 = () => {
  const [bubbles, setBubbles] = useState([]);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [totalBubbles, setTotalBubbles] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showLessons, setShowLessons] = useState(false);
  const [floatingText, setFloatingText] = useState(null);
  const [streak, setStreak] = useState(0);
  const gameAreaRef = useRef(null);

  // Start spawning bubbles when game starts
  useEffect(() => {
    if (!isPlaying) return;

    if (totalBubbles >= 15) {
      setGameOver(true);
      return;
    }

    const interval = setInterval(() => {
      if (bubbles.length >= 4) return; // Limit number of bubbles on screen

      const newScenario =
        touchScenarios[Math.floor(Math.random() * touchScenarios.length)];

      // Generate random colors for bubbles
      const colors = [
        "from-pink-400 to-purple-500",
        "from-blue-400 to-cyan-500",
        "from-green-400 to-emerald-500",
        "from-yellow-400 to-amber-500",
        "from-indigo-400 to-violet-500",
        "from-red-400 to-rose-500",
      ];

      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newBubble = {
        id: Date.now(),
        ...newScenario,
        x: Math.random() * 70 + 15, // Keep bubbles away from edges
        y: -10, // Start below the screen
        popped: false,
        color: randomColor,
        size: Math.random() * 20 + 120, // Random size between 120-140px
        speed: 0.3 + Math.random() * 0.4, // Random speed
      };

      setBubbles((prev) => [...prev, newBubble]);
      setTotalBubbles((prev) => prev + 1);
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying, totalBubbles, bubbles.length]);

  // Animate bubbles floating up
  useEffect(() => {
    if (!isPlaying) return;

    const animation = setInterval(() => {
      setBubbles(
        (prev) =>
          prev
            .map((b) => (b.popped ? b : { ...b, y: b.y + b.speed }))
            .filter((b) => b.y < 110 && !b.popped) // Remove bubbles that go off screen or are popped
      );
    }, 50);

    return () => clearInterval(animation);
  }, [isPlaying]);

  // Function to show floating score text
  const showFloatingText = (text, x, y, isPositive) => {
    setFloatingText({
      text,
      x,
      y,
      isPositive,
      id: Date.now(),
    });

    // Remove the floating text after animation
    setTimeout(() => {
      setFloatingText(null);
    }, 1000);
  };

  const handleBubbleClick = (bubble, event) => {
    // Play sound effect based on correct/incorrect
    const correctSound = new Audio("/api/placeholder/400/320");
    const incorrectSound = new Audio("/api/placeholder/400/320");

    // Get click position for floating text
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    // Store the interaction result
    setResults((prev) => [
      ...prev,
      {
        ...bubble,
        timestamp: Date.now(),
      },
    ]);

    // Mark bubble as popped
    setBubbles((prev) =>
      prev.map((b) => (b.id === bubble.id ? { ...b, popped: true } : b))
    );

    // Update score based on whether response was correct
    if (bubble.good === false) {
      // Correctly popped a bad touch
      setScore((s) => s + 1);
      setStreak((prev) => prev + 1);
      showFloatingText(
        `+1 ${streak >= 2 ? `STREAK x${streak + 1}!` : ""}`,
        x,
        y,
        true
      );
      // correctSound.play();
    } else {
      // Incorrectly popped a good touch
      setScore((s) => Math.max(0, s - 1));
      setStreak(0);
      showFloatingText("-1", x, y, false);
      // incorrectSound.play();
    }

    // Remove the popped bubble after animation
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
    }, 300);
  };

  const startGame = () => {
    setIsPlaying(true);
    setShowTutorial(false);
  };

  const resetGame = () => {
    setBubbles([]);
    setResults([]);
    setScore(0);
    setTotalBubbles(0);
    setGameOver(false);
    setIsPlaying(true);
    setShowLessons(false);
    setStreak(0);
  };

  const viewLessons = () => {
    setShowLessons(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 overflow-hidden">
      <BackgroundElements />

      {/* Header */}
      <div className="flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-sm p-4 shadow-lg z-10 rounded-b-xl border-b-4 border-purple-300">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Touch Safety Bubbles
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-md">
            <span className="text-lg font-bold">
              Score: {score}/{totalBubbles}
            </span>
          </div>
          {isPlaying && !gameOver && (
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={() => setGameOver(true)}
              style={{
                borderRadius: "999px",
                fontWeight: "bold",
                backgroundColor: "#9333EA",
              }}
            >
              End Game
            </Button>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div ref={gameAreaRef} className="relative flex-1 overflow-hidden z-10">
        {/* Bubbles - All bubbles look different and fun */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onClick={(e) => handleBubbleClick(bubble, e)}
            className={`absolute flex flex-col items-center justify-center text-center p-2
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-b ${bubble.color} text-white
              ${
                bubble.popped
                  ? "opacity-0 scale-0 rotate-180"
                  : "opacity-95 hover:scale-110 shadow-lg"
              }
              animate-float`}
            style={{
              left: `${bubble.x}%`,
              bottom: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              transform: bubble.popped
                ? "scale(0) rotate(180deg)"
                : `scale(1) rotate(${Math.sin(bubble.id) * 5}deg)`,
            }}
          >
            <div className="text-sm font-bold px-2">{bubble.text}</div>
          </div>
        ))}

        {/* Floating score text */}
        {floatingText && (
          <div
            className={`absolute text-2xl font-extrabold animate-float-up ${
              floatingText.isPositive ? "text-green-500" : "text-red-500"
            }`}
            style={{
              left: `${floatingText.x}px`,
              top: `${floatingText.y - 20}px`,
              transform: "translate(-50%, -50%)",
              textShadow: "0px 0px 8px rgba(255,255,255,0.8)",
            }}
          >
            {floatingText.text}
            {floatingText.isPositive && streak >= 3 && (
              <Zap className="inline-block ml-1 text-yellow-400" size={24} />
            )}
          </div>
        )}

        {/* Streak indicator */}
        {streak >= 2 && isPlaying && !gameOver && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            <Zap className="inline-block mr-1" size={20} />
            <span className="font-bold">Streak: {streak}</span>
          </div>
        )}

        {/* Tutorial Screen */}
        {showTutorial && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 z-50">
            <div className="max-w-md bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 text-center">
                Touch Safety Bubbles
              </h2>
              <div className="flex justify-center mb-6">
                <Shield className="w-16 h-16 text-indigo-600" />
              </div>
              <p className="text-xl font-medium text-gray-700 mb-6 text-center">
                Pop the bubbles and learn about touch safety!
              </p>

              <div className="bg-purple-100 rounded-xl p-4 mb-6">
                <p className="text-lg font-medium text-purple-800 mb-2">
                  ✨ How to play:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-purple-700">
                  <li>
                    <span className="font-semibold">Pop</span> bubbles with{" "}
                    <span className="text-red-500 font-bold">
                      unsafe touches
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">Leave</span> bubbles with{" "}
                    <span className="text-green-500 font-bold">
                      safe touches
                    </span>
                  </li>
                  <li>
                    Build your <span className="font-semibold">streak</span> for
                    bonus points!
                  </li>
                </ul>
              </div>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={startGame}
                style={{
                  borderRadius: "999px",
                  fontWeight: "bold",
                  padding: "16px 32px",
                  fontSize: "1.25rem",
                  background: "linear-gradient(to right, #9333EA, #EC4899)",
                  textTransform: "none",
                }}
                endIcon={<ChevronRight />}
              >
                Start Playing!
              </Button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && !showLessons && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900 bg-opacity-90 p-6 z-50">
            <div className="max-w-md bg-white rounded-3xl p-8 shadow-2xl">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2 text-center">
                Game Complete!
              </h1>
              <div className="flex justify-center my-6">
                <div className="relative">
                  <Award className="w-24 h-24 text-yellow-500" />
                  {score >= totalBubbles * 0.8 && (
                    <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-30">
                      <Award className="w-24 h-24 text-yellow-500" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold mb-2 text-center">
                Your Score:{" "}
                <span
                  className={`${
                    score >= totalBubbles * 0.6
                      ? "text-green-600"
                      : "text-purple-600"
                  }`}
                >
                  {score} / {totalBubbles}
                </span>
              </p>

              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 my-6">
                <p className="text-lg font-medium text-center">
                  {score >= totalBubbles * 0.8
                    ? "Amazing! You're a safety superhero! 🌟"
                    : score >= totalBubbles * 0.5
                    ? "Good job! You're learning to stay safe! 👍"
                    : "Keep practicing! You'll be a safety expert soon! 💪"}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={viewLessons}
                  style={{
                    borderRadius: "999px",
                    fontWeight: "bold",
                    padding: "12px 32px",
                    background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
                    textTransform: "none",
                  }}
                  startIcon={<Info />}
                >
                  Safety Tips
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={resetGame}
                  style={{
                    borderRadius: "999px",
                    fontWeight: "bold",
                    padding: "12px 32px",
                    background: "linear-gradient(to right, #10B981, #34D399)",
                    textTransform: "none",
                  }}
                >
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Lessons Screen - Only shown after game */}
        {showLessons && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900 bg-opacity-90 p-6 z-50 overflow-auto">
            <div className="max-w-2xl bg-white rounded-3xl p-8 shadow-2xl my-8">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 text-center">
                Touch Safety Guide
              </h1>

              <div className="mb-8">
                <h3 className="font-bold text-xl text-green-700 mb-4 flex items-center">
                  <Shield className="mr-2 h-6 w-6" /> Safe Touches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {touchScenarios
                    .filter((s) => s.good)
                    .map((scenario) => (
                      <div
                        key={scenario.id}
                        className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-xl flex items-start shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="mr-3 mt-1">{scenario.icon}</div>
                        <div className="text-left">
                          <p className="font-bold text-emerald-800 mb-1">
                            {scenario.text}
                          </p>
                          <p className="text-sm text-emerald-700">
                            {scenario.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-xl text-red-700 mb-4 flex items-center">
                  <AlertTriangle className="mr-2 h-6 w-6" /> Unsafe Touches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {touchScenarios
                    .filter((s) => !s.good)
                    .map((scenario) => (
                      <div
                        key={scenario.id}
                        className="bg-gradient-to-r from-red-50 to-pink-100 p-4 rounded-xl flex items-start shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="mr-3 mt-1">{scenario.icon}</div>
                        <div className="text-left">
                          <p className="font-bold text-red-800 mb-1">
                            {scenario.text}
                          </p>
                          <p className="text-sm text-red-700">
                            {scenario.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl mb-8 shadow-md">
                <h3 className="font-bold text-xl text-blue-700 mb-2 flex items-center">
                  <Star className="mr-2 h-6 w-6 text-blue-500" fill="#3B82F6" />{" "}
                  Remember!
                </h3>
                <p className="text-blue-800 font-medium">
                  If anyone ever touches you in a way that makes you feel
                  uncomfortable, always tell a trusted adult right away. Your
                  body belongs to you, and you have the right to say "no" to
                  unwanted touches.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={resetGame}
                  style={{
                    borderRadius: "999px",
                    fontWeight: "bold",
                    padding: "12px 32px",
                    background: "linear-gradient(to right, #10B981, #34D399)",
                    textTransform: "none",
                    fontSize: "1.125rem",
                  }}
                >
                  Play Again!
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50px);
          }
        }
        .animate-float-up {
          animation: float-up 1s forwards;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(-2deg);
          }
          75% {
            transform: translateY(5px) rotate(2deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes twinkle {
          0% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          100% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default Game4;
