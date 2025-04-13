import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import calculateAge from "../lib/calculateAge";
import getAgeGroup from "../lib/ageGroup";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  Gamepad2 as GamepadIcon,
  AlertTriangle,
  Lock as LockIcon,
  User2Icon,
  Star,
  Trophy,
  Sparkles,
  Rocket,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence, color } from "framer-motion";

// Improved animated background bubble with interaction
const AnimatedBubble = ({ size, color, delay, duration, left, top }) => {
  const [isPopped, setIsPopped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isPopped
          ? {
              opacity: 0,
              scale: 1.5,
              transition: { duration: 0.3 },
            }
          : {
              opacity: [0.7, 0.4, 0.7],
              scale: [1, 1.2, 1],
              y: [0, -15, 0],
            }
      }
      transition={
        isPopped
          ? {}
          : {
              repeat: Infinity,
              duration: duration,
              delay: delay,
              ease: "easeInOut",
            }
      }
      onClick={() => setIsPopped(true)}
      onAnimationComplete={() => {
        if (isPopped) {
          setTimeout(() => setIsPopped(false), 500);
        }
      }}
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(12px)",
        zIndex: 0,
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.2 }}
    />
  );
};

// Animated character that follows cursor for kids
const FollowingCharacter = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [character, setCharacter] = useState(0);
  const characters = ["🦸‍♀️", "🧙‍♂️", "🦊", "🐼", "🐶"];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: position.x - 25,
        y: position.y - 25,
      }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 50,
        restDelta: 0.001,
      }}
      style={{
        position: "fixed",
        zIndex: 999,
        fontSize: "50px",
        pointerEvents: "none",
      }}
      onClick={() => setCharacter((prev) => (prev + 1) % characters.length)}
    >
      {characters[character]}
    </motion.div>
  );
};

// Enhanced game card with interactive elements for kids
const GameCard = ({ game, isAccessible, navigate, userAgeGroup }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const showKidInteraction = userAgeGroup === "3-12";

  // Special animation for kids
  useEffect(() => {
    if (showKidInteraction) {
      const interval = setInterval(() => {
        if (game.ageGroup === userAgeGroup) {
          setIsWiggling(true);
          setTimeout(() => setIsWiggling(false), 1000);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [showKidInteraction, game, userAgeGroup]);

  const handleClick = () => {
    if (isAccessible) {
      setConfetti(true);
      setTimeout(() => {
        navigate(game.path);
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: isWiggling ? [0, -2, 2, -2, 0] : 0,
        scale: isWiggling ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: isWiggling ? 0.5 : 0.5,
        delay: game.id === "game1" ? 0.1 : game.id === "game2" ? 0.2 : 0.3,
      }}
      whileHover={isAccessible ? { y: -8, transition: { duration: 0.2 } } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ height: "100%" }}
      onClick={handleClick}
    >
      {confetti && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: "50%",
                y: "50%",
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * -100}%`,
                opacity: 0,
                scale: Math.random() * 1.5 + 0.5,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 0.8 }}
              style={{
                position: "absolute",
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                background: [
                  "#FF6B6B",
                  "#4ECDC4",
                  "#FFE66D",
                  "#1A535C",
                  "#FF9F1C",
                ][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              }}
            />
          ))}
        </Box>
      )}

      <Card
        elevation={6}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: userAgeGroup === "3-12" ? "30px" : 4, // Rounded corners for kids
          overflow: "hidden",
          opacity: isAccessible ? 1 : 0.8,
          position: "relative",
          transition: "box-shadow 0.3s, transform 0.3s",
          boxShadow:
            isHovered && isAccessible
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          transform:
            userAgeGroup === "3-12" && game.ageGroup === userAgeGroup
              ? "rotate(-2deg)"
              : "none",
          cursor: isAccessible ? "pointer" : "default",
          border:
            userAgeGroup === "3-12" && game.ageGroup === userAgeGroup
              ? "3px dashed #FFD700"
              : "none",
        }}
      >
        {!isAccessible && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(30,41,59,0.7)",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              textAlign: "center",
            }}
          >
            <motion.div
              animate={{
                rotateZ: [0, 10, -10, 0],
                scale: [1, 1.05, 0.95, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  p: 2,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                <LockIcon size={40} color="#6B7280" />
              </Box>
            </motion.div>
            <Typography
              variant="h6"
              color="white"
              sx={{ mt: 3, fontWeight: "bold" }}
            >
              {userAgeGroup === "3-12"
                ? "This game is not for you"
                : "Age Restricted"}
            </Typography>
            <Typography color="white" variant="body2" sx={{ mt: 1 }}>
              {userAgeGroup === "3-12"
                ? "Try the Body Smart Adventure instead!"
                : `This game is designed for the ${game.ageGroup} age group`}
            </Typography>
          </Box>
        )}

        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="180"
            image={game.image || "/game-placeholder.jpg"}
            alt={game.title}
          />
          <motion.div
            animate={
              isHovered && isAccessible
                ? {
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1.2, 1],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "50%",
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {game.emoji}
            </Box>
          </motion.div>

          {/* Special effects for kids UI */}
          {userAgeGroup === "3-12" && game.ageGroup === userAgeGroup && (
            <>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: 20,
                }}
              >
                <Typography variant="h3">👆</Typography>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  position: "absolute",
                  top: -15,
                  left: -15,
                  background: "#FFE066",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Play!
                </Typography>
              </motion.div>
            </>
          )}
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            p: 3,
            borderTop: `4px solid ${game.color}`,
            background:
              userAgeGroup === "3-12" && game.ageGroup === userAgeGroup
                ? "linear-gradient(to bottom, #ffffff, #f0f9ff)"
                : undefined,
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: userAgeGroup === "3-12" ? "1.5rem" : undefined,
            }}
          >
            {game.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              fontSize: userAgeGroup === "3-12" ? "1rem" : undefined,
            }}
          >
            {userAgeGroup === "3-12" && game.id === "game2"
              ? "Learn about your body in a fun adventure! Earn stars and badges as you play."
              : game.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#F3F4F6",
                borderRadius: 4,
                py: 0.5,
                px: 1.5,
              }}
            >
              <User2Icon size={16} color="#4B5563" />
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  fontWeight: 500,
                  color: "#4B5563",
                }}
              >
                Ages {game.ageGroup}
              </Typography>
            </Box>

            <motion.div
              whileHover={isAccessible ? { scale: 1.05 } : {}}
              whileTap={isAccessible ? { scale: 0.95 } : {}}
            >
              <Button
                variant="contained"
                startIcon={
                  userAgeGroup === "3-12" ? <Rocket /> : <GamepadIcon />
                }
                disabled={!isAccessible}
                onClick={() => {}}
                sx={{
                  bgcolor: game.color,
                  borderRadius: userAgeGroup === "3-12" ? 5 : 3,
                  px: 2,
                  py: userAgeGroup === "3-12" ? 1.5 : 1,
                  fontWeight: 600,
                  fontSize: userAgeGroup === "3-12" ? "1.1rem" : undefined,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  "&:hover": {
                    bgcolor: game.color,
                    filter: "brightness(0.9)",
                  },
                }}
              >
                {userAgeGroup === "3-12" ? "Start Adventure!" : "Play Now!"}
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Games = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAgeGroup, setUserAgeGroup] = useState(null);
  const [showCharacter, setShowCharacter] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);

        if (data?.date_of_birth) {
          const age = calculateAge(data.date_of_birth);
          const ageGroup = getAgeGroup(age);
          setUserAgeGroup(ageGroup);

          // Enable character follower for kids
          if (ageGroup === "3-12") {
            setShowCharacter(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const games = [
    {
      id: "game1",
      title: "Growing Up with Confidence",
      description:
        "Navigate through common scenarios related to puberty, relationships, and growing up. For teens aged 13-19.",
      image: "/game1-thumbnail.jpg",
      path: "/games/game1",
      ageGroup: "12-19",
      color: "#8B5CF6", // Purple
      emoji: "🚀",
    },
    {
      id: "game2",
      title: "Body Smart Adventure",
      description:
        "A fun and educational game about body safety, consent, and boundaries. Perfect for children aged 3-12.",
      image: "/game2-thumbnail.jpg",
      path: "/games/game2",
      ageGroup: "3-12",
      color: "#10B981", // Green
      emoji: "🦸",
    },
    {
      id: "game3",
      title: "Adult Life Choices",
      description:
        "Explore scenarios on family planning, relationships, and adult health topics. For adults aged 20-45.",
      image: "/game3-thumbnail.jpg",
      path: "/games/game3",
      ageGroup: "20-45",
      color: "#FFBF00", // Amber
      emoji: "🧭",
    },
    {
      id: "game4",
      title: "Safe Touch",
      description:
        "Learn about safe and unsafe touches through interactive scenarios. Designed for ages 3-12.",
      image: "/game4-thumbnail.jpg",
      path: "/games/game4",
      ageGroup: "3-12",
      color: "#FBBF24", // Yellow
      emoji: "🦸‍♂️",
    },
    {
      id: "game5",
      title: "Protection Match",
      description:
        "Match different types of protection with their uses in this fun and educational game for ages 20-45.",
      image: "/game5-thumbnail.jpg",
      path: "/games/game5",
      ageGroup: "20-45",
      color: "#FBBF24", // Yellow
      emoji: "🧭",
    },
    {
      id: "game6",
      title: "Body Parts Mystery Box",
      description:
        "Guess the body part in the mystery box based on clues and sounds. Fun for ages 3-12.",
      image: "/game6-thumbnail.jpg",
      path: "/games/game6",
      ageGroup: "3-12",
      color: "#FF6B6B", // Red
      emoji: "🦸‍♀️",
    },
  ];

  // Child-friendly loading animation
  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
          flexDirection: "column",
          alignItems: "center",
          height: "80vh",
        }}
      >
        {userAgeGroup === "3-12" ? (
          // Kid-friendly loading
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ fontSize: "100px" }}
            >
              🦸‍♂️
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="h4"
                sx={{ mt: 3, fontWeight: "bold", color: "#10B981" }}
              >
                Getting your games ready...
              </Typography>
            </motion.div>

            <Box sx={{ mt: 4, display: "flex" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-20, 0, -20],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                  style={{ marginRight: "10px", fontSize: "24px" }}
                >
                  ⭐
                </motion.div>
              ))}
            </Box>
          </Box>
        ) : (
          // Regular loading
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ position: "relative" }}>
              <CircularProgress sx={{ color: "#8B5CF6" }} size={60} />
              <motion.div
                animate={{
                  rotate: 360,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: "50%",
                  border: "3px solid #8B5CF6",
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
              />
            </Box>
          </motion.div>
        )}
      </Container>
    );
  }

  // Kid-friendly banned message
  if (profile?.is_banned) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert
            severity="error"
            variant="filled"
            icon={userAgeGroup === "3-12" ? <Heart /> : <AlertTriangle />}
            sx={{ py: 2, borderRadius: userAgeGroup === "3-12" ? 8 : 4 }}
          >
            <Typography variant="h6">
              {userAgeGroup === "3-12"
                ? "Oops! Looks like there's a little problem."
                : "Oh no! Your account has been suspended."}
            </Typography>
            <Typography>
              {userAgeGroup === "3-12"
                ? "Please ask a grown-up to help you fix this. They need to talk to our helpers."
                : "Please contact support for more information."}
            </Typography>
          </Alert>
        </motion.div>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background:
          userAgeGroup === "3-12"
            ? "linear-gradient(135deg, #AFF6D6 0%, #DBEAFE 50%, #F8E7FF 100%)"
            : "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #EDE9FE 100%)",
        minHeight: "100vh",
        pt: 4,
        pb: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Only show character follower for kids */}
      {showCharacter && <FollowingCharacter />}

      {/* Animated background bubbles */}
      <AnimatedBubble
        size={userAgeGroup === "3-12" ? "180px" : "150px"}
        color={
          userAgeGroup === "3-12"
            ? "rgba(16, 185, 129, 0.2)"
            : "rgba(139, 92, 246, 0.15)"
        }
        delay={0}
        duration={5}
        left={10}
        top={20}
      />
      <AnimatedBubble
        size={userAgeGroup === "3-12" ? "250px" : "200px"}
        color={
          userAgeGroup === "3-12"
            ? "rgba(139, 92, 246, 0.18)"
            : "rgba(16, 185, 129, 0.12)"
        }
        delay={1}
        duration={7}
        left={70}
        top={15}
      />
      <AnimatedBubble
        size={userAgeGroup === "3-12" ? "200px" : "180px"}
        color="rgba(245, 158, 11, 0.15)"
        delay={2}
        duration={6}
        left={25}
        top={60}
      />
      <AnimatedBubble
        size={userAgeGroup === "3-12" ? "160px" : "120px"}
        color="rgba(59, 130, 246, 0.2)"
        delay={0.5}
        duration={8}
        left={85}
        top={70}
      />
      <AnimatedBubble
        size={userAgeGroup === "3-12" ? "180px" : "160px"}
        color="rgba(139, 92, 246, 0.15)"
        delay={1.5}
        duration={9}
        left={50}
        top={40}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 8,
              position: "relative",
              py: 3,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                top: -20,
                left: "10%",
                transform: "rotate(-15deg)",
                display: { xs: "none", md: "block" },
              }}
            >
              <Star color="#FBBF24" size={40} strokeWidth={2} fill="#FBBF24" />
            </motion.div>

            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
                y: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                delay: 0.5,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                top: 10,
                right: "15%",
                display: { xs: "none", md: "block" },
              }}
            >
              <Trophy color="#8B5CF6" size={40} strokeWidth={2} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: userAgeGroup === "3-12" ? "#10B981" : "#4338CA",
                  textShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  mb: 2,
                  position: "relative",
                  display: "inline-block",
                  fontSize: userAgeGroup === "3-12" ? "3.5rem" : undefined,
                }}
              >
                {userAgeGroup === "3-12"
                  ? "Super Fun Games!"
                  : "Fun Learning Games!"}
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                    rotate:
                      userAgeGroup === "3-12" ? [0, 20, -20, 0] : [0, 0, 0, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: -15,
                    right: -35,
                  }}
                >
                  <Sparkles size={32} color="#FBBF24" />
                </motion.div>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: "#4B5563",
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: userAgeGroup === "3-12" ? "1.3rem" : undefined,
                }}
              >
                {userAgeGroup === "3-12"
                  ? "Click on your special game to start your adventure! Collect stars and have fun!"
                  : "Pick a game and start your adventure! Games are specially designed for your age group."}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {games.map((game) => {
            const isAccessible = game.ageGroup === userAgeGroup;

            return (
              <Grid item xs={12} sm={6} md={4} key={game.id}>
                <GameCard
                  game={game}
                  isAccessible={isAccessible}
                  navigate={navigate}
                  userAgeGroup={userAgeGroup}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Games;
