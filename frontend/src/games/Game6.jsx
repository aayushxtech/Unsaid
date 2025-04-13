import { useState, useEffect } from "react";
import { Volume2, VolumeX, HelpCircle } from "lucide-react";

export default function Game6() {
  const [currentItem, setCurrentItem] = useState(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hint, setHint] = useState("");
  const [showBox, setShowBox] = useState(true);

  // Age-appropriate body parts for children
  const bodyParts = [
    {
      name: "Hand",
      clue: "You use these to grab things and wave hello!",
      fact: "Your hands have 27 bones each!",
      sound: "clap sound would play here",
    },
    {
      name: "Ear",
      clue: "This helps you hear sounds around you.",
      fact: "Your outer ear is called the pinna!",
      sound: "bell sound would play here",
    },
    {
      name: "Eye",
      clue: "You see with these!",
      fact: "Your eyes blink about 15-20 times every minute!",
      sound: "pop sound would play here",
    },
    {
      name: "Foot",
      clue: "You stand on these and use them to walk and run.",
      fact: "Each of your feet has 26 bones!",
      sound: "stomp sound would play here",
    },
    {
      name: "Heart",
      clue: "This organ pumps blood through your whole body.",
      fact: "Your heart beats about 100,000 times every day!",
      sound: "heartbeat sound would play here",
    },
    {
      name: "Brain",
      clue: "This helps you think and remember things.",
      fact: "Your brain uses 20% of all the oxygen you breathe!",
      sound: "thinking sound would play here",
    },
    {
      name: "Lungs",
      clue: "These help you breathe in air.",
      fact: "You have two lungs that fill up like balloons when you breathe in!",
      sound: "inhale sound would play here",
    },
    {
      name: "Stomach",
      clue: "This is where food goes after you swallow it.",
      fact: "Your stomach has special juices that help break down food!",
      sound: "gurgle sound would play here",
    },
  ];

  const [itemsLeft, setItemsLeft] = useState([...bodyParts]);

  useEffect(() => {
    if (itemsLeft.length === 0) {
      setGameCompleted(true);
      playSound("tada sound would play here");
    } else if (!currentItem) {
      selectNewItem();
    }
  }, [itemsLeft, currentItem]);

  const selectNewItem = () => {
    if (itemsLeft.length > 0) {
      const randomIndex = Math.floor(Math.random() * itemsLeft.length);
      setCurrentItem(itemsLeft[randomIndex]);
      setHasGuessed(false);
      setHint("");
      setShowBox(true);
    }
  };

  const handleGuess = (guessedPart) => {
    setAttempts(attempts + 1);

    if (guessedPart === currentItem.name) {
      setHasGuessed(true);
      setScore(score + 1);
      playSound("correct sound would play here");
      setShowBox(false);

      // Remove the guessed item from itemsLeft
      setTimeout(() => {
        setItemsLeft(itemsLeft.filter((item) => item.name !== guessedPart));
        setCurrentItem(null);
      }, 3000);
    } else {
      setHint("Try again! Think about what the clue is describing.");
      playSound("wrong sound would play here");
    }
  };

  const playSound = (soundText) => {
    if (!soundEnabled) return;
    console.log(soundText); // In a real implementation, this would play the actual sound
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    playSound(soundEnabled ? "sound off" : "sound on");
  };

  const renderGameContent = () => {
    if (gameCompleted) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold mb-6 text-purple-600">
            🎉 You did it! 🎉
          </div>
          <div className="text-2xl mb-4">You found all the body parts!</div>
          <div className="text-xl mb-8">
            Final Score: {score} out of {attempts} attempts
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full text-lg transition-colors duration-300"
          >
            Play Again
          </button>
        </div>
      );
    }

    if (!currentItem)
      return <div className="text-center text-xl">Loading next item...</div>;

    return (
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <h2 className="text-xl mb-2">Mystery Box Clue:</h2>
          <p className="text-lg font-medium text-blue-600">
            {currentItem.clue}
          </p>
          {hint && <p className="text-red-500 mt-2">{hint}</p>}
        </div>

        {showBox ? (
          <div className="relative mb-8">
            <div
              className="w-64 h-64 bg-yellow-400 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => playSound(currentItem.sound)}
            >
              <div className="text-6xl">?</div>
              <div className="absolute -top-4 -right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound(currentItem.sound);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  title="Play sound hint"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              Correct! It's the {currentItem.name}!
            </div>
            <div className="text-lg">Fun Fact: {currentItem.fact}</div>
            <div className="mt-4 w-64 h-64 bg-green-200 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-5xl">{currentItem.name}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
          {bodyParts.map((part, index) => (
            <button
              key={index}
              onClick={() => handleGuess(part.name)}
              disabled={
                hasGuessed || !itemsLeft.some((item) => item.name === part.name)
              }
              className={`py-2 px-4 rounded-lg text-center transition-colors ${
                itemsLeft.some((item) => item.name === part.name)
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">
            Body Parts Mystery Box
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={toggleSound}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
              title="How to play"
              onClick={() =>
                alert(
                  "Listen to the clue and the sound, then guess which body part is in the mystery box! Click on the box to hear the sound again."
                )
              }
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg">
            <span className="font-medium">Score:</span> {score}/{attempts}{" "}
            attempts
          </div>
          <div className="text-lg">
            <span className="font-medium">Body Parts Left:</span>{" "}
            {itemsLeft.length}/{bodyParts.length}
          </div>
        </div>

        {renderGameContent()}
      </div>
    </div>
  );
}
