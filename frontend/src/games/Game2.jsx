import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import calculateAge from "../lib/calculateAge";
import getAgeGroup from "../lib/ageGroup";
import {
  Award,
  User,
  Heart,
  Shield,
  Globe,
  ChevronRight,
  Settings,
  Home,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Star,
  ChevronLeft,
  ArrowRight,
  Gift,
  Sparkles,
  VolumeX,
} from "lucide-react";

// Material UI imports
const MUI = {
  Card: ({ children, elevation, className }) => (
    <div
      className={`shadow-md rounded-lg overflow-hidden ${className || ""}`}
      style={{
        boxShadow: `0 ${elevation || 1}px ${
          elevation * 2 || 2
        }px rgba(0,0,0,0.1)`,
      }}
    >
      {children}
    </div>
  ),
  Button: ({
    children,
    variant,
    color,
    onClick,
    disabled,
    className,
    startIcon,
    endIcon,
    fullWidth,
  }) => {
    let buttonClasses =
      "py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ";

    if (variant === "contained") {
      if (color === "primary")
        buttonClasses += "bg-purple-600 text-white hover:bg-purple-700 ";
      else if (color === "secondary")
        buttonClasses += "bg-teal-600 text-white hover:bg-teal-700 ";
      else if (color === "success")
        buttonClasses += "bg-green-600 text-white hover:bg-green-700 ";
      else if (color === "error")
        buttonClasses += "bg-red-600 text-white hover:bg-red-700 ";
      else if (color === "warning")
        buttonClasses += "bg-amber-500 text-white hover:bg-amber-600 ";
      else if (color === "info")
        buttonClasses += "bg-blue-500 text-white hover:bg-blue-600 ";
      else buttonClasses += "bg-gray-600 text-white hover:bg-gray-700 ";
    } else if (variant === "outlined") {
      if (color === "primary")
        buttonClasses +=
          "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 ";
      else if (color === "secondary")
        buttonClasses +=
          "border-2 border-teal-600 text-teal-600 hover:bg-teal-50 ";
      else if (color === "success")
        buttonClasses +=
          "border-2 border-green-600 text-green-600 hover:bg-green-50 ";
      else if (color === "error")
        buttonClasses +=
          "border-2 border-red-600 text-red-600 hover:bg-red-50 ";
      else if (color === "warning")
        buttonClasses +=
          "border-2 border-amber-500 text-amber-500 hover:bg-amber-50 ";
      else if (color === "info")
        buttonClasses +=
          "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 ";
      else
        buttonClasses +=
          "border-2 border-gray-600 text-gray-600 hover:bg-gray-50 ";
    } else if (variant === "text") {
      if (color === "primary")
        buttonClasses += "text-purple-600 hover:bg-purple-50 ";
      else if (color === "secondary")
        buttonClasses += "text-teal-600 hover:bg-teal-50 ";
      else if (color === "success")
        buttonClasses += "text-green-600 hover:bg-green-50 ";
      else if (color === "error")
        buttonClasses += "text-red-600 hover:bg-red-50 ";
      else if (color === "warning")
        buttonClasses += "text-amber-500 hover:bg-amber-50 ";
      else if (color === "info")
        buttonClasses += "text-blue-500 hover:bg-blue-50 ";
      else buttonClasses += "text-gray-600 hover:bg-gray-50 ";
    }

    if (disabled) buttonClasses += "opacity-50 cursor-not-allowed ";
    if (fullWidth) buttonClasses += "w-full ";
    if (className) buttonClasses += className;

    return (
      <button onClick={onClick} disabled={disabled} className={buttonClasses}>
        {startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </button>
    );
  },
  IconButton: ({ children, color, onClick, disabled, className, size }) => {
    let buttonClasses =
      "rounded-full flex items-center justify-center transition-all duration-200 ";

    if (size === "small") buttonClasses += "p-1 ";
    else if (size === "large") buttonClasses += "p-3 ";
    else buttonClasses += "p-2 ";

    if (color === "primary")
      buttonClasses += "text-purple-600 hover:bg-purple-100 ";
    else if (color === "secondary")
      buttonClasses += "text-teal-600 hover:bg-teal-100 ";
    else if (color === "success")
      buttonClasses += "text-green-600 hover:bg-green-100 ";
    else if (color === "error")
      buttonClasses += "text-red-600 hover:bg-red-100 ";
    else if (color === "warning")
      buttonClasses += "text-amber-500 hover:bg-amber-100 ";
    else if (color === "info")
      buttonClasses += "text-blue-500 hover:bg-blue-100 ";
    else buttonClasses += "text-gray-600 hover:bg-gray-100 ";

    if (disabled) buttonClasses += "opacity-50 cursor-not-allowed ";
    if (className) buttonClasses += className;

    return (
      <button onClick={onClick} disabled={disabled} className={buttonClasses}>
        {children}
      </button>
    );
  },
  Avatar: ({ src, alt, className, children }) => (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${
        className || ""
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        children
      )}
    </div>
  ),
  Paper: ({ children, elevation, className }) => (
    <div
      className={`bg-white rounded-lg ${className || ""}`}
      style={{
        boxShadow: `0 ${elevation || 1}px ${
          elevation * 2 || 2
        }px rgba(0,0,0,0.1)`,
      }}
    >
      {children}
    </div>
  ),
  Typography: ({ variant, component, color, className, children }) => {
    let typographyClasses = "";

    if (variant === "h1") typographyClasses = "text-4xl font-bold ";
    else if (variant === "h2") typographyClasses = "text-3xl font-bold ";
    else if (variant === "h3") typographyClasses = "text-2xl font-bold ";
    else if (variant === "h4") typographyClasses = "text-xl font-bold ";
    else if (variant === "h5") typographyClasses = "text-lg font-bold ";
    else if (variant === "h6") typographyClasses = "text-base font-bold ";
    else if (variant === "subtitle1")
      typographyClasses = "text-base font-medium ";
    else if (variant === "subtitle2")
      typographyClasses = "text-sm font-medium ";
    else if (variant === "body1") typographyClasses = "text-base ";
    else if (variant === "body2") typographyClasses = "text-sm ";
    else if (variant === "caption") typographyClasses = "text-xs ";
    else if (variant === "button")
      typographyClasses = "text-sm font-medium uppercase ";
    else if (variant === "overline")
      typographyClasses = "text-xs uppercase tracking-wider ";

    if (color === "primary") typographyClasses += "text-purple-600 ";
    else if (color === "secondary") typographyClasses += "text-teal-600 ";
    else if (color === "textPrimary") typographyClasses += "text-gray-900 ";
    else if (color === "textSecondary") typographyClasses += "text-gray-600 ";
    else if (color === "error") typographyClasses += "text-red-600 ";
    else if (color === "warning") typographyClasses += "text-amber-500 ";
    else if (color === "info") typographyClasses += "text-blue-500 ";
    else if (color === "success") typographyClasses += "text-green-600 ";

    if (className) typographyClasses += className;

    const Component = component || "p";

    return <Component className={typographyClasses}>{children}</Component>;
  },
  LinearProgress: ({ variant, color, value, className }) => {
    let progressClasses = "h-2 rounded-full overflow-hidden ";
    let barColor = "";

    if (color === "primary") barColor = "bg-purple-600";
    else if (color === "secondary") barColor = "bg-teal-600";
    else if (color === "error") barColor = "bg-red-600";
    else if (color === "warning") barColor = "bg-amber-500";
    else if (color === "info") barColor = "bg-blue-500";
    else if (color === "success") barColor = "bg-green-600";
    else barColor = "bg-purple-600";

    if (className) progressClasses += className;

    return (
      <div className={`${progressClasses} bg-gray-200`}>
        <div
          className={`${barColor} h-full transition-all duration-300 ease-in-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    );
  },
  Chip: ({ label, color, variant, onDelete, icon, className }) => {
    let chipClasses = "px-3 py-1 rounded-full text-sm flex items-center ";

    if (variant === "filled") {
      if (color === "primary") chipClasses += "bg-purple-100 text-purple-800 ";
      else if (color === "secondary")
        chipClasses += "bg-teal-100 text-teal-800 ";
      else if (color === "error") chipClasses += "bg-red-100 text-red-800 ";
      else if (color === "warning")
        chipClasses += "bg-amber-100 text-amber-800 ";
      else if (color === "info") chipClasses += "bg-blue-100 text-blue-800 ";
      else if (color === "success")
        chipClasses += "bg-green-100 text-green-800 ";
      else chipClasses += "bg-gray-100 text-gray-800 ";
    } else {
      if (color === "primary")
        chipClasses += "border border-purple-600 text-purple-600 ";
      else if (color === "secondary")
        chipClasses += "border border-teal-600 text-teal-600 ";
      else if (color === "error")
        chipClasses += "border border-red-600 text-red-600 ";
      else if (color === "warning")
        chipClasses += "border border-amber-500 text-amber-500 ";
      else if (color === "info")
        chipClasses += "border border-blue-500 text-blue-500 ";
      else if (color === "success")
        chipClasses += "border border-green-600 text-green-600 ";
      else chipClasses += "border border-gray-600 text-gray-600 ";
    }

    if (className) chipClasses += className;

    return (
      <div className={chipClasses}>
        {icon && <span className="mr-1">{icon}</span>}
        {label}
        {onDelete && (
          <button onClick={onDelete} className="ml-1 hover:text-opacity-70">
            <X size={14} />
          </button>
        )}
      </div>
    );
  },
  Badge: ({ badgeContent, color, children, className }) => {
    let badgeClasses =
      "absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 rounded-full text-xs text-white ";

    if (color === "primary") badgeClasses += "bg-purple-600 ";
    else if (color === "secondary") badgeClasses += "bg-teal-600 ";
    else if (color === "error") badgeClasses += "bg-red-600 ";
    else if (color === "warning") badgeClasses += "bg-amber-500 ";
    else if (color === "info") badgeClasses += "bg-blue-500 ";
    else if (color === "success") badgeClasses += "bg-green-600 ";
    else badgeClasses += "bg-gray-600 ";

    if (className) badgeClasses += className;

    return (
      <div className="relative inline-flex">
        {children}
        {badgeContent && <div className={badgeClasses}>{badgeContent}</div>}
      </div>
    );
  },
};

// Enhanced animation styles
const animationStyles = `
  .flip-card-inner {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .perspective-1000 {
    perspective: 1000px;
  }
  .celebration {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .confetti {
    position: absolute;
    width: 12px;
    height: 12px;
    animation: fall 5s ease-in-out forwards;
    top: -20px;
  }
  
  /* New animations */
  .star-confetti {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    animation: fall-spin 6s ease-in-out forwards;
  }
  
  .heart-confetti {
    background-color: transparent !important;
    width: 30px;
    height: 30px;
    position: relative;
    transform: rotate(-45deg) scale(0.5);
    animation: fall-heart 6s ease-in-out forwards;
  }
  
  .heart-confetti:before,
  .heart-confetti:after {
    position: absolute;
    content: "";
    left: 15px;
    top: 0;
    width: 15px;
    height: 25px;
    background: #ff5b79;
    border-radius: 15px 15px 0 0;
  }
  
  .heart-confetti:after {
    left: 0;
    transform: rotate(90deg);
    transform-origin: 15px 15px;
  }
  
  .bounce-anim {
    animation: bounce 2s infinite;
  }
  
  .pulse-anim {
    animation: pulse 2s infinite;
  }
  
  .float-anim {
    animation: float 3s infinite;
  }
  
  .wiggle-anim {
    animation: wiggle 2s infinite;
  }
  
  @keyframes fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  @keyframes fall-spin {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(1440deg);
      opacity: 0;
    }
  }
  
  @keyframes fall-heart {
    0% {
      transform: translateY(0) rotate(-45deg) scale(0.5);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(45deg) scale(0.5);
      opacity: 0;
    }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(-2deg); }
    75% { transform: translateY(5px) rotate(2deg); }
  }
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
  
  /* Improved bubble backgrounds */
  .bubble-bg {
    position: relative;
    overflow: hidden;
  }
  
  .bubble {
    position: absolute;
    border-radius: 50%;
    opacity: 0.2;
  }
  
  .bubble-1 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    animation: float 8s infinite ease-in-out;
    top: -30px;
    left: -30px;
  }
  
  .bubble-2 {
    width: 80px;
    height: 80px;
    background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    animation: float 6s infinite ease-in-out reverse;
    bottom: 20px;
    right: 30px;
  }
  
  .bubble-3 {
    width: 60px;
    height: 60px;
    background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    animation: float 10s infinite ease-in-out;
    top: 40%;
    left: 30%;
  }
  
  /* Gradient text effect */
  .gradient-text {
    background: linear-gradient(45deg, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }
`;

// Enhanced Celebration Component
const Celebration = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="celebration">
        {/* Regular confetti */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`confetti-${i}`}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: [
                "#FF5252",
                "#FF4081",
                "#E040FB",
                "#7C4DFF",
                "#536DFE",
                "#448AFF",
                "#40C4FF",
                "#18FFFF",
                "#64FFDA",
                "#69F0AE",
                "#B2FF59",
                "#EEFF41",
                "#FFFF00",
                "#FFD740",
                "#FFAB40",
                "#FF6E40",
              ][Math.floor(Math.random() * 16)],
            }}
          />
        ))}

        {/* Star-shaped confetti */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="confetti star-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: [
                "#FFD700",
                "#FFA500",
                "#FF4500",
                "#9C27B0",
                "#3F51B5",
                "#2196F3",
              ][Math.floor(Math.random() * 6)],
            }}
          />
        ))}

        {/* Heart-shaped confetti */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`heart-${i}`}
            className="heart-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Celebration message */}
        <div
          className="bg-white px-10 py-8 rounded-3xl shadow-xl text-center z-10 pulse-anim"
          style={{ animation: "pulse 1.5s infinite" }}
        >
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Amazing Job!
          </h2>
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-20 blur-lg"></div>
            <Award className="text-yellow-500 w-20 h-20 mx-auto relative z-10 wiggle-anim" />
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="text-yellow-400 w-8 h-8"
                style={{ animation: `pulse 1.5s infinite ${star * 0.2}s` }}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced FlashCard Component
const FlashCard = ({ card, onFlip, onAnswer, showingAnswer }) => {
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleFlip = () => {
    if (animating) return;
    setAnimating(true);
    setFlipped(!flipped);
    setTimeout(() => {
      onFlip && onFlip(!flipped);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="relative w-full h-[400px]">
      <div 
        className="absolute inset-0 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-300 ${
            flipped ? 'rotate-y-180' : ''
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center'
          }}
        >
          {/* Front of card */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 flex flex-col justify-center items-center"
            style={{ 
              background: "linear-gradient(135deg, #c084fc, #818cf8)",
              backfaceVisibility: "hidden"
            }}
          >
            <div className="py-3 px-5 mb-4 rounded-full bg-white/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white drop-shadow-sm">
                {card.question}
              </h3>
            </div>

            {card.image && (
              <div className="my-4 relative">
                <div className="absolute inset-0 bg-white/50 rounded-full blur-lg transform scale-125"></div>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={card.image}
                  alt={card.question}
                  className={`w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover relative z-10 transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-flashcard.png";
                    setImageLoading(false);
                  }}
                />
              </div>
            )}

            <div className="mt-4 py-2 px-4 rounded-full bg-white/20 backdrop-blur-sm text-white pulse-anim">
              Tap to see answer!
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 flex flex-col justify-center items-center"
            style={{ 
              background: "linear-gradient(135deg, #fde68a, #fbbf24)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="py-3 px-5 mb-4 rounded-full bg-white/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white drop-shadow-sm">
                Answer
              </h3>
            </div>

            <div className="py-4 px-6 rounded-xl bg-white/40 backdrop-blur-sm mb-4 max-h-32 overflow-auto">
              <p className="text-lg text-gray-800 font-medium">{card.answer}</p>
            </div>

            {showingAnswer && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnswer("correct");
                  }}
                  className="py-3 px-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold shadow-lg border-b-4 border-green-600 transform hover:scale-105 active:scale-95 transition-all duration-150 flex items-center"
                >
                  <ThumbsUp size={20} className="mr-2" />I got it!
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnswer("incorrect");
                  }}
                  className="py-3 px-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold shadow-lg border-b-4 border-amber-600 transform hover:scale-105 active:scale-95 transition-all duration-150 flex items-center"
                >
                  <ThumbsDown size={20} className="mr-2" />
                  Still learning
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Game Component
const Game2 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Existing state variables
  const [userAge, setUserAge] = useState("");
  const [ageEntered, setAgeEntered] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showParentMode, setShowParentMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [gameMode, setGameMode] = useState("quiz"); // quiz, flashcards, story
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showingFlashcardAnswer, setShowingFlashcardAnswer] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [characterMood, setCharacterMood] = useState("happy"); // happy, thinking, excited, concerned
  const [flashcardStats, setFlashcardStats] = useState({
    mastered: 0,
    learning: 0,
    total: 0,
  });
  const [flashcardStreak, setFlashcardStreak] = useState(0);
  const [showingAvatarSelector, setShowingAvatarSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(1);

  // Virtual Points/Rewards System
  const [points, setPoints] = useState(0);
  const [stars, setStars] = useState(0);

  const avatars = [
    { id: 1, name: "Explorer", image: "/api/placeholder/100/100" },
    { id: 2, name: "Scientist", image: "/api/placeholder/100/100" },
    { id: 3, name: "Superhero", image: "/api/placeholder/100/100" },
    { id: 4, name: "Detective", image: "/api/placeholder/100/100" },
  ];

  const characterEmotions = {
    happy: "/api/placeholder/150/150",
    thinking: "/api/placeholder/150/150",
    excited: "/api/placeholder/150/150",
    concerned: "/api/placeholder/150/150",
  };

  const topics = [
    { id: 1, icon: <User className="h-6 w-6" />, name: "Body Parts" },
    { id: 2, icon: <Heart className="h-6 w-6" />, name: "Safe Touch" },
    { id: 3, icon: <Award className="h-6 w-6" />, name: "Consent" },
    { id: 4, icon: <Shield className="h-6 w-6" />, name: "Emotions" },
    { id: 5, icon: <Globe className="h-6 w-6" />, name: "Online Safety" },
  ];

  const levels = [
    {
      id: 1,
      title: "My Body Rules",
      challenge: "Safe Touch Quiz",
      description: "Learn about safe and unsafe touches",
      badge: "Body Explorer Badge",
      parentPrompt: "Ask your child: Which parts of your body are private?",
      color: "purple",
      questions: [
        {
          question: "A doctor checking your ear when you're sick is...",
          options: ["Safe touch", "Unsafe touch"],
          correctAnswer: "Safe touch",
          feedback: {
            correct:
              "That's right! A doctor checking your ear when you're sick is a safe touch because they are helping you get better.",
            incorrect:
              "Actually, a doctor checking your ear when you're sick is a safe touch because they are helping you get better.",
          },
          image: "/doctor.png",
        },
        {
          question:
            "Someone touching your private parts without permission is...",
          options: ["Safe touch", "Unsafe touch"],
          correctAnswer: "Unsafe touch",
          feedback: {
            correct:
              "Correct! No one should touch your private parts without permission. This is an unsafe touch.",
            incorrect:
              "This is actually an unsafe touch. No one should touch your private parts without permission.",
          },
          image: "/stop touching.png",
        },
        {
          question: "A hug from grandma that makes you happy is...",
          options: ["Safe touch", "Unsafe touch"],
          correctAnswer: "Safe touch",
          feedback: {
            correct:
              "That's right! A hug from grandma that makes you happy is a safe touch.",
            incorrect:
              "A hug from grandma that makes you happy is actually a safe touch because you enjoy it.",
          },
          image: "/grandma.png",
        },
      ],
      flashcards: [
        {
          question: "What is puberty?",
          answer:
            "Puberty is when your body changes as you grow from a child into a teenager. It happens to everyone!",
          image: "/puberty.png",
        },
        {
          question: "Why do families look different from each other?",
          answer:
            "Families come in many different types. Some have a mom and dad, some have one parent, some have two moms or two dads, and some include grandparents or other relatives. All types of families are special!",
          image: "/family.png",
        },
        {
          question: "What changes might happen during puberty?",
          answer:
            "Your body gets taller, your voice might change, you might grow hair in new places, and you might have more feelings and emotions.",
          image: "/changes.png",
        },
        {
          question: "Who can you talk to about body changes?",
          answer:
            "You can talk to parents, caregivers, doctors, school nurses, or counselors about any changes or questions about your body.",
          image: "/talk.png",
        },
      ],
      story: {
        title: "Alex Learns About Body Rules",
        content:
          "Alex was learning about body rules at school. The teacher explained that some body parts are private. Alex learned to say 'no' if anyone tries to touch private parts. Alex felt brave knowing how to keep safe!",
      },
    },
    {
      id: 2,
      title: "Growing Up Smart",
      challenge: "Family & Body Quiz",
      description: "Learn about family relationships and body changes",
      badge: "Respect Champion Badge",
      parentPrompt: "Ask your child: What changes happen during puberty?",
      color: "blue",
      questions: [
        {
          question: "Who should know about changes in your body as you grow?",
          options: [
            "Only you",
            "A trusted adult",
            "Anyone who asks",
            "Strangers online",
          ],
          correctAnswer: "A trusted adult",
          feedback: {
            correct:
              "Good job! It's important to talk to a trusted adult about changes in your body.",
            incorrect:
              "Actually, it's best to talk to a trusted adult about changes in your body.",
          },
          image: "/changes.png",
        },
        {
          question: "Which of these is NOT a normal part of growing up?",
          options: [
            "Getting taller",
            "Voice changes",
            "Feeling uncomfortable in your body sometimes",
            "Being forced to share private information",
          ],
          correctAnswer: "Being forced to share private information",
          feedback: {
            correct:
              "That's right! Being forced to share private information is never okay.",
            incorrect:
              "The correct answer is 'Being forced to share private information.' No one should ever force you to share private information.",
          },
          image: "/growing.png",
        },
        {
          question:
            "Different families can look different from each other. This is...",
          options: ["Wrong", "Normal", "Something to hide", "Something to fix"],
          correctAnswer: "Normal",
          feedback: {
            correct:
              "Exactly! All families are different and that's perfectly normal.",
            incorrect:
              "Different families are normal! Families come in all different shapes and sizes.",
          },
          image: "/family.png",
        },
      ],
      flashcards: [
        {
          question: "What is puberty?",
          answer:
            "Puberty is when your body changes as you grow from a child into a teenager. It happens to everyone!",
          image: "/images/flashcards/puberty.png",
        },
        {
          question: "Why do families look different from each other?",
          answer:
            "Families come in many different types. Some have a mom and dad, some have one parent, some have two moms or two dads, and some include grandparents or other relatives. All types of families are special!",
          image: "/images/flashcards/family.png",
        },
        {
          question: "What changes might happen during puberty?",
          answer:
            "Your body gets taller, your voice might change, you might grow hair in new places, and you might have more feelings and emotions.",
          image: "/images/flashcards/bodychanges.png",
        },
        {
          question: "Who can you talk to about body changes?",
          answer:
            "You can talk to parents, caregivers, doctors, school nurses, or counselors about any changes or questions about your body.",
          image: "/images/flashcards/changes.png",
        },
      ],
      story: {
        title: "Jamie's Family Album",
        content:
          "Jamie was making a family album for school. Jamie had a mom and stepdad. His friend Zoe had two moms. Another friend had grandparents raising him. The teacher said, 'All families are special in their own way.' Jamie felt proud of his unique family!",
      },
    },
    {
      id: 3,
      title: "Think & Thrive",
      challenge: "Consent Quiz",
      description: "Learn about permission and respecting boundaries",
      badge: "Boundary Boss Badge",
      parentPrompt:
        "Ask your child: Why is consent important in digital spaces?",
      color: "green",
      questions: [
        {
          question:
            "Your friend wants to hug you but you don't want a hug right now. You should...",
          options: [
            "Let them hug you anyway",
            "Say 'No thank you' politely",
            "Run away crying",
            "Push them",
          ],
          correctAnswer: "Say 'No thank you' politely",
          feedback: {
            correct:
              "That's right! It's okay to politely say no when you don't want physical contact.",
            incorrect:
              "The best response is to say 'No thank you' politely. It's okay to set boundaries about your body.",
          },
          image: "/hugging.png",
        },
        {
          question:
            "If someone asks to take your picture online, you should always...",
          options: [
            "Say yes to be polite",
            "Check with a trusted adult first",
            "Say yes if they're nice",
            "Share it immediately",
          ],
          correctAnswer: "Check with a trusted adult first",
          feedback: {
            correct:
              "Good job! Always check with a trusted adult before sharing photos online.",
            incorrect:
              "You should always check with a trusted adult first before allowing anyone to take or share your picture online.",
          },
          image: "/onlineimage.png",
        },
        {
          question: "If someone says 'Stop tickling me', you should...",
          options: [
            "Keep tickling because it's fun",
            "Stop right away",
            "Tell them they're no fun",
            "Tickle them harder",
          ],
          correctAnswer: "Stop right away",
          feedback: {
            correct:
              "Exactly! When someone says stop, you should always stop right away.",
            incorrect:
              "When someone says stop, you should always stop right away. This shows respect for their boundaries.",
          },
          image: "/stop.png",
        },
      ],
      flashcards: [
        {
          question: "What is consent?",
          answer:
            "Consent means giving permission. Before touching someone or sharing their things, you should ask for their permission and respect their answer.",
          image: "/consent.png",
        },
        {
          question: "What does 'respecting boundaries' mean?",
          answer:
            "It means understanding and following the rules people set about their bodies, feelings, and personal space. Everyone's boundaries are important.",
          image: "/respect.png",
        },
        {
          question: "How can you show consent online?",
          answer:
            "Always ask before posting photos of friends, never share passwords, and don't pressure others to share personal information.",
          image: "/consent.png",
        },
        {
          question: "What words can you use to set a boundary?",
          answer:
            "You can say: 'No thank you,' 'I don't like that,' 'Please stop,' or 'I need some space right now.'",
          image: "/boundaries.png",
        },
      ],
      story: {
        title: "Taylor Learns About Boundaries",
        content:
          "Taylor loved to hug friends. One day, their friend Sam said, 'I don't like hugs.' Taylor felt sad at first but teacher explained everyone has different boundaries. Taylor asked, 'Can we high-five instead?' Sam smiled and said 'Yes!' Taylor learned that asking for permission shows respect.",
      },
    },
  ];

  const currentLevelData = levels[currentLevel - 1];

  useEffect(() => {
    const checkAgeAuthorization = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("date_of_birth")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data?.date_of_birth) {
          const age = calculateAge(data.date_of_birth);
          const ageGroup = getAgeGroup(age);

          if (ageGroup !== "3-12") {
            navigate("/games");
            return;
          }

          // Auto set the age for the game
          setUserAge(age.toString());
          setAgeEntered(true);
          setAuthorized(true);
        } else {
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAgeAuthorization();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect in useEffect
  }

  const handleAgeSubmit = () => {
    const age = parseInt(userAge);
    if (isNaN(age) || age < 3 || age > 12) {
      alert("Please enter a valid age between 3 and 12");
      return;
    }
  }, [gameMode, currentLevel]);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setLevelCompleted(false);
    setCurrentFlashcard(0);
    setShowingFlashcardAnswer(false);

    // Add journey started points
    awardPoints(25, "Starting your journey!");
  };

  const handleAnswerSelect = (selectedOption) => {
    const currentQuestionData =
      levels[currentLevel - 1].questions[currentQuestion];
    const isCorrect = selectedOption === currentQuestionData.correctAnswer;
    setIsCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(score + 1);
      awardPoints(10, "Correct answer!");

      if (Math.random() > 0.7) {
        setCharacterMood("excited");
      } else {
        setCharacterMood("happy");
      }
    } else {
      setCharacterMood("concerned");
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < levels[currentLevel - 1].questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setLevelCompleted(true);
        const percentageCorrect =
          (score + (isCorrect ? 1 : 0)) /
          levels[currentLevel - 1].questions.length;

        if (percentageCorrect >= 0.7) {
          const newBadge = {
            name: levels[currentLevel - 1].badge,
            level: currentLevel,
            date: new Date().toLocaleDateString(),
          };

          setEarnedBadges([...earnedBadges, newBadge]);
          setCelebration(true);
          awardPoints(50, "Level completed!");

          // Award stars for level completion
          setStars(stars + 1);

          setTimeout(() => {
            setCelebration(false);
          }, 3000);
        }
      }
      setCharacterMood("happy");
    }, 2000);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      setCurrentQuestion(0);
      setScore(0);
      setLevelCompleted(false);
      awardPoints(15, "New level unlocked!");
    } else {
      // Game completed
      setGameMode("completed");
      awardPoints(100, "Adventure completed!");
    }
  };

  const handleFlashcardFlip = (isShowingAnswer) => {
    setShowingFlashcardAnswer(isShowingAnswer);
  };

  const handleFlashcardAnswer = (answer) => {
    const currentStats = { ...flashcardStats };

    if (answer === "correct") {
      setFlashcardStreak(flashcardStreak + 1);
      currentStats.mastered++;
      currentStats.learning--;
      awardPoints(5, "Flashcard mastered!");

      if (flashcardStreak % 5 === 0) {
        awardPoints(15, `${flashcardStreak} card streak!`);
      }

      setCharacterMood("excited");
    } else {
      setFlashcardStreak(0);
      setCharacterMood("thinking");
    }

    setFlashcardStats(currentStats);

    if (currentFlashcard < levels[currentLevel - 1].flashcards.length - 1) {
      setCurrentFlashcard(currentFlashcard + 1);
      setShowingFlashcardAnswer(false);
    } else {
      // Flashcard review completed
      if (currentStats.mastered >= currentStats.total * 0.7) {
        setCelebration(true);
        awardPoints(30, "Flashcards completed!");

        setTimeout(() => {
          setCelebration(false);
        }, 3000);
      }

      // Reset to first card
      setCurrentFlashcard(0);
      setShowingFlashcardAnswer(false);
    }
  };

  const handleGameModeSelect = (mode) => {
    setGameMode(mode);
    if (mode === "quiz") {
      setCurrentQuestion(0);
      setScore(0);
      setLevelCompleted(false);
    } else if (mode === "flashcards") {
      setCurrentFlashcard(0);
      setShowingFlashcardAnswer(false);
      setFlashcardStreak(0);
    }
  };

  const awardPoints = (amount, reason) => {
    setPoints(points + amount);

    // Flash notification would go here in a real implementation
    console.log(`+${amount} points: ${reason}`);

    // Award a star every 100 points
    if (Math.floor((points + amount) / 100) > Math.floor(points / 100)) {
      setStars(stars + 1);
      setCelebration(true);
      setTimeout(() => {
        setCelebration(false);
      }, 2000);
    }
  };

  const handleAvatarSelect = (id) => {
    setSelectedAvatar(id);
    setShowingAvatarSelector(false);
    awardPoints(10, "New avatar selected!");
  };

  const getProgressPercentage = () => {
    if (gameMode === "quiz") {
      return (
        (currentQuestion / levels[currentLevel - 1].questions.length) * 100
      );
    } else if (gameMode === "flashcards") {
      return (flashcardStats.mastered / flashcardStats.total) * 100;
    }
    return 0;
  };

  // CSS classes for animation
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 flex flex-col p-4">
      <style>{animationStyles}</style>
      <Celebration show={celebration} />

      {/* Header */}
      <header className="flex justify-between items-center mb-6 px-4 py-3 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center">
          <div
            onClick={() => setShowingAvatarSelector(true)}
            className="relative cursor-pointer transform hover:scale-110 transition-transform"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm opacity-70"></div>
            <div className="relative">
              <img
                src={avatars.find((a) => a.id === selectedAvatar).image}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-3 border-white"
              />
            </div>
          </div>

          <div className="ml-3">
            <h2 className="font-bold text-purple-700">Level {currentLevel}</h2>
            <div className="flex items-center">
              <div className="flex items-center mr-3 bg-yellow-100 px-2 py-1 rounded-full">
                <Star
                  size={14}
                  className="text-yellow-500 mr-1"
                  fill="currentColor"
                />
                <span className="text-yellow-700 font-bold">{stars}</span>
              </div>

              <div className="flex items-center bg-purple-100 px-2 py-1 rounded-full">
                <Gift size={14} className="text-purple-500 mr-1" />
                <span className="text-purple-700 font-bold">{points}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors">
            <Volume2 size={18} />
          </button>

          <button
            onClick={() => handleGameModeSelect("quiz")}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
          >
            <Home size={18} />
          </button>

          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Progress Bar - enhanced design */}
      <div className="h-4 bg-white rounded-full mb-6 p-1 shadow-inner overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-in-out relative overflow-hidden"
          style={{
            width: `${getProgressPercentage()}%`,
            background: "linear-gradient(to right, #8b5cf6, #d946ef)",
          }}
        >
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            <div className="w-20 h-20 bg-white/30 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1">
        {/* Level Info - enhanced design */}
        <div className="mb-6 rounded-2xl shadow-lg overflow-hidden">
          <div
            className="p-5 text-white"
            style={{
              background: `linear-gradient(to right, 
                ${
                  levels[currentLevel - 1].color === "purple"
                    ? "#8b5cf6, #d946ef"
                    : levels[currentLevel - 1].color === "blue"
                    ? "#3b82f6, #38bdf8"
                    : levels[currentLevel - 1].color === "green"
                    ? "#10b981, #4ade80"
                    : "#8b5cf6, #d946ef"
                })`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {levels[currentLevel - 1].title}
                </h2>
                <p className="text-white/80">
                  {levels[currentLevel - 1].description}
                </p>
                <div className="mt-2">
                  <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-medium">
                    {levels[currentLevel - 1].challenge}
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-sm"></div>
                <img
                  src={characterEmotions[characterMood]}
                  alt="Character"
                  className={`w-20 h-20 relative z-10 ${
                    characterMood === "excited"
                      ? "bounce-anim"
                      : characterMood === "thinking"
                      ? "pulse-anim"
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mode Tabs - enhanced design */}
        <div className="flex mb-6 bg-white rounded-2xl overflow-hidden shadow-lg">
          {["quiz", "flashcards", "story"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleGameModeSelect(mode)}
              className={`flex-1 py-4 text-center font-bold transition-all relative ${
                gameMode === mode
                  ? "text-purple-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="flex flex-col items-center">
                {mode === "quiz" && <Award size={20} className="mb-1" />}
                {mode === "flashcards" && <User size={20} className="mb-1" />}
                {mode === "story" && <Heart size={20} className="mb-1" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </div>

              {gameMode === mode && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Enhancement for quiz mode */}
        {gameMode === "quiz" && !levelCompleted && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-indigo-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-indigo-100 opacity-40 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-pink-100 opacity-30 -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <div className="mb-8 text-center">
                <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-3">
                  Question {currentQuestion + 1} of{" "}
                  {levels[currentLevel - 1].questions.length}
                </div>
                <h3 className="text-xl font-bold text-gray-800 px-6">
                  {levels[currentLevel - 1].questions[currentQuestion].question}
                </h3>
              </div>

              {/* Image with enhanced styling */}
              {levels[currentLevel - 1].questions[currentQuestion].image && (
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-2xl blur-sm opacity-70 transform scale-105"></div>
                    <img
                      src={
                        levels[currentLevel - 1].questions[currentQuestion]
                          .image
                      }
                      alt="Question"
                      className="w-40 h-40 object-cover rounded-2xl border-4 border-white shadow-md relative z-10"
                    />
                  </div>
                </div>
              )}

              {/* Options with enhanced styling */}
              <div className="space-y-4 mt-6">
                {levels[currentLevel - 1].questions[
                  currentQuestion
                ].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-xl font-bold text-left transition-all relative overflow-hidden ${
                      showFeedback &&
                      option ===
                        levels[currentLevel - 1].questions[currentQuestion]
                          .correctAnswer
                        ? "bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 text-green-800"
                        : showFeedback &&
                          option ===
                            levels[currentLevel - 1].questions[currentQuestion]
                              .selectedOption &&
                          option !==
                            levels[currentLevel - 1].questions[currentQuestion]
                              .correctAnswer
                        ? "bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-300 text-red-800"
                        : "bg-white hover:bg-indigo-50 border-2 border-indigo-100 text-gray-700 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                          showFeedback &&
                          option ===
                            levels[currentLevel - 1].questions[currentQuestion]
                              .correctAnswer
                            ? "bg-green-200 text-green-800"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="relative z-10">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Enhanced feedback UI */}
              {showFeedback && (
                <div
                  className={`mt-6 p-5 rounded-xl ${
                    isCorrect
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-amber-50 border-2 border-amber-200"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    {isCorrect ? (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Check size={24} className="text-green-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <X size={24} className="text-amber-600" />
                      </div>
                    )}
                    <h4
                      className={`text-lg font-bold ${
                        isCorrect ? "text-green-700" : "text-amber-700"
                      }`}
                    >
                      {isCorrect ? "Great job!" : "Let's learn together!"}
                    </h4>
                  </div>
                  <p
                    className={`${
                      isCorrect ? "text-green-700" : "text-amber-700"
                    } pl-12`}
                  >
                    {isCorrect
                      ? levels[currentLevel - 1].questions[currentQuestion]
                          .feedback.correct
                      : levels[currentLevel - 1].questions[currentQuestion]
                          .feedback.incorrect}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Level Completed UI */}
        {gameMode === "quiz" && levelCompleted && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-purple-50 text-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-yellow-100 opacity-40 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-purple-100 opacity-30 -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <div className="inline-block mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full blur-lg opacity-40 transform scale-150 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-yellow-400 to-amber-400 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                    <Star
                      className="h-10 w-10 text-white"
                      fill="currentColor"
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold gradient-text mb-2">
                Level Complete!
              </h2>

              <p className="text-gray-600 mb-4">
                You scored {score} out of{" "}
                {levels[currentLevel - 1].questions.length}
              </p>

              {score >=
                Math.ceil(levels[currentLevel - 1].questions.length * 0.7) && (
                <div className="mb-8">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-20 blur-lg"></div>
                    <img
                      src="/trophy.png"
                      alt="Badge"
                      className="mx-auto relative z-10 w-28 h-28"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-6 rounded-full inline-block font-bold">
                    {levels[currentLevel - 1].badge}!
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-2xl p-5 mb-6 border-2 border-blue-100">
                <h3 className="font-bold text-blue-700 mb-2">
                  Talk with your grown-up about:
                </h3>
                <p className="text-blue-600 italic">
                  "{levels[currentLevel - 1].parentPrompt}"
                </p>
              </div>

              <div className="flex justify-center">
                {currentLevel < levels.length ? (
                  <button
                    onClick={handleNextLevel}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg border-b-4 border-indigo-700 transform hover:scale-105 active:scale-95 transition-all duration-150 flex items-center"
                  >
                    Next Level <ChevronRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={() => setGameMode("completed")}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg border-b-4 border-green-700 transform hover:scale-105 active:scale-95 transition-all duration-150 flex items-center"
                  >
                    Complete Adventure <Award className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Flashcard Mode */}
        {gameMode === "flashcards" && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-blue-100 opacity-40 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-indigo-100 opacity-30 -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-5">
                <div className="bg-indigo-100 px-4 py-1 rounded-full">
                  <span className="font-bold text-indigo-700">
                    Card {currentFlashcard + 1} of{" "}
                    {levels[currentLevel - 1].flashcards.length}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <div className="bg-green-100 px-3 py-1 rounded-full flex items-center">
                    <Check size={14} className="text-green-600 mr-1" />
                    <span className="font-bold text-green-700">
                      {flashcardStats.mastered}
                    </span>
                  </div>

                  <div className="bg-amber-100 px-3 py-1 rounded-full flex items-center">
                    <Star size={14} className="text-amber-500 mr-1" />
                    <span className="font-bold text-amber-700">
                      {flashcardStats.learning}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced FlashCard component - already implemented above */}
              <FlashCard
                card={levels[currentLevel - 1].flashcards[currentFlashcard]}
                onFlip={handleFlashcardFlip}
                onAnswer={handleFlashcardAnswer}
                showingAnswer={showingFlashcardAnswer}
              />

              <div className="flex justify-between mt-8">
                <button
                  onClick={() =>
                    setCurrentFlashcard(Math.max(0, currentFlashcard - 1))
                  }
                  disabled={currentFlashcard === 0}
                  className={`px-6 py-3 rounded-full font-bold flex items-center text-white shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150 ${
                    currentFlashcard === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 border-b-4 border-blue-700"
                  }`}
                >
                  <ChevronLeft className="mr-2" />
                  Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentFlashcard(
                      Math.min(
                        levels[currentLevel - 1].flashcards.length - 1,
                        currentFlashcard + 1
                      )
                    )
                  }
                  disabled={
                    currentFlashcard ===
                    levels[currentLevel - 1].flashcards.length - 1
                  }
                  className={`px-6 py-3 rounded-full font-bold flex items-center text-white shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150 ${
                    currentFlashcard ===
                    levels[currentLevel - 1].flashcards.length - 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 border-b-4 border-blue-700"
                  }`}
                >
                  Next
                  <ChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Story Mode */}
        {gameMode === "story" && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-pink-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-pink-100 opacity-40 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-purple-100 opacity-30 -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-sm mb-2">
                  Story Time
                </span>
                <h2 className="text-2xl font-bold gradient-text">
                  {levels[currentLevel - 1].story.title}
                </h2>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 rounded-2xl blur-sm opacity-70 transform scale-105"></div>
                  <img
                    src="/api/placeholder/200/150"
                    alt="Story illustration"
                    className="rounded-2xl relative z-10 border-4 border-white shadow-md"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 mb-6 border-2 border-purple-100">
                <p className="text-gray-700 leading-relaxed">
                  {levels[currentLevel - 1].story.content}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-5 border-2 border-yellow-100">
                <div className="flex items-start">
                  <div className="bg-yellow-200 rounded-full p-2 mr-3 mt-1">
                    <Heart size={20} className="text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-700 mb-1">
                      Talk About It:
                    </h3>
                    <p className="text-yellow-800 italic">
                      "{levels[currentLevel - 1].parentPrompt}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Avatar Selector Modal */}
      {showingAvatarSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-indigo-100 shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
              Choose Your Avatar
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-xl transition-all ${
                    selectedAvatar === avatar.id
                      ? "bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-purple-300 transform scale-105"
                      : "border-2 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                  }`}
                  onClick={() => handleAvatarSelect(avatar.id)}
                >
                  <div className="relative mb-2">
                    <div
                      className={`${
                        selectedAvatar === avatar.id
                          ? "absolute -inset-2 bg-indigo-300 rounded-full blur-sm opacity-50"
                          : "hidden"
                      }`}
                    ></div>
                    <div className="relative">
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className={`w-16 h-16 rounded-full border-2 ${
                          selectedAvatar === avatar.id
                            ? "border-indigo-400"
                            : "border-gray-200"
                        }`}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      selectedAvatar === avatar.id
                        ? "text-indigo-700"
                        : "text-gray-600"
                    }`}
                  >
                    {avatar.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowingAvatarSelector(false)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg border-b-4 border-indigo-700 transform hover:scale-105 active:scale-95 transition-all duration-150"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-6 flex justify-center">
        <div className="bg-white px-6 py-3 rounded-full shadow-md inline-flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              characterMood === "happy"
                ? "bg-green-400"
                : characterMood === "excited"
                ? "bg-purple-400"
                : characterMood === "thinking"
                ? "bg-blue-400"
                : "bg-amber-400"
            }`}
          ></div>
          <span className="text-gray-600 font-medium">
            {gameMode === "quiz"
              ? "Answer questions to earn stars!"
              : gameMode === "flashcards"
              ? "Flip the cards to learn!"
              : "Read the story with a grown-up!"}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Game2;
