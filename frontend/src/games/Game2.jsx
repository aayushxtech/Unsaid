import { useState } from "react";
import {
  Award,
  User,
  Heart,
  Shield,
  Globe,
  ChevronRight,
  Settings,
  Home,
} from "lucide-react";

const Game2 = () => {
  const [userAge, setUserAge] = useState("");
  const [ageEntered, setAgeEntered] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showParentMode, setShowParentMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

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
      challenge: "Spot the Safe Touch",
      description:
        "Tap happy faces for good touches, sad faces for bad touches",
      badge: "Body Explorer Badge",
      parentPrompt: "Ask your child: Which parts of your body are private?",
    },
    {
      id: 2,
      title: "Growing Up Smart",
      challenge: "Family Puzzle",
      description: "Drag parents and kids to form diverse families",
      badge: "Respect Champion Badge",
      parentPrompt: "Ask your child: What changes happen during puberty?",
    },
    {
      id: 3,
      title: "Think & Thrive",
      challenge: "Consent Quiz",
      description: "Your friend wants to hug you. You say...",
      badge: "Boundary Boss Badge",
      parentPrompt:
        "Ask your child: Why is consent important in digital spaces?",
    },
  ];

  const currentLevelData = levels[currentLevel - 1];

  const handleAgeSubmit = () => {
    const age = parseInt(userAge);
    if (isNaN(age) || age < 3 || age > 12) {
      alert("Please enter a valid age between 3 and 12");
      return;
    }

    setAgeEntered(true);
  };

  const handleInputChange = (e) => {
    setUserAge(e.target.value);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  const handleReset = () => {
    setUserAge("");
    setAgeEntered(false);
    setGameStarted(false);
    setShowParentMode(false);
    setCurrentLevel(1);
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">
          Body Smart Adventure
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowParentMode(!showParentMode)}
            className="p-2 bg-amber-100 rounded-full hover:bg-amber-200"
          >
            <Settings size={24} className="text-amber-700" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
          >
            <Home size={24} className="text-blue-700" />
          </button>
        </div>
      </header>

      {/* Parent/Teacher Mode Panel */}
      {showParentMode && (
        <div className="w-full max-w-4xl mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <h2 className="font-bold text-amber-800 text-lg">
            Parent/Teacher Mode
          </h2>
          <p className="text-amber-700 mt-2">
            {ageEntered
              ? currentLevelData.parentPrompt
              : "Enter the child's age to start the game."}
          </p>
          <div className="mt-3 text-sm text-amber-600">
            <p>
              This mode provides guidance for adults to facilitate meaningful
              conversations with children about body safety and consent.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {!ageEntered ? (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">
              Welcome to Body Smart Adventure!
            </h2>
            <p className="text-center mb-8 text-gray-600">
              Let's start by entering your age.
            </p>

            <div className="flex flex-col items-center">
              <div className="mb-6 w-full max-w-xs">
                <label
                  htmlFor="age"
                  className="block text-gray-700 font-medium mb-2"
                >
                  How old are you?
                </label>
                <input
                  type="number"
                  id="age"
                  min="3"
                  max="12"
                  value={userAge}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-xl"
                  placeholder="Enter your age"
                />
              </div>
              <button
                onClick={handleAgeSubmit}
                className="py-3 px-8 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold"
              >
                Let's Go!
              </button>
            </div>
          </div>
        ) : !gameStarted ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-purple-800 mb-2">
              Body Smart Adventure
            </h2>
            <p className="text-center mb-6">
              Welcome! You are {userAge} years old
            </p>

            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-purple-700 mb-2">Core Topics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center space-x-2 p-2 bg-white rounded-md"
                  >
                    <div className="text-purple-600">{topic.icon}</div>
                    <span>{topic.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-blue-700 mb-2">
                All Levels Available
              </h3>
              <ul className="space-y-2">
                {levels.map((level) => (
                  <li
                    key={level.id}
                    className="flex items-center text-blue-600"
                  >
                    <Award className="h-4 w-4 mr-2" /> Level {level.id}:{" "}
                    {level.title}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleStartGame}
              className="mt-4 w-full py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold flex items-center justify-center"
            >
              Let's Play! <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 -mx-6 -mt-6 p-6 mb-6">
              <h2 className="text-2xl font-bold text-white">
                Level {currentLevel}: {currentLevelData.title}
              </h2>
              <p className="text-white text-opacity-90">
                Today's Challenge: {currentLevelData.challenge}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-blue-800">
                  Challenge Instructions
                </h3>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="mt-2 text-blue-700">
                {currentLevelData.description}
              </p>
            </div>

            {/* Game Interface Placeholder */}
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
              <div className="text-center p-4">
                <p className="text-gray-600 mb-2">
                  Game Content for Level {currentLevel}
                </p>
                <p className="text-sm text-gray-500">
                  {currentLevelData.title}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4 mb-6">
              <div className="bg-white rounded-full p-2">
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">Complete to earn:</h3>
                <p className="text-green-700">{currentLevelData.badge}</p>
              </div>
            </div>

            {/* Level Navigation */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevLevel}
                disabled={currentLevel === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentLevel === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Previous Level
              </button>
              <button
                onClick={handleNextLevel}
                disabled={currentLevel === levels.length}
                className={`px-4 py-2 rounded-lg ${
                  currentLevel === levels.length
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Next Level
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Progress Tracker */}
      {ageEntered && (
        <div className="w-full max-w-4xl mt-6 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-700 mb-2">Your Progress</h3>
          <div className="flex justify-between">
            <div className="flex space-x-1">
              {topics.map((_, index) => (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-full ${
                    index === 0 ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              1/5 Challenges Completed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Game2;
