import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import confetti from 'canvas-confetti';

// Sample data - In a real application, this would come from props or API
const sampleScoreData = [
  { day: 'Monday', score: 75, subject: 'Math' },
  { day: 'Tuesday', score: 82, subject: 'Science' },
  { day: 'Wednesday', score: 90, subject: 'English' },
  { day: 'Thursday', score: 85, subject: 'History' },
  { day: 'Friday', score: 95, subject: 'Art' },
];

const sampleActivityData = [
  { hour: '9 AM', minutes: 45, type: 'study' },
  { hour: '10 AM', minutes: 30, type: 'exercise' },
  { hour: '11 AM', minutes: 55, type: 'study' },
  { hour: '12 PM', minutes: 25, type: 'break' },
  { hour: '1 PM', minutes: 35, type: 'study' },
  { hour: '2 PM', minutes: 50, type: 'study' },
  { hour: '3 PM', minutes: 20, type: 'exercise' },
  { hour: '4 PM', minutes: 60, type: 'study' },
];

const badges = [
  { id: 1, name: 'Math Master', icon: '🧮', earned: true, date: '2023-09-15' },
  { id: 2, name: 'Science Whiz', icon: '🔬', earned: true, date: '2023-10-02' },
  { id: 3, name: 'Reading Champion', icon: '📚', earned: true, date: '2023-11-20' },
  { id: 4, name: 'History Buff', icon: '🏺', earned: false, date: null },
  { id: 5, name: 'Art Creator', icon: '🎨', earned: false, date: null },
];

const inspirationalQuotes = [
  "Smart is the new cool! 🧠✨",
  "Every mistake is a step to success! 🚀",
  "Your brain grows when you try hard things! 🌱",
  "Today's effort is tomorrow's achievement! 🌟",
  "Curiosity is the compass to knowledge! 🧭",
];

const mascotTips = [
  "Try studying Math at 3 PM - your brain loves that time!",
  "Taking short breaks helps you remember more!",
  "Did you know? Reading for fun makes you smarter!",
  "Drawing helps your brain think differently!",
  "Exercise makes your brain work better!",
];

const ProgressTracker = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showMascotTip, setShowMascotTip] = useState(false);
  const [mascotTip, setMascotTip] = useState('');
  const [xp, setXp] = useState(750);
  const [streakCount, setStreakCount] = useState(7);
  const mascotAnimationControls = useAnimation();
  const confettiRef = useRef(null);

  // Mascot animations and tips
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 10);
      if (random < 3) {
        const tipIndex = Math.floor(Math.random() * mascotTips.length);
        setMascotTip(mascotTips[tipIndex]);
        setShowMascotTip(true);
        
        mascotAnimationControls.start({
          y: [0, -15, 0],
          rotate: [0, -5, 5, -5, 0],
          transition: { duration: 1 }
        });

        setTimeout(() => {
          setShowMascotTip(false);
        }, 5000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [mascotAnimationControls]);

  // Rotate quotes in footer
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, []);

  const triggerConfetti = () => {
    if (confettiRef.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
    }
  };

  // Calculate XP progress percentage
  const xpPercentage = (xp % 1000) / 10;
  const currentLevel = Math.floor(xp / 1000) + 1;

  // Custom tooltip components for charts
  const CustomScoreTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-xl shadow-lg border-2 border-purple-300">
          <p className="font-bold">{`${payload[0].payload.day}`}</p>
          <p className="text-purple-600">{`${payload[0].payload.subject}: ${payload[0].value}`}</p>
          {payload[0].value >= 90 && <p className="text-green-500 font-bold">Amazing job! 🎉</p>}
        </div>
      );
    }
    return null;
  };

  const CustomActivityTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const emojis = {
        study: '📚',
        exercise: '🏃‍♂️',
        break: '☕'
      };
      return (
        <div className="custom-tooltip bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-xl shadow-lg border-2 border-blue-300">
          <p className="font-bold">{`${payload[0].payload.hour}`}</p>
          <p className="text-blue-600">
            {emojis[payload[0].payload.type]} {`${payload[0].payload.type}: ${payload[0].value} mins`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`w-full min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800'}`}
      style={{
        backgroundImage: isDarkMode 
          ? "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMTIxMjEyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')" 
          : "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmMjAiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzg4ODhiYjEwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')"
      }}
    >
      <div ref={confettiRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-50" />
      
      {/* Header section */}
      <motion.header 
        className={`relative p-4 md:p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-50 backdrop-blur-lg'} shadow-lg rounded-b-3xl`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Title and user profile */}
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div 
              className="mr-3 relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl md:text-3xl font-bold ${isDarkMode ? 'shadow-lg shadow-purple-500/40' : 'shadow-md shadow-purple-500/20'}`}>
                S
              </div>
              <motion.div 
                className="absolute -right-2 -top-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
              >
                {currentLevel}
              </motion.div>
            </motion.div>
            
            <div>
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Progress Tracker
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-purple-600'}`}>
                Hey, SuperStar! Ready to learn? ✨
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-purple-100 text-purple-600'}`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={triggerConfetti}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-pink-300' : 'bg-purple-100 text-purple-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar navigation */}
          <motion.div 
            className={`lg:col-span-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-60'} rounded-3xl shadow-lg backdrop-blur-sm p-4 md:p-6`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <nav className="flex flex-row lg:flex-col justify-around lg:justify-start lg:space-y-4">
              {[
                { id: 'home', icon: '🏠', label: 'Dashboard' },
                { id: 'scores', icon: '📊', label: 'Scores' },
                { id: 'activities', icon: '⏱️', label: 'Activities' },
                { id: 'rewards', icon: '🏆', label: 'Rewards' },
                { id: 'settings', icon: '⚙️', label: 'Settings' }
              ].map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center p-3 rounded-xl transition-all ${activeTab === item.id 
                    ? (isDarkMode ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-700') 
                    : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-purple-50')}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <span className="hidden lg:block font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div
                      className="absolute left-0 w-1 h-8 rounded-r-full bg-gradient-to-b from-pink-500 to-purple-500"
                      layoutId="activeTab"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
            
            {/* XP Progress */}
            <div className={`mt-8 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-purple-700'}`}>
                  Level {currentLevel} Hero
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-purple-700'}`}>
                  {xp % 1000}/{1000} XP
                </span>
              </div>
              <div className={`h-4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-purple-100'} overflow-hidden`}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${xpPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            
            {/* Streak Counter */}
            <motion.div 
              className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} flex items-center`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mr-3 relative">
                <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-blue-100'} flex items-center justify-center`}>
                  <span className="text-xl">🔥</span>
                </div>
              </div>
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  {streakCount} Day Streak!
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`}>
                  Keep it up! You're on fire!
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Main dashboard area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Greeting card */}
            <motion.div 
              className={`relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-200 to-purple-200'} rounded-3xl shadow-lg p-6`}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-purple-800'}`}>
                    This Week's Progress
                  </h2>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    You're making great strides! Keep it up! 🚀
                  </p>
                </div>
                
                {/* Mascot */}
                <div className="relative">
                  <motion.div
                    animate={mascotAnimationControls}
                    className="relative z-10"
                  >
                    <div className="w-16 h-16 sm:w-24 sm:h-24">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/2995/2995401.png" 
                        alt="Mascot"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <AnimatePresence>
                      {showMascotTip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.8 }}
                          className={`absolute right-0 bottom-full mb-2 w-48 p-3 rounded-xl ${
                            isDarkMode ? 'bg-gray-700 text-blue-300' : 'bg-white text-gray-800'
                          } shadow-lg text-xs z-20`}
                        >
                          <div className="relative">
                            {mascotTip}
                            <div className="absolute bottom-0 right-6 transform translate-y-full">
                              <div className={`w-3 h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rotate-45`} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-30 blur-xl" />
            </motion.div>
            
            {/* Charts section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Test Score Chart */}
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-70'} rounded-3xl shadow-lg p-4 md:p-6 backdrop-blur-sm`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-purple-700'}`}>
                  <span className="mr-2">📈</span> Test Score Tracker
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleScoreData}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#555" : "#e0e0e0"} />
                      <XAxis dataKey="day" stroke={isDarkMode ? "#aaa" : "#666"} />
                      <YAxis domain={[0, 100]} stroke={isDarkMode ? "#aaa" : "#666"} />
                      <Tooltip content={<CustomScoreTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        dot={{ 
                          stroke: '#8884d8',
                          strokeWidth: 2,
                          r: 6,
                          fill: isDarkMode ? "#333" : "white"
                        }}
                        activeDot={{ 
                          stroke: '#8884d8',
                          strokeWidth: 2,
                          r: 8,
                          fill: '#8884d8'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        fill="url(#scoreGradient)" 
                        strokeWidth={0}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              {/* Daily Activity Chart */}
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-70'} rounded-3xl shadow-lg p-4 md:p-6 backdrop-blur-sm`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-purple-700'}`}>
                  <span className="mr-2">⏱️</span> Daily Activity Monitor
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampleActivityData}>
                      <defs>
                        <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#555" : "#e0e0e0"} />
                      <XAxis dataKey="hour" stroke={isDarkMode ? "#aaa" : "#666"} />
                      <YAxis stroke={isDarkMode ? "#aaa" : "#666"} />
                      <Tooltip content={<CustomActivityTooltip />} />
                      <Bar 
                        dataKey="minutes" 
                        fill="url(#activityGradient)" 
                        barSize={20} 
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            
            {/* Badges Section */}
            <motion.div 
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-70'} rounded-3xl shadow-lg p-4 md:p-6 backdrop-blur-sm`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-purple-700'}`}>
                <span className="mr-2">🏆</span> Your Achievement Badges
              </h3>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    className={`relative p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} w-24 h-24 flex flex-col items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <span className={`text-xs text-center font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {badge.name}
                    </span>
                    {!badge.earned && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </div>
                    )}
                    {badge.earned && (
                      <motion.div 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 260, 
                          damping: 20,
                          delay: 1 + badge.id * 0.2 
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer with inspirational quotes */}
      <motion.footer 
        className={`mt-8 py-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-60'} backdrop-blur-sm`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="container mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`text-lg font-medium ${isDarkMode ? 'text-blue-300' : 'text-purple-600'}`}
            >
              {inspirationalQuotes[currentQuote]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.footer>
    </div>
  );
};

export default ProgressTracker;