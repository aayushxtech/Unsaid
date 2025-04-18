import { useState, useEffect, useCallback } from "react";
import { Shuffle, RefreshCw, Info, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import calculateAge from "../lib/calculateAge";
import getAgeGroup from "../lib/ageGroup";

const styles = {
  cardFront: `
    absolute inset-0
    flex flex-col items-center justify-center
    bg-white rounded-xl
    border-2 border-indigo-300
    shadow-lg
    backface-hidden
    p-4
    transform rotate-y-180
    hover:shadow-xl
    transition-shadow
  `,
  cardBack: `
    absolute inset-0
    flex items-center justify-center
    bg-gradient-to-br from-indigo-600 to-purple-600
    rounded-xl border-2 border-indigo-700
    shadow-lg
    backface-hidden
    hover:shadow-xl
    transition-shadow
  `,
};

// Game card data: contraceptive methods and their descriptions
const gameData = [
  {
    id: 1,
    type: "method",
    name: "Male Condom",
    icon: () => <Shield className="text-blue-500" size={40} />,
    details:
      "External latex barrier worn on penis. 87% effective with typical use. Non-hormonal.",
  },
  {
    id: 2,
    type: "method",
    name: "Female Condom",
    icon: () => <Shield className="text-purple-500" size={40} />,
    details:
      "Internal polyurethane barrier inserted in vagina. 79% effective with typical use. Non-hormonal.",
  },
  {
    id: 3,
    type: "method",
    name: "Birth Control Pill",
    icon: () => (
      <div className="w-10 h-10 rounded-full border-2 border-pink-400 flex items-center justify-center">
        Pill
      </div>
    ),
    details:
      "Daily oral tablet with hormones. 93% effective with typical use. Hormonal method that prevents ovulation.",
  },
  {
    id: 4,
    type: "method",
    name: "IUD (Hormonal)",
    icon: () => <div className="w-10 h-10 text-teal-500 font-bold">T</div>,
    details:
      "T-shaped device inserted in uterus. Over 99% effective. Hormonal option lasts 3-7 years.",
  },
  {
    id: 5,
    type: "method",
    name: "IUD (Copper)",
    icon: () => <div className="w-10 h-10 text-amber-600 font-bold">Cu</div>,
    details:
      "Copper T-shaped device inserted in uterus. Over 99% effective. Non-hormonal option lasts up to 12 years.",
  },
  {
    id: 6,
    type: "method",
    name: "Birth Control Patch",
    icon: () => (
      <div className="w-10 h-10 bg-teal-200 rounded-sm border border-teal-500"></div>
    ),
    details:
      "Adhesive patch worn on body, changed weekly. 93% effective with typical use. Hormonal method.",
  },
  {
    id: 7,
    type: "method",
    name: "Birth Control Shot",
    icon: () => (
      <div className="w-10 h-10 flex items-center justify-center">💉</div>
    ),
    details:
      "Injection given every 3 months. 96% effective with typical use. Hormonal method.",
  },
  {
    id: 8,
    type: "method",
    name: "Vaginal Ring",
    icon: () => (
      <div className="w-10 h-10 rounded-full border-4 border-pink-300"></div>
    ),
    details:
      "Flexible ring inserted in vagina for 3 weeks. 93% effective with typical use. Hormonal method.",
  },
  {
    id: 9,
    type: "method",
    name: "Implant",
    icon: () => <div className="w-10 h-2 bg-lime-300 rounded-full"></div>,
    details:
      "Small rod inserted under skin of upper arm. Over 99% effective. Hormonal method lasts up to 5 years.",
  },
  {
    id: 10,
    type: "method",
    name: "Diaphragm",
    icon: () => (
      <div className="w-10 h-10 rounded-full border-2 border-rose-300 bg-rose-100"></div>
    ),
    details:
      "Shallow silicone cup inserted before sex. 88% effective with typical use and spermicide. Non-hormonal.",
  },
  {
    id: 11,
    type: "method",
    name: "Emergency Contraception",
    icon: () => (
      <div className="w-10 h-10 flex items-center justify-center text-red-500 font-bold">
        EC
      </div>
    ),
    details:
      "Morning-after pill taken within 3-5 days after unprotected sex. 75-89% effective. Hormonal method.",
  },
  {
    id: 12,
    type: "method",
    name: "Spermicide",
    icon: () => (
      <div className="w-10 h-10 flex items-center justify-center text-gray-500">
        🧪
      </div>
    ),
    details:
      "Chemical inserted before sex that prevents sperm movement. 72% effective with typical use. Non-hormonal.",
  },
];

// Create matching pairs by adding description cards
const createGameCards = () => {
  const cards = [];

  gameData.forEach((item) => {
    // Method card
    cards.push({
      id: item.id,
      pairId: item.id,
      type: "method",
      name: item.name,
      icon: item.icon,
      isFlipped: false,
      isMatched: false,
    });

    // Description card
    cards.push({
      id: item.id + 12, // offset for unique ID
      pairId: item.id,
      type: "description",
      details: item.details,
      isFlipped: false,
      isMatched: false,
    });
  });

  return cards;
};

// Shuffle function for cards
const shuffleCards = (cards) => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Game5() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // All state hooks declared first
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Game reset function
  const resetGame = useCallback(() => {
    const newCards = shuffleCards(createGameCards());
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
    setShowInstructions(false);
  }, []);

  // Card click handler
  const handleCardClick = useCallback(
    (index) => {
      if (
        cards[index].isFlipped ||
        cards[index].isMatched ||
        flippedCards.length >= 2
      ) {
        return;
      }

      const updatedCards = [...cards];
      updatedCards[index].isFlipped = true;
      setCards(updatedCards);
      setFlippedCards((prev) => [...prev, index]);
    },
    [cards, flippedCards.length]
  );

  // Authorization effect
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

          if (ageGroup !== "20-45") {
            navigate("/games");
            return;
          }

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

  // Game initialization effect
  useEffect(() => {
    if (authorized) {
      resetGame();
    }
  }, [authorized, resetGame]);

  // Match checking effect
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const updatedCards = [...cards];

      setMoves((prevMoves) => prevMoves + 1);

      if (cards[first].pairId === cards[second].pairId) {
        updatedCards[first].isMatched = true;
        updatedCards[second].isMatched = true;
        setCards(updatedCards);
        setMatchedPairs((prevPairs) => prevPairs + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          updatedCards[first].isFlipped = false;
          updatedCards[second].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1500);
      }
    }
  }, [flippedCards, cards]);

  // Game over effect
  useEffect(() => {
    if (matchedPairs === 12) {
      setTimeout(() => {
        setGameOver(true);
      }, 500);
    }
  }, [matchedPairs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Enhanced Game Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Heart className="text-red-500 w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Protection Match
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="text-center px-4 py-2 bg-indigo-100 rounded-xl">
              <p className="text-sm text-indigo-800 font-medium">Moves</p>
              <p className="font-bold text-xl text-indigo-700">{moves}</p>
            </div>
            <div className="text-center px-4 py-2 bg-purple-100 rounded-xl">
              <p className="text-sm text-purple-800 font-medium">Pairs</p>
              <p className="font-bold text-xl text-purple-700">{matchedPairs}/12</p>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all transform hover:scale-105"
            >
              <RefreshCw size={18} className="mr-2" /> Reset
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-4 py-2 rounded-xl transition-all transform hover:scale-105"
            >
              <Info size={18} className="mr-2" /> Info
            </button>
          </div>
        </div>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                How to Play Protection Match
              </h2>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>
                  This memory game helps you learn about different contraception
                  methods.
                </li>
                <li>
                  The game has 24 cards: 12 contraceptive methods and 12
                  matching descriptions.
                </li>
                <li>
                  Click on two cards to flip them. If they match, they stay face
                  up.
                </li>
                <li>Try to match all pairs with the fewest moves possible.</li>
                <li>
                  Play with 2-4 players, taking turns. The player with the most
                  pairs wins!
                </li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-800">
                  Remember: This game is for educational purposes. Always
                  consult healthcare providers for personal contraception
                  advice.
                </p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
              >
                Let's Play!
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
              <h2 className="text-3xl font-bold text-indigo-700 mb-2">
                Congratulations!
              </h2>
              <p className="text-xl mb-4">
                You matched all pairs in {moves} moves!
              </p>
              <div className="mb-6">
                <p className="text-lg">
                  What did you learn about contraception today?
                </p>
              </div>
              <button
                onClick={resetGame}
                className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
              >
                <Shuffle size={20} className="mr-2" /> Play Again
              </button>
            </div>
          </div>
        )}

        {/* Improved Game Board */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className={`
                aspect-[3/4] relative
                transform-gpu perspective-1000
                ${!card.isMatched && "hover:scale-102"}
                transition-all duration-300 ease-in-out
                ${card.isMatched ? "cursor-default" : "cursor-pointer"}
              `}
            >
              <div
                className={`
                  relative w-full h-full
                  transition-all duration-500
                  transform-gpu preserve-3d
                  ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
                  ${card.isMatched ? "ring-2 ring-green-500 ring-offset-2" : ""}
                `}
              >
                <div className={styles.cardFront}>
                  {card.type === "method" ? (
                    <>
                      <div className="transform-gpu scale-110 mb-3">{card.icon()}</div>
                      <div className="text-center text-sm font-medium text-indigo-900">
                        {card.name}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm leading-tight text-gray-700 px-2">
                      {card.details}
                    </div>
                  )}
                </div>

                <div className={styles.cardBack}>
                  <Shield className="text-white/90 w-8 h-8 transform hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-indigo-800">
            Protection Match - An educational contraception awareness game
          </p>
          <p className="mt-2 text-xs text-purple-600">
            Always consult healthcare professionals for personalized contraceptive advice
          </p>
        </div>
      </div>
    </div>
  );
}
