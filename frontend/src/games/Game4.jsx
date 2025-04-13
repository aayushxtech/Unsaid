import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  LinearProgress, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Grow,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Slide,
  Zoom,
  Snackbar,
  Alert,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Select,
  MenuItem
} from '@mui/material';
import { 
  ArrowBack, 
  EmojiEvents, 
  Help, 
  School, 
  Info, 
  Check, 
  Close, 
  ArrowForward,
  HealthAndSafety,
  Psychology,
  Forum,
  SentimentVerySatisfied,
  SentimentDissatisfied,
  Celebration,
  Warning,
  Favorite,
  Star,
  StarBorder,
  EmojiPeople,
  Spa,
  WbSunny,
  Nightlight,
  PlayArrow, 
  AccessTime, 
  Lock, 
  CheckCircle,
  TrendingUp,
  People,
  Devices
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import character images - Fix the missing image imports
// Check if these images exist in your public folder, if not, you'll need to add them
const swathiHappy = '/swathi_happy.jpg';
const swathiSad = '/swathi_sad.png';
const swathiAngry = '/swathi_angry.png';
const swathiConfused = '/swathi_confused.png';

// This contains all your story content
const storyContent = {
  0: {
    title: "Understanding Your Body",
    description: "Explore the amazing changes happening during puberty",
    icon: "Favorite",
    color: "#e91e63",
    image: "/story-body.jpg",
    difficulty: "Beginner",
    estimatedTime: "20 min",
    tags: ["Health", "Puberty", "Self-care"],
    scenes: [
      {
        id: 0,
        title: "Morning Surprises",
        content: "Swathi wakes up one morning to discover she has her period for the first time. She's heard about it in school but feels confused and a little scared about what to do next.",
        background: "bedroom",
        character: "swathi",
        emotion: "confused",
        dialog: "Oh! I think I just got my first period... I knew this would happen eventually, but I'm not sure what to do now. Should I talk to someone about this?",
        choices: [
          {
            text: "Talk to mom or a trusted adult right away",
            feedback: "Great choice! Talking to a trusted adult is the best first step when you experience something new about your body.",
            impact: { health: 10, confidence: 5, knowledge: 10 },
            eduTip: "Your first period is called menarche and is a normal part of puberty. It usually starts between ages 9-15.",
            nextScene: 1
          },
          {
            text: "Try to handle it yourself by looking online",
            feedback: "It's good to be resourceful, but for important health matters, it's better to talk to a trusted adult first. Online information can be helpful but sometimes confusing.",
            impact: { health: -5, confidence: 0, knowledge: 5 },
            eduTip: "While researching is good, make sure to use reliable sources like educational sites ending in .edu or .org",
            nextScene: 2
          },
          {
            text: "Feel embarrassed and try to hide it",
            feedback: "Many people feel embarrassed at first, but periods are a natural process. Hiding it might make you miss out on important support and information.",
            impact: { health: -10, confidence: -10, knowledge: 0 },
            eduTip: "About half the world's population experiences periods - it's completely normal and nothing to be ashamed of!",
            nextScene: 3
          }
        ]
      },
      // Add more scenes as needed
    ],
    achievements: [
      {
        id: "body_talk",
        title: "Body Talk",
        description: "Had an open conversation about body changes",
        icon: "Favorite",
        condition: "Completed scene 1"
      },
      {
        id: "knowledge_seeker",
        title: "Knowledge Seeker",
        description: "Learned important facts about puberty",
        icon: "School",
        condition: "Accumulated 50 knowledge points"
      }
    ],
  },
  1: {
    title: "Digital World Wisdom",
    description: "Navigate online safety, social media & screen time balance",
    icon: "Devices", // Use different MUI icons
    color: "#0288d1",
    image: "/story-digital.jpg", 
    difficulty: "Intermediate",
    estimatedTime: "25 min",
    tags: ["Technology", "Safety", "Wellbeing"],
    scenes: [
      // Scenes for this story
    ]
  },
  2: {
    title: "Emotional Intelligence",
    description: "Understand feelings, build resilience & manage stress",
    icon: "Psychology",
    color: "#009688",
    image: "/story-emotions.jpg",
    difficulty: "Advanced",
    estimatedTime: "30 min",
    tags: ["Mental Health", "Self-Care", "Growth"],
    scenes: [
      // Scenes for this story
    ]
  }
};

// Define a custom game theme with vibrant colors
const gameTheme = createTheme({
  palette: {
    primary: {
      main: '#7b1fa2',
      light: '#ae52d4',
      dark: '#4a0072',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    success: {
      main: '#00c853',
    },
    info: {
      main: '#2196f3',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f8f5fe',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Quicksand', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
          boxShadow: '0 4px 10px rgba(123, 31, 162, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(123, 31, 162, 0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ff4081 30%, #f50057 90%)',
          boxShadow: '0 4px 10px rgba(255, 64, 129, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(255, 64, 129, 0.4)',
          },
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      }
    },
  },
});

// Animation styles with enhanced effects
const animationStyles = {
  '@keyframes float': {
    '0%': {
      transform: 'translateY(0px) rotate(0deg)'
    },
    '50%': {
      transform: 'translateY(-10px) rotate(2deg)'
    },
    '100%': {
      transform: 'translateY(0px) rotate(0deg)'
    }
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(123, 31, 162, 0.4)'
    },
    '50%': {
      transform: 'scale(1.05)',
      boxShadow: '0 0 0 10px rgba(123, 31, 162, 0)'
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(123, 31, 162, 0)'
    }
  },
  '@keyframes shake': {
    '0%': { transform: 'translateX(0) rotate(0deg)' },
    '25%': { transform: 'translateX(5px) rotate(1deg)' },
    '50%': { transform: 'translateX(-5px) rotate(-1deg)' },
    '75%': { transform: 'translateX(5px) rotate(1deg)' },
    '100%': { transform: 'translateX(0) rotate(0deg)' }
  },
  '@keyframes glow': {
    '0%': { 
      boxShadow: '0 0 5px rgba(123, 31, 162, 0.5)',
      background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)'
    },
    '50%': { 
      boxShadow: '0 0 20px rgba(123, 31, 162, 0.8), 0 0 30px rgba(156, 39, 176, 0.6)',
      background: 'linear-gradient(45deg, #9c27b0 30%, #7b1fa2 90%)'
    },
    '100%': { 
      boxShadow: '0 0 5px rgba(123, 31, 162, 0.5)',
      background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)'
    }
  },
  '@keyframes rainbow': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  }
};

// Character avatars mapping
const characterAvatars = {
  swathi: '/assets/characters/swathi.png',
  mom: '/assets/characters/mom.png',
  teacher: '/assets/characters/teacher.png',
  friend: '/assets/characters/friend.png',
  counselor: '/assets/characters/counselor.png',
  relative: '/assets/characters/relative.png',
  parent: '/assets/characters/parent.png'
};

// Emotional states icons
const emotionIcons = {
  happy: <SentimentVerySatisfied sx={{ color: '#4caf50' }} />,
  sad: <SentimentDissatisfied sx={{ color: '#f44336' }} />,
  nervous: <Psychology sx={{ color: '#ff9800' }} />,
  confident: <EmojiPeople sx={{ color: '#2196f3' }} />,
  calm: <Spa sx={{ color: '#9c27b0' }} />
};

// Inside your Game4 component, add this object to map emotions to avatar images
const swathiEmotionImages = {
  happy: swathiHappy,
  sad: swathiSad,
  angry: swathiAngry,
  confused: swathiConfused,
  nervous: swathiConfused, // Reusing confused for nervous
  neutral: swathiHappy, // Default
  confident: swathiHappy
};

const Game4 = ({ onBack }) => {
  // Add navigation hook
  const navigate = useNavigate();
  
  // Game state with all required variables
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("Player");
  const [currentStory, setCurrentStory] = useState(-1); // Start with story selection
  const [currentScene, setCurrentScene] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlockedStories, setUnlockedStories] = useState([0]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', content: '', type: 'info' });
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [showTip, setShowTip] = useState(false);
  const [tipContent, setTipContent] = useState('');
  const [animationState, setAnimationState] = useState('idle');
  const [isFading, setIsFading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [characterEmotion, setCharacterEmotion] = useState('neutral');
  const [achievements, setAchievements] = useState([]);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [healthMeter, setHealthMeter] = useState(100);
  const [confidenceMeter, setConfidenceMeter] = useState(50);
  const [knowledgeMeter, setKnowledgeMeter] = useState(30);
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);
  const [characterDialogContent, setCharacterDialogContent] = useState('');
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [storyFilter, setStoryFilter] = useState('all');
  const [storySort, setStorySort] = useState('recommended');
  const [completedStories, setCompletedStories] = useState([]);
  const [storyProgress, setStoryProgress] = useState({
    0: 0.4,
    1: 0.2,
    2: 0,
    3: 0
  });
  const [avatarAnimation, setAvatarAnimation] = useState('idle');
  const [previousEmotion, setPreviousEmotion] = useState('neutral');
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmoji, setReactionEmoji] = useState('');
  
  const storyContainerRef = useRef(null);
  const choiceButtonsRef = useRef([]);

  // Effect to hide speech bubble after a delay
  useEffect(() => {
    if (gameStarted) {
      setShowSpeechBubble(false);
      return;
    }

    // Hide speech bubble after 5 seconds
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [gameStarted]);

  // Initialize default values
  useEffect(() => {
    setNewAchievement({
      icon: <Star sx={{ fontSize: 50, color: '#ffab00' }} />,
      title: 'Welcome',
      description: 'Started your journey of learning!'
    });
  }, []);

  // Replace the renderGameContent function with this enhanced version
const renderGameContent = () => {
  if (!gameStarted) {
    return renderStartScreen();
  }

  // If game has started, show story selection or current story
  if (currentStory === -1) {
    return renderStorySelection();
  } else {
    return renderStoryScene();
  }
};

// Add a proper start screen function
const renderStartScreen = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        px: 2,
      }}
    >
      {/* Animated background */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 0,
        background: darkMode ? 
          'linear-gradient(135deg, #141e30 0%, #243b55 100%)' : 
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        {/* Animated shapes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
              scale: Math.random() * 0.5 + 0.5
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror",
              duration: 15 + Math.random() * 20,
              ease: "easeInOut"
            }}
            style={{ 
              position: 'absolute',
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              borderRadius: Math.random() > 0.5 ? '50%' : '30%',
              background: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
              filter: 'blur(8px)',
              zIndex: 0
            }}
          />
        ))}
      </Box>

      {/* Main content */}
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 800, my: 4 }}>
        {/* Title animation */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography 
            variant="h1" 
            component="h1"
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              color: 'white',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              mb: 2
            }}
          >
            Teen Life Navigator
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              mb: 4,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            Join Swathi on an exciting journey through the challenges of growing up
          </Typography>
        </motion.div>

        {/* Character and dialog */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ 
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
                  width: { xs: 220, sm: 280 },
                  height: { xs: 220, sm: 280 },
                  border: '5px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Box
                  component="img"
                  src={swathiHappy}
                  alt="Swathi"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: showSpeechBubble ? 1 : 0 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              style={{ width: '100%' }}
            >
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  position: 'relative',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: { xs: '50%', md: -15 },
                    top: { xs: -15, md: '30%' },
                    transform: { xs: 'translateX(-50%) rotate(90deg)', md: 'translateY(-50%)' },
                    width: 0,
                    height: 0,
                    borderTop: '15px solid transparent',
                    borderBottom: '15px solid transparent',
                    borderRight: '20px solid rgba(255,255,255,0.9)',
                  }
                }}
              >
                <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                  Hey there! 👋
                </Typography>
                <Typography variant="body1">
                  I'm Swathi! Ready to explore the exciting (and sometimes confusing) world of growing up? I'll be your guide as we discover important things about your body, emotions, and relationships.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Start button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setGameStarted(true);
              setCurrentStory(-1); // Go to story selection
            }}
            startIcon={<PlayArrow />}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              animation: 'glow 2s infinite',
              '@keyframes glow': {
                '0%': { boxShadow: '0 0 10px rgba(123, 31, 162, 0.5)' },
                '50%': { boxShadow: '0 0 25px rgba(123, 31, 162, 0.8), 0 0 40px rgba(255, 64, 129, 0.6)' },
                '100%': { boxShadow: '0 0 10px rgba(123, 31, 162, 0.5)' },
              }
            }}
          >
            START ADVENTURE
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

// Add placeholder function for story selection screen
const renderStorySelection = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 5,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          py: 4,
          px: 2,
          background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.8) 0%, rgba(255, 0, 128, 0.8) 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: 'white',
              fontWeight: 800,
              mb: 1,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Your Learning Journey
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 700,
              mx: 'auto',
              mb: 3
            }}
          >
            Explore interactive stories that help you navigate the challenges of growing up
          </Typography>
          
          {/* Journey progress tracker */}
          <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'white' }}>Journey Progress</Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                Level {level}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(xp % 100)} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #FFD200, #FF0080)',
                  borderRadius: 5
                }
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {xp} XP
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {Math.ceil((level * 100) - xp)} XP to Level {level + 1}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>
      
      <Grid container spacing={3}>
        {Object.keys(storyContent).map((storyId) => {
          const story = storyContent[storyId];
          const isLocked = !unlockedStories.includes(Number(storyId));
          
          return (
            <Grid item xs={12} sm={6} md={4} key={storyId}>
              <motion.div
                whileHover={!isLocked ? { 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 } 
                } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: Number(storyId) * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <Card 
                  elevation={isLocked ? 1 : 3}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    filter: isLocked ? 'grayscale(0.8) brightness(0.7)' : 'none',
                    transition: 'all 0.3s ease',
                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
                    border: isLocked ? 'none' : `2px solid ${story.color}40`,
                  }}
                >
                  <Box sx={{ 
                    height: 140, 
                    bgcolor: story.color || "#9c27b0",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center' 
                  }}>
                    {story.icon === "Favorite" && <Favorite sx={{ fontSize: 50, color: 'white' }} />}
                    {story.icon === "Devices" && <Devices sx={{ fontSize: 50, color: 'white' }} />}
                    {story.icon === "Psychology" && <Psychology sx={{ fontSize: 50, color: 'white' }} />}
                  </Box>
                  
                  {isLocked && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <Lock sx={{ fontSize: 40, color: 'white' }} />
                      <Typography color="white" variant="body2" sx={{ mt: 1 }}>
                        Unlock at Level {Number(storyId) + 1}
                      </Typography>
                    </Box>
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {story.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {story.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                      {story.tags?.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            opacity: isLocked ? 0.5 : 0.9,
                            '& .MuiChip-label': { fontSize: '0.7rem' }
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ mt: 'auto', display: 'flex', gap: 2, alignItems: 'center', color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="caption">
                          {story.estimatedTime || "15 min"}
                        </Typography>
                      </Box>
                      
                      <Typography variant="caption" sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        bgcolor: story.difficulty === 'Beginner' ? '#e8f5e9' : 
                                story.difficulty === 'Intermediate' ? '#fff8e1' : 
                                '#ffebee',
                        color: story.difficulty === 'Beginner' ? '#2e7d32' : 
                              story.difficulty === 'Intermediate' ? '#f57f17' : 
                              '#c62828'
                      }}>
                        {story.difficulty || "Beginner"}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardContent sx={{ pt: 0 }}>
                    <Button 
                      variant="contained"
                      fullWidth
                      disabled={isLocked}
                      onClick={() => {
                        setCurrentStory(Number(storyId));
                        setCurrentScene(0);
                      }}
                      startIcon={<PlayArrow />}
                      sx={{
                        py: 1.2,
                        background: isLocked ? 'transparent' : 
                                  `linear-gradient(45deg, ${story.color}CC, ${story.color})`,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${story.color}, ${story.color}CC)`,
                        }
                      }}
                    >
                      Start Story
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

// Add placeholder function for story scene screen
const renderStoryScene = () => {
  const story = storyContent[currentStory];
  const scene = story?.scenes && story.scenes[currentScene];
  
  if (!story || !scene) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Story content not found</Typography>
        <Button 
          variant="contained"
          onClick={() => setCurrentStory(-1)}
          startIcon={<ArrowBack />}
        >
          Back to Story Selection
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ py: 3 }}>
      {/* Story header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => setCurrentStory(-1)}
          size="small"
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {story.title}
        </Typography>
      </Box>
      
      {/* Character attributes */}
      {renderAttributeMeters()}
      
      {/* Scene content */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Small visual indicator of story type */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: 40, 
          height: 40, 
          background: story.color,
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
        }} />
        
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          {scene.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
          {scene.content}
        </Typography>
      </Paper>
      
      {/* Character dialog */}
      {scene.dialog && (
        <Box sx={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          mb: 4,
        }}>
          <Avatar 
            src={swathiEmotionImages[scene.emotion || 'neutral']} 
            alt="Swathi"
            sx={{ 
              width: 60,
              height: 60,
              border: '3px solid white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          />
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              maxWidth: 'calc(100% - 80px)',
              position: 'relative',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
              '&:before': {
                content: '""',
                position: 'absolute',
                left: -10,
                top: 20,
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderRight: darkMode ? '10px solid rgba(255,255,255,0.1)' : '10px solid white'
              }
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              {scene.dialog}
            </Typography>
          </Paper>
        </Box>
      )}
      
      {/* Choice label */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          display: 'inline-block'
        }}
      >
        What will you do?
      </Typography>
      
      {/* Choices */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {scene.choices && scene.choices.map((choice, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => handleChoiceSelected(choice)}
              sx={{
                py: 2,
                px: 3,
                textAlign: 'left',
                justifyContent: 'flex-start',
                borderRadius: 2,
                background: `linear-gradient(45deg, ${story.color}CC, ${story.color})`,
                boxShadow: `0 4px 12px ${story.color}40`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${story.color}, ${story.color}CC)`,
                  boxShadow: `0 6px 16px ${story.color}60`,
                }
              }}
            >
              {choice.text}
            </Button>
          </motion.div>
        ))}
      </Box>
      
      {/* Educational tip button */}
      {scene.eduTip && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Info />}
            onClick={() => showEducationalTip(scene.eduTip)}
            sx={{ borderRadius: 30 }}
          >
            Did You Know?
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Add a simple choice handler
const handleChoiceSelected = (choice) => {
  // Show feedback dialog
  setDialogContent({
    title: 'Feedback',
    content: choice.feedback || 'Good choice!',
    type: 'success'
  });
  setShowDialog(true);
  
  // Apply impacts
  if (choice.impact) {
    if (choice.impact.health) setHealthMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.health)));
    if (choice.impact.confidence) setConfidenceMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.confidence)));
    if (choice.impact.knowledge) setKnowledgeMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.knowledge)));
    
    // Award XP for good choices
    const totalImpact = (choice.impact.health || 0) + (choice.impact.confidence || 0) + (choice.impact.knowledge || 0);
    if (totalImpact > 0) {
      const xpGained = Math.floor(totalImpact * 2);
      setXp(prev => prev + xpGained);
      
      // Check for level up
      const newLevel = Math.floor((xp + xpGained) / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setShowConfetti(true);
        setNotification({
          show: true,
          message: `Level Up! You're now level ${newLevel}!`,
          type: 'success'
        });
        
        // Unlock new stories with level ups
        if (newLevel <= 3 && !unlockedStories.includes(newLevel - 1)) {
          setUnlockedStories(prev => [...prev, newLevel - 1]);
        }
      }
    }
  }
  
  // Show educational tip if available
  if (choice.eduTip) {
    setTimeout(() => {
      setTipContent(choice.eduTip);
      setShowTip(true);
    }, 1000);
  }
  
  // Move to next scene
  if (choice.nextScene !== undefined) {
    setTimeout(() => {
      setCurrentScene(choice.nextScene);
    }, 1500);
  }
};

// Add this function to show educational tips
const showEducationalTip = (tip) => {
  setTipContent(tip);
  setShowTip(true);
};

// Add this function to handle attribute meters
const renderAttributeMeters = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HealthAndSafety color="error" fontSize="small" /> Health
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={healthMeter} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: 'rgba(244, 67, 54, 0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#f44336',
              }
            }} 
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Psychology color="primary" fontSize="small" /> Confidence
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={confidenceMeter} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: 'rgba(33, 150, 243, 0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#2196f3',
              }
            }} 
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <School color="success" fontSize="small" /> Knowledge
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={knowledgeMeter} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: 'rgba(76, 175, 80, 0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#4caf50',
              }
            }} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// Add functions to handle character avatar and dialog
const renderCharacterAvatar = () => {
  return null; // Simplified for now
};

const renderCharacterDialog = () => {
  if (!showCharacterDialog) return null;

  return (
    <Fade in={showCharacterDialog}>
      <Box 
        sx={{ 
          position: 'fixed',
          bottom: 100,
          right: 30,
          zIndex: 1000,
          maxWidth: 300,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'white',
            '&:before': {
              content: '""',
              position: 'absolute',
              right: -10,
              bottom: 20,
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderLeft: '10px solid white'
            }
          }}
        >
          <Typography variant="body1">
            {characterDialogContent}
          </Typography>
          <Button
            size="small"
            onClick={() => setShowCharacterDialog(false)}
            sx={{ mt: 1, float: 'right', minWidth: 'auto' }}
          >
            <Close fontSize="small" />
          </Button>
        </Paper>
        
        <Avatar
          src={swathiEmotionImages[characterEmotion || 'neutral']}
          alt="Swathi"
          sx={{ 
            width: 60,
            height: 60,
            border: '3px solid white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        />
      </Box>
    </Fade>
  );
};

// Add function to handle achievement popup
const renderAchievementPopup = () => {
  if (!showAchievementPopup || !newAchievement) return null;

  return (
    <Zoom in={showAchievementPopup}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1500,
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          textAlign: 'center'
        }}
      >
        <Box sx={{ mb: 2 }}>
          {newAchievement.icon}
        </Box>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
          Achievement Unlocked!
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          {newAchievement.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {newAchievement.description}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setShowAchievementPopup(false)}
        >
          Awesome!
        </Button>
      </Box>
    </Zoom>
  );
};

// Add this function to handle game exit
const handleExitGame = () => {
  onBack();
};

// Add this function to go to story selection
const goToStorySelection = () => {
  setCurrentStory(-1);
};

  // Simple dialog renderer
  const renderDialogs = () => {
    return (
      <>
        {/* Feedback Dialog */}
        <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle sx={{ 
            bgcolor: dialogContent.type === 'success' ? '#e8f5e9' : 
                   dialogContent.type === 'warning' ? '#fff8e1' : 
                   dialogContent.type === 'error' ? '#ffebee' : '#e3f2fd',
            color: dialogContent.type === 'success' ? '#2e7d32' : 
                  dialogContent.type === 'warning' ? '#f57f17' : 
                  dialogContent.type === 'error' ? '#c62828' : '#1565c0',
          }}>
            {dialogContent.title}
          </DialogTitle>
          <DialogContent dividers>
            <Typography>{dialogContent.content}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Got it!</Button>
          </DialogActions>
        </Dialog>

        {/* Educational Tip Dialog */}
        <Dialog open={showTip} onClose={() => setShowTip(false)}>
          <DialogTitle sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School />
              <Typography>Educational Tip</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ my: 1 }}>{tipContent}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTip(false)}>
              Thanks for the tip!
            </Button>
          </DialogActions>
        </Dialog>

        {/* Achievement notification */}
        <Snackbar
          open={notification.show}
          autoHideDuration={4000}
          onClose={() => setNotification({...notification, show: false})}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity={notification.type} 
            sx={{ width: '100%' }}
            onClose={() => setNotification({...notification, show: false})}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </>
    );
  };

  // Return with full ThemeProvider applied
  return (
    <ThemeProvider theme={gameTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: darkMode ? '#121212' : '#f8f5fe',
        color: darkMode ? 'white' : 'inherit',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* Header with navigation and dark mode toggle */}
        <Box sx={{ 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 10
        }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleExitGame}
            variant="outlined"
            size="small"
          >
            Exit Game
          </Button>
          
          {/* Show player stats when game started */}
          {gameStarted && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Tooltip title="Experience Points">
                <Chip 
                  icon={<School fontSize="small" />} 
                  label={`${xp} XP`}
                  size="small"
                  sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }}
                />
              </Tooltip>
              
              <Tooltip title="Current Level">
                <Chip 
                  icon={<Star fontSize="small" sx={{ color: '#ffc107' }} />} 
                  label={`Level ${level}`}
                  size="small"
                  sx={{ bgcolor: '#fff8e1', color: '#ff6d00' }}
                />
              </Tooltip>
            </Box>
          )}
          
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <WbSunny /> : <Nightlight />}
          </IconButton>
        </Box>
        
        {/* Main content */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          <Container sx={{ py: 2, flexGrow: 1 }}>
            {renderGameContent()}
          </Container>
        </Box>
        
        {/* Dialogs and floating elements */}
        {renderDialogs()}
        {renderCharacterDialog()}
        {renderAchievementPopup()}
      </Box>
    </ThemeProvider>
  );
};

export default Game4;