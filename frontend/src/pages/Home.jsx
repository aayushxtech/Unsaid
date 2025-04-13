import React, { useState, useEffect } from "react";
import { Button, Container, Grid, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { Heart, Sun, Music, Award, Sparkles, CloudRain } from "lucide-react";

// Add confetti effect component
const Confetti = ({ isActive }) => {
  const [confetti, setConfetti] = useState([]);
  
  useEffect(() => {
    if (isActive) {
      const newConfetti = [];
      for (let i = 0; i < 50; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          y: -20 - Math.random() * 10,
          size: Math.random() * 8 + 5,
          color: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 6)]
        });
      }
      setConfetti(newConfetti);
      
      // Clear confetti after animation
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((item) => (
        <div
          key={item.id}
          className={`absolute ${item.color} rounded-full animate-fall`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
          }}
        />
      ))}
    </div>
  );
};

// Interactive background weather component
const WeatherBackground = ({ weather }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {weather === 'sunny' && (
        <div className="absolute top-10 right-10 text-yellow-500 animate-pulse">
          <Sun size={100} className="opacity-40" />
        </div>
      )}
      
      {weather === 'rainy' && (
        Array(20).fill().map((_, i) => (
          <div 
            key={i}
            className="absolute bg-blue-300 rounded-full opacity-30 animate-raindrops"
            style={{
              width: '2px',
              height: '20px',
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 1 + 1}s`
            }}
          />
        ))
      )}
      
      {weather === 'sparkly' && (
        Array(15).fill().map((_, i) => (
          <div 
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            <Sparkles className="text-yellow-400" size={Math.random() * 20 + 10} />
          </div>
        ))
      )}
    </div>
  );
};

// Interactive character mascot
const Mascot = ({ mood, onClick }) => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [animation, setAnimation] = useState('');
  
  useEffect(() => {
    // Random movement every few seconds
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 10
      });
      setAnimation('transition-all duration-1000 ease-in-out');
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={`absolute cursor-pointer z-10 ${animation}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute -top-10 left-0 bg-white p-2 rounded-lg shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click me!
        </div>
        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl group hover:scale-110 transition-transform duration-300">
          {mood === 'happy' && '😊'}
          {mood === 'excited' && '🤩'}
          {mood === 'curious' && '🧐'}
        </div>
      </div>
    </div>
  );
};

// Interactive quiz component for kids
const KidsQuiz = ({ isVisible, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [celebration, setCelebration] = useState(false);
  
  const questions = [
    {
      question: "Which part of your body helps you think?",
      options: ["Stomach", "Brain", "Knees", "Elbows"],
      answer: "Brain",
      explanation: "Your brain helps you think, learn, and control your body!"
    },
    {
      question: "What should you do if a stranger asks you to go somewhere?",
      options: ["Go with them", "Tell a trusted adult", "Keep it a secret", "Give them your address"],
      answer: "Tell a trusted adult",
      explanation: "Always tell a trusted adult if a stranger approaches you!"
    },
    {
      question: "It's okay to share _____ online.",
      options: ["Your full name", "Your address", "Your favorite color", "Pictures of your house"],
      answer: "Your favorite color",
      explanation: "Some things are safe to share, like favorite colors or foods!"
    }
  ];
  
  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
      setCelebration(true);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Confetti isActive={celebration} />
      <div className="bg-white rounded-3xl p-6 max-w-md w-full relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full opacity-30" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-30" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <div className="relative z-10">
          {showScore ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Quiz Complete!</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-yellow-500">{score}</span>
                <span className="text-xl text-gray-600">/{questions.length}</span>
              </div>
              
              <div className="flex justify-center mb-6">
                {[...Array(score)].map((_, i) => (
                  <StarIcon key={i} className="text-yellow-400 text-3xl mx-1 animate-bounce" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-6">Great job learning about safety!</p>
              
              <div className="flex space-x-4 justify-center">
                <Button 
                  onClick={resetQuiz}
                  variant="contained" 
                  color="primary" 
                  className="rounded-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={onClose}
                  variant="outlined" 
                  color="primary"
                  className="rounded-full"
                >
                  Back to Main
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-purple-600">Safety Quiz</h3>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Question {currentQuestion + 1}/{questions.length}
                </span>
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h4>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-transparent hover:border-blue-300 transition-colors duration-200"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced component with interactive elements
const EnhancedHome = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showKidsQuiz, setShowKidsQuiz] = useState(false);
  const [mascotMood, setMascotMood] = useState('curious');
  const [weather, setWeather] = useState('sunny');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [showConfetti, setShowConfetti] = useState(false);
  const [backgroundSound, setBackgroundSound] = useState(false);

  // Generate random mascot interactions
  useEffect(() => {
    const moods = ['happy', 'excited', 'curious'];
    const interval = setInterval(() => {
      setMascotMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle mascot click
  const handleMascotClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Cycle through weather types
    const weatherTypes = ['sunny', 'rainy', 'sparkly'];
    const currentIndex = weatherTypes.indexOf(weather);
    setWeather(weatherTypes[(currentIndex + 1) % weatherTypes.length]);
  };

  // Background theme colors
  const themes = {
    default: "bg-gradient-to-r from-blue-50 to-purple-50",
    rainbow: "bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100",
    ocean: "bg-gradient-to-r from-cyan-50 to-blue-100",
    forest: "bg-gradient-to-r from-green-50 to-emerald-100",
    sunset: "bg-gradient-to-r from-orange-50 to-pink-100",
  };

  const ageGroups = [
    {
      title: "Kids (3-12)",
      description: "Fun, simple intro to body, emotions, and safety",
      icon: <ChildCareIcon sx={{ fontSize: 60, color: "#9333EA" }} />,
      color: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
      emoji: "⭐",
      features: ["Interactive Games ✨", "Fun Stories 🌟", "Cool Animations ⭐"],
      theme: "playful",
      action: () => setShowKidsQuiz(true)
    },
    {
      title: "Teens (12-19)",
      description: "Teen-focused: puberty, consent, identity, relationships",
      icon: <SchoolIcon sx={{ fontSize: 60, color: "#6B8AFF" }} />,
      color: "linear-gradient(135deg, #E8F0FF 0%, #B6C9FF 100%)",
      emoji: "✨",
      features: ["Real Stories", "Anonymous Q&A", "Guided Learning"],
      theme: "modern",
      action: () => alert("Teen section coming soon!")
    },
    {
      title: "Adults (20+)",
      description: "Comprehensive guidance on intimacy, communication, and wellness",
      icon: <PersonIcon sx={{ fontSize: 60, color: "#4CAF50" }} />,
      color: "linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%)",
      emoji: "💫",
      features: ["Detailed Resources", "Expert Advice", "Community Support"],
      theme: "professional",
      action: () => alert("Adult section coming soon!")
    },
  ];

  // Custom styles with additional animations
  const customAnimations = `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1) rotate(0); }
      50% { opacity: 0.8; transform: scale(1.4) rotate(180deg); }
    }

    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes ripple {
      0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
      100% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
    }

    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    @keyframes fall {
      0% { transform: translateY(0) rotate(0); }
      100% { transform: translateY(100vh) rotate(360deg); }
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    @keyframes raindrops {
      0% { transform: translateY(0); }
      100% { transform: translateY(100vh); }
    }

    @keyframes twinkle-star {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }

    @keyframes float-star {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(15deg); }
    }

    .magical-star {
      position: absolute;
      color: #9333EA;
      filter: drop-shadow(0 0 5px rgba(147, 51, 234, 0.5));
      animation: twinkle-star 2s infinite ease-in-out;
    }

    .floating-star {
      position: absolute;
      color: #A855F7;
      filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6));
      animation: float-star 3s infinite ease-in-out;
    }

    .purple-glow {
      box-shadow: 0 0 15px rgba(147, 51, 234, 0.3);
      background: linear-gradient(135deg, #9333EA, #A855F7);
    }

    .star-bg {
      background-image: radial-gradient(#9333EA 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.1;
    }

    .hero-title {
      background: linear-gradient(300deg, #9333EA, #A855F7, #D8B4FE, #9333EA);
      background-size: 300% 300%;
      animation: gradient 15s ease infinite;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 2px 10px rgba(147, 51, 234, 0.2);
    }

    .purple-gradient-bg {
      background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%);
      position: relative;
      overflow: hidden;
    }

    .floating-orb {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.4), rgba(139, 92, 246, 0.1));
      filter: blur(8px);
      animation: float 20s infinite ease-in-out;
      pointer-events: none;
    }

    .hexagon-grid {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.05' fill='%238B5CF6'/%3E%3C/svg%3E");
      background-size: 60px 60px;
      opacity: 0.3;
      pointer-events: none;
    }

    .glow-effect {
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.2), transparent 70%);
      animation: pulse 4s infinite ease-in-out;
    }
  `;

  return (
    <>
      <style>{customAnimations}</style>
      
      {/* Theme selector */}
      <div className="fixed top-4 right-4 z-30 flex gap-2">
        {Object.keys(themes).map((theme) => (
          <button
            key={theme}
            className={`w-8 h-8 rounded-full shadow-md transition-transform ${
              selectedTheme === theme ? 'scale-125 ring-2 ring-white' : ''
            } ${theme === 'default' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 
               theme === 'rainbow' ? 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400' :
               theme === 'ocean' ? 'bg-gradient-to-r from-cyan-400 to-blue-400' :
               theme === 'forest' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
               'bg-gradient-to-r from-orange-400 to-pink-400'}`}
            onClick={() => setSelectedTheme(theme)}
          />
        ))}
        
        <button
          className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center ${
            backgroundSound ? 'bg-green-400' : 'bg-gray-200'
          }`}
          onClick={() => setBackgroundSound(!backgroundSound)}
        >
          <Music size={16} color={backgroundSound ? 'white' : 'gray'} />
        </button>
      </div>
      
      {/* Interactive mascot */}
      <Mascot mood={mascotMood} onClick={handleMascotClick} />
      
      {/* Weather background */}
      <WeatherBackground weather={weather} />
      
      {/* Confetti effect */}
      <Confetti isActive={showConfetti} />
      
      {/* Hero section */}
      <section
        id="Hero"
        className={`${themes[selectedTheme]} py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex items-center purple-gradient-bg`}
      >
        {/* Animated stars background */}
        <div className="absolute inset-0 star-bg" />
        
        {/* Decorative floating stars */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="magical-star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ⭐
          </div>
        ))}

        {/* Larger floating stars */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`large-star-${i}`}
            className="floating-star"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {['⭐', '✨', '🌟'][Math.floor(Math.random() * 3)]}
          </div>
        ))}

        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="floating-orb"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Hexagon grid */}
        <div className="hexagon-grid" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-3xl md:text-5xl font-extrabold mb-4 hero-title hover:scale-105 transition-transform duration-300 cursor-pointer">
            UNSAID
          </div>
          <div className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
            Sex Education. Reimagined
          </div>
          <div className="text-lg md:text-xl text-gray-600 mb-10 mx-auto max-w-2xl">
            Empowering you with accurate, inclusive, and stigma-free
            knowledge—at your own pace.
          </div>
          <div id="cta-btn" className="mt-8">
            <Button 
              className="purple-glow !text-white !font-medium !py-3 !px-8 !text-lg !rounded-lg !transition !duration-300 !normal-case"
              sx={{
                background: 'linear-gradient(45deg, #9333EA, #A855F7)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7E22CE, #9333EA)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 20px rgba(147, 51, 234, 0.4)',
                }
              }}
            >
              Get Started
              <span className="ml-2">✨</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Age Groups section with enhanced interactivity */}
      <section className="py-16 bg-gray-50 relative">
        <div className="absolute inset-0 overflow-hidden">
          {selectedTheme === 'rainbow' && (
            <div className="absolute w-full h-full bg-gradient-to-r from-red-50 via-yellow-50 to-blue-50 opacity-40" />
          )}
          {selectedTheme === 'forest' && (
            [...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-green-100 rounded-full"
                style={{
                  width: Math.random() * 200 + 50,
                  height: Math.random() * 200 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3,
                }}
              />
            ))
          )}
        </div>
        
        <Container maxWidth="lg" className="relative z-10">
          <div className="mb-12 text-center">
            <Typography
              variant="h4"
              component="h2"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#1F2937",
              }}
            >
              Caters to Various Age Groups
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 max-w-2xl mx-auto">
              Everyone deserves appropriate, relevant, and engaging education. Choose your age group for a 
              tailored experience designed specifically for you.
            </Typography>
          </div>

          <Grid container spacing={4} justifyContent="center">
            {ageGroups.map((group, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div className="h-full">
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      overflow: "hidden",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "none",
                      borderRadius: "24px",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow:
                          group.theme === "playful"
                            ? "0 20px 40px rgba(255, 107, 107, 0.3)"
                            : group.theme === "modern"
                            ? "0 20px 40px rgba(107, 138, 255, 0.3)"
                            : "0 20px 40px rgba(76, 175, 80, 0.3)",
                      },
                    }}
                    className="card-hover-effect"
                    onClick={group.action}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {hoveredCard === index && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-2 right-2 text-2xl sparkle-emoji">
                          {group.emoji}
                        </div>
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-transparent"
                          style={{
                            background: group.theme === "playful" 
                              ? "linear-gradient(to top, rgba(255,107,107,0.05), transparent)"
                              : group.theme === "modern"
                              ? "linear-gradient(to top, rgba(107,138,255,0.05), transparent)"
                              : "linear-gradient(to top, rgba(76,175,80,0.05), transparent)"
                          }}
                        />
                      </div>
                    )}
                    
                    <Box
                      sx={{
                        background: group.color,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div className={hoveredCard === index ? "animate-bounce" : ""}>
                        {group.icon}
                      </div>
                      <Typography
                        variant="h4"
                        sx={{
                          mt: 2,
                          fontWeight: 800,
                          background:
                            group.theme === "playful"
                              ? "linear-gradient(45deg, #FF6B6B, #FFA07A)"
                              : group.theme === "modern"
                              ? "linear-gradient(45deg, #6B8AFF, #836BFF)"
                              : "linear-gradient(45deg, #4CAF50, #81C784)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {group.title}
                      </Typography>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Typography
                        variant="body1"
                        sx={{ mb: 3, color: "#4B5563", fontSize: "1.1rem" }}
                      >
                        {group.description}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        {group.features.map((feature, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              opacity: hoveredCard === index ? 1 : 0.8,
                              transform: hoveredCard === index ? "translateX(8px)" : "translateX(0)",
                              transition: "all 0.3s ease",
                              transitionDelay: `${i * 0.1}s`,
                            }}
                          >
                            <div className="text-xl mr-2">
                              {group.emoji}
                            </div>
                            <Typography sx={{ ml: 2, color: "#374151" }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      {hoveredCard === index && (
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 3,
                            backgroundColor: 
                              group.theme === "playful" ? "#FF6B6B" :
                              group.theme === "modern" ? "#6B8AFF" : "#4CAF50",
                            "&:hover": {
                              backgroundColor: 
                                group.theme === "playful" ? "#FF5252" :
                                group.theme === "modern" ? "#5277FF" : "#43A047",
                            }
                          }}
                          className="interactive-button"
                        >
                          Explore {group.title.split(" ")[0]} Content
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>
      
      {/* Interactive quiz for kids */}
      <KidsQuiz isVisible={showKidsQuiz} onClose={() => setShowKidsQuiz(false)} />
    </>
  );
};

export default EnhancedHome;