import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import getAgeGroup from "../lib/ageGroup";
import calculateAge from "../lib/calculateAge";
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
  Container
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
  Nightlight
} from '@mui/icons-material';

// Add these imports for animation
import { motion, AnimatePresence } from 'framer-motion';

// Add this to your existing imports at the top of your file
import swathiHappy from '/swathi_happy.png';
import swathiSad from '/swathi_sad.png'; 
import swathiAngry from '/swathi_angry.png';
import swathiConfused from '/swathi_confused.png';

// Move the storyContent definition above the Game4 component

// This contains all your story content
export const storyContent = {
  0: { // Story 0: Understanding Your Body
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
        title: "Growing Up",
        content: "Swathi is feeling confused about the changes happening to her body. Her friends seem to be experiencing similar changes, but no one talks about it openly.",
        background: "bedroom",
        character: "swathi",
        emotion: "nervous",
        dialog: "I've noticed some changes in my body lately. My mom mentioned puberty, but I'm not sure what to expect.",
        choices: [
          {
            text: "Talk to mom about puberty",
            nextScene: 1,
            impact: { health: 5, confidence: 10, knowledge: 15 },
            feedback: "Great choice! Talking to a trusted adult is always helpful when you have questions about your body."
          },
          {
            text: "Research online for information",
            nextScene: 2,
            impact: { health: 0, confidence: 5, knowledge: 10 },
            feedback: "While the internet can provide helpful information, make sure to use trusted sources and remember that talking to adults you trust is still important."
          },
          {
            text: "Ignore the changes and hope they go away",
            nextScene: 3,
            impact: { health: -5, confidence: -10, knowledge: -5 },
            feedback: "It's natural to feel shy about these topics, but ignoring the changes won't make them go away. Learning about your body is important for your health."
          }
        ],
        eduTip: "Puberty typically begins between ages 8-13 for girls and 9-14 for boys, but everyone's timeline is different. Changes are normal and healthy."
      },
      {
        id: 1,
        title: "Talking with Mom",
        content: "Swathi decides to talk to her mother about the changes she's noticing.",
        background: "livingroom",
        character: "mom",
        emotion: "calm",
        dialog: "I'm glad you came to talk to me, Swathi. Puberty is a natural part of growing up, and everyone goes through it. Let's discuss what you might experience.",
        choices: [
          {
            text: "Ask about physical changes",
            nextScene: 4,
            impact: { health: 5, confidence: 5, knowledge: 15 },
            feedback: "Good question! Understanding physical changes helps you prepare for what's coming."
          },
          {
            text: "Ask about emotional changes",
            nextScene: 5,
            impact: { health: 5, confidence: 10, knowledge: 10 },
            feedback: "Excellent! Emotional changes are just as important to understand as physical ones."
          },
          {
            text: "Ask about hygiene practices",
            nextScene: 6,
            impact: { health: 10, confidence: 5, knowledge: 10 },
            feedback: "Great thinking! Good hygiene practices become even more important during puberty."
          }
        ],
        eduTip: "Open communication with trusted adults helps build a support system as you navigate changes in your life."
      },
      {
        id: 3,
        title: "Avoiding the Topic",
        content: "Swathi decides to ignore the changes happening to her body, hoping they will just go away.",
        background: "bedroom",
        character: "swathi",
        emotion: "sad",
        dialog: "Maybe if I don't think about these changes, they'll stop happening. I don't want to talk about embarrassing things.",
        choices: [
          {
            text: "Talk to mom anyway",
            nextScene: 1,
            impact: { health: 5, confidence: 5, knowledge: 10 },
            feedback: "It's okay to change your mind! Talking to a trusted adult is a good decision."
          },
          {
            text: "Ask a friend instead",
            nextScene: 7,
            impact: { health: 0, confidence: 5, knowledge: 5 },
            feedback: "Friends can be supportive, but they might not have all the right information. Consider also talking to a trusted adult."
          },
          {
            text: "Continue ignoring it",
            nextScene: 8,
            impact: { health: -10, confidence: -15, knowledge: -5 },
            feedback: "Avoiding important health topics can lead to anxiety and missing out on important information. It's always better to learn about your changing body."
          }
        ],
        eduTip: "Many young people feel embarrassed about puberty, but knowledge is important for health. Everyone goes through these changes, and they're completely normal."
      },
      {
        id: 4,
        title: "Physical Changes",
        content: "Swathi's mom explains the physical changes that happen during puberty.",
        background: "livingroom",
        character: "mom",
        emotion: "calm",
        dialog: "During puberty, your body will develop in many ways. You'll grow taller, develop breasts, grow hair in new places, and eventually start menstruation. All of these changes are normal and happen to everyone.",
        choices: [
          {
            text: "Ask about menstruation",
            nextScene: 9,
            impact: { health: 10, confidence: 5, knowledge: 15 },
            feedback: "Great question! Understanding menstruation helps you prepare for this normal part of growing up."
          },
          {
            text: "Ask about body odor and hygiene",
            nextScene: 6,
            impact: { health: 10, confidence: 5, knowledge: 10 },
            feedback: "Good thinking! Hygiene becomes even more important during puberty."
          },
          {
            text: "Ask if these changes happen to everyone",
            nextScene: 10,
            impact: { health: 5, confidence: 15, knowledge: 10 },
            feedback: "That's a thoughtful question! Understanding that everyone goes through similar changes can help you feel less alone."
          }
        ],
        eduTip: "Physical changes during puberty happen to everyone, but the timing and pace vary from person to person. There's no 'right' way or timeline for development."
      }
      // Additional scenes could be added here
    ],
    achievements: [
      {
        id: "body_talk",
        title: "Body Talk",
        description: "Had an open conversation about body changes",
        icon: "Favorite",
        condition: "Completed scene 1",
      },
      {
        id: "knowledge_seeker",
        title: "Knowledge Seeker",
        description: "Learned important facts about puberty",
        icon: "School",
        condition: "Accumulated 50 knowledge points",
      },
    ],
    quiz: {
      title: "Understanding Your Body",
      questions: [
        {
          question: "When does puberty typically begin?",
          options: [
            "Ages 5-8",
            "Ages 8-14",
            "Ages 16-18",
            "Ages 20-22"
          ],
          correctAnswer: 1,
          explanation: "Puberty typically begins between ages 8-13 for girls and 9-14 for boys, though the exact timing varies for everyone."
        },
        {
          question: "Which of these is NOT a typical physical change during puberty?",
          options: [
            "Growth spurts",
            "Voice changes",
            "Hair growth in new places",
            "Shrinking in height"
          ],
          correctAnswer: 3,
          explanation: "During puberty, people experience growth spurts (getting taller), not shrinking in height."
        }
        // More quiz questions...
      ]
    }
  },
  // Other stories would be defined here...
  1: {
    title: "Learning Boundaries",
    description: "Explore personal boundaries and consent",
    icon: "Psychology",
    color: "#0288d1",
    image: "/story-digital.jpg", 
    difficulty: "Intermediate",
    estimatedTime: "25 min",
    tags: ["Technology", "Safety", "Wellbeing"],
    scenes: [
      {
        id: 0,
        title: "Understanding Boundaries",
        content: "Swathi is learning about personal boundaries and when it's okay to say 'no'.",
        background: "school",
        character: "swathi",
        emotion: "nervous",
        dialog: "I've noticed some changes in my body lately. My mom mentioned puberty, but I'm not sure what to expect.",
        choices: [
          {
            text: "Talk to mom about puberty",
            nextScene: 1,
            impact: { health: 5, confidence: 10, knowledge: 15 },
            feedback: "Great choice! Talking to a trusted adult is always helpful when you have questions about your body."
          },
          {
            text: "Research online for information",
            nextScene: 2,
            impact: { health: 0, confidence: 5, knowledge: 10 },
            feedback: "While the internet can provide helpful information, make sure to use trusted sources and remember that talking to adults you trust is still important."
          },
          {
            text: "Ignore the changes and hope they go away",
            nextScene: 3,
            impact: { health: -5, confidence: -10, knowledge: -5 },
            feedback: "It's natural to feel shy about these topics, but ignoring the changes won't make them go away. Learning about your body is important for your health."
          }
        ],
        eduTip: "Puberty typically begins between ages 8-13 for girls and 9-14 for boys, but everyone's timeline is different. Changes are normal and healthy."
      }
    ]
  }
};

// Define a custom game theme with vibrant colors
const gameTheme = createTheme({
  palette: {
    primary: {
      main: "#7b1fa2",
      light: "#ae52d4",
      dark: "#4a0072",
    },
    secondary: {
      main: "#ff4081",
      light: "#ff79b0",
      dark: "#c60055",
    },
    success: {
      main: "#00c853",
    },
    info: {
      main: "#2196f3",
    },
    warning: {
      main: "#ff9800",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f8f5fe",
      paper: "#ffffff",
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
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)",
          boxShadow: "0 4px 10px rgba(123, 31, 162, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 15px rgba(123, 31, 162, 0.4)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #ff4081 30%, #f50057 90%)",
          boxShadow: "0 4px 10px rgba(255, 64, 129, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 15px rgba(255, 64, 129, 0.4)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: "hidden",
        },
      },
    },
  },
});

// Animation styles with enhanced effects
const animationStyles = {
  "@keyframes float": {
    "0%": {
      transform: "translateY(0px) rotate(0deg)",
    },
    "50%": {
      transform: "translateY(-10px) rotate(2deg)",
    },
    "100%": {
      transform: "translateY(0px) rotate(0deg)",
    },
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 0 rgba(123, 31, 162, 0.4)",
    },
    "50%": {
      transform: "scale(1.05)",
      boxShadow: "0 0 0 10px rgba(123, 31, 162, 0)",
    },
    "100%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 0 rgba(123, 31, 162, 0)",
    },
  },
  "@keyframes shake": {
    "0%": { transform: "translateX(0) rotate(0deg)" },
    "25%": { transform: "translateX(5px) rotate(1deg)" },
    "50%": { transform: "translateX(-5px) rotate(-1deg)" },
    "75%": { transform: "translateX(5px) rotate(1deg)" },
    "100%": { transform: "translateX(0) rotate(0deg)" },
  },
  "@keyframes glow": {
    "0%": {
      boxShadow: "0 0 5px rgba(123, 31, 162, 0.5)",
      background: "linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)",
    },
    "50%": {
      boxShadow:
        "0 0 20px rgba(123, 31, 162, 0.8), 0 0 30px rgba(156, 39, 176, 0.6)",
      background: "linear-gradient(45deg, #9c27b0 30%, #7b1fa2 90%)",
    },
    "100%": {
      boxShadow: "0 0 5px rgba(123, 31, 162, 0.5)",
      background: "linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)",
    },
  },
  "@keyframes rainbow": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
};

// Character avatars mapping
const characterAvatars = {
  swathi: "/assets/characters/swathi.png",
  mom: "/assets/characters/mom.png",
  teacher: "/assets/characters/teacher.png",
  friend: "/assets/characters/friend.png",
  counselor: "/assets/characters/counselor.png",
  relative: "/assets/characters/relative.png",
  parent: "/assets/characters/parent.png",
};

// Emotional states icons
const emotionIcons = {
  happy: <SentimentVerySatisfied sx={{ color: "#4caf50" }} />,
  sad: <SentimentDissatisfied sx={{ color: "#f44336" }} />,
  nervous: <Psychology sx={{ color: "#ff9800" }} />,
  confident: <EmojiPeople sx={{ color: "#2196f3" }} />,
  calm: <Spa sx={{ color: "#9c27b0" }} />,
};

// Inside your Game4 component, add this object to map emotions to avatar images
const swathiEmotionImages = {
  happy: swathiHappy,
  sad: swathiSad,
  angry: swathiAngry,
  confused: swathiConfused,
  nervous: swathiConfused, // Reusing confused for nervous
  neutral: swathiHappy, // Default
  confident: swathiHappy,
};

// Add authorization check at the beginning of the Game4 component
const Game4 = ({ onBack }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("Swathi");
  const [currentStory, setCurrentStory] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [unlockedStories, setUnlockedStories] = useState([0]);
  const [playerName, setPlayerName] = useState("Swathi");

  // Character states
  const [healthMeter, setHealthMeter] = useState(100);
  const [confidenceMeter, setConfidenceMeter] = useState(50);
  const [knowledgeMeter, setKnowledgeMeter] = useState(30);
  const [characterEmotion, setCharacterEmotion] = useState("neutral");
  const [avatarAnimation, setAvatarAnimation] = useState("idle");
  const [previousEmotion, setPreviousEmotion] = useState("neutral");

  // UI states
  const [darkMode, setDarkMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);
  const [characterDialogContent, setCharacterDialogContent] = useState('');
  
  const storyContainerRef = useRef(null);
  const choiceButtonsRef = useRef([]);

  // Add this useEffect to initialize default values
  useEffect(() => {
    // Set default achievement to prevent null reference issues
    setNewAchievement({
      icon: <Star sx={{ fontSize: 50, color: '#ffab00' }} />,
      title: 'Welcome',
      description: 'Started your journey of learning!'
    });
    
    // Initialize unlockedStories with at least the first story
    setUnlockedStories([0]);
  }, []);

  // Add these state variables for animation
  const [avatarAnimation, setAvatarAnimation] = useState('idle');
  // This line is removed to fix the duplicate declaration
  // const [previousEmotion, setPreviousEmotion] = useState('neutral');
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmoji, setReactionEmoji] = useState('');

  // Game mechanics enhanced with particle effects
  const createParticleEffect = (x, y, color = '#ff4081') => {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.left = `${x}px`;
    particleContainer.style.top = `${y}px`;
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = 9999;
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 6 + 4}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.opacity = Math.random() * 0.5 + 0.5;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 100 + 50;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      const animate = () => {
        const x = parseFloat(particle.style.left || '0');
        const y = parseFloat(particle.style.top || '0');
        const opacity = parseFloat(particle.style.opacity);
        
        if (opacity <= 0.1) {
          particleContainer.removeChild(particle);
          return;
        }
        
        particle.style.left = `${x + vx * 0.01}px`;
        particle.style.top = `${y + vy * 0.01}px`;
        particle.style.opacity = `${opacity - 0.01}`;
        
        requestAnimationFrame(animate);
      };
      
      particleContainer.appendChild(particle);
      requestAnimationFrame(animate);
    }
    
    setTimeout(() => {
      document.body.removeChild(particleContainer);
    }, 2000);
  };

  // Track scenario impact on character attributes
  const updateCharacterAttributes = (choice) => {
    if (!choice.impact) return;
    
    if (choice.impact.health) {
      setHealthMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.health)));
    }
    
    if (choice.impact.confidence) {
      setConfidenceMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.confidence)));
    }
    
    if (choice.impact.knowledge) {
      setKnowledgeMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.knowledge)));
    }
    
    // Update character emotion based on attributes
    updateCharacterEmotion();
  };
  
  // Update character's emotional state based on attributes
  const updateCharacterEmotion = () => {
    if (healthMeter < 30) {
      setCharacterEmotion('sad');
    } else if (confidenceMeter > 70) {
      setCharacterEmotion('confident');
    } else if (knowledgeMeter > 70) {
      setCharacterEmotion('calm');
    } else if (healthMeter > 70 && confidenceMeter > 50) {
      setCharacterEmotion('happy');
    } else if (confidenceMeter < 30) {
      setCharacterEmotion('nervous');
    } else {
      setCharacterEmotion('neutral');
    }
  };

  // Other functions remain largely the same, with visual enhancements...

  // Render the character attribute meters
  const renderAttributeMeters = () => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 2,
        mb: 3,
        mt: 2,
        justifyContent: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
          <Favorite sx={{ color: '#f44336' }} />
          <LinearProgress 
            variant="determinate" 
            value={healthMeter} 
            sx={{ 
              flexGrow: 1,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#f44336',
                borderRadius: 5,
              }
            }}
          />
          <Typography variant="caption" fontWeight="bold">{healthMeter}%</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
          <EmojiPeople sx={{ color: '#ff9800' }} />
          <LinearProgress 
            variant="determinate" 
            value={confidenceMeter}
            sx={{ 
              flexGrow: 1,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255, 152, 0, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ff9800',
                borderRadius: 5,
              }
            }}
          />
          <Typography variant="caption" fontWeight="bold">{confidenceMeter}%</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
          <School sx={{ color: '#2196f3' }} />
          <LinearProgress 
            variant="determinate" 
            value={knowledgeMeter}
            sx={{ 
              flexGrow: 1,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#2196f3',
                borderRadius: 5,
              }
            }}
          />
          <Typography variant="caption" fontWeight="bold">{knowledgeMeter}%</Typography>
        </Box>
      </Box>
    );
  };

  // Render a character dialog bubble
  // Fix character dialog renderer to handle missing avatars
  const renderCharacterDialog = () => {
    if (!showCharacterDialog) return null;
    
    // Default avatar fallback
    const avatarUrl = characterAvatars['swathi'] || 'https://via.placeholder.com/40';
    
    return (
      <Fade in={showCharacterDialog}>
        <Box 
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 400,
            zIndex: 1000,
            p: 0
          }}
        >
          <Box sx={{
            position: 'relative',
            bgcolor: darkMode ? '#1a2035' : 'white',
            color: darkMode ? 'white' : 'inherit',
            p: 2,
            pt: 3,
            borderRadius: 3,
            boxShadow: 3,
            border: '2px solid #9c27b0',
            '&:before': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #9c27b0',
            }
          }}>
            <Avatar 
              src={avatarUrl}
              alt="Swathi"
              sx={{ 
                position: 'absolute',
                top: -20,
                left: 10,
                width: 40,
                height: 40,
                border: '2px solid white',
                boxShadow: 2,
                bgcolor: '#9c27b0'
              }}
            >
              S
            </Avatar>
            <Typography variant="body1">{characterDialogContent}</Typography>
            <IconButton 
              size="small"
              onClick={() => setShowCharacterDialog(false)}
              sx={{
                position: 'absolute',
                top: 2,
                right: 2
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Fade>
    );
  };

  // Fix the renderAchievementPopup function to properly handle null newAchievement
  const renderAchievementPopup = () => {
    if (!showAchievementPopup || !newAchievement) return null;
    
    return (
      <Fade in={showAchievementPopup}>
        <Box 
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            width: 350,
            p: 0
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
              color: 'white',
              textAlign: 'center',
              animation: 'glow 2s infinite',
              '@keyframes glow': animationStyles['@keyframes glow']
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1, 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)' 
              }}
            >
              Achievement Unlocked!
            </Typography>
            
            <Box 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                my: 2,
                boxShadow: '0 0 20px rgba(255,255,255,0.5)'
              }}
            >
              {newAchievement?.icon || <Star sx={{ fontSize: 50, color: '#ffab00' }} />}
            </Box>
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {newAchievement?.title || 'Achievement'}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                my: 1, 
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {newAchievement?.description || 'You earned a new achievement!'}
            </Typography>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowAchievementPopup(false)}
              sx={{
                mt: 2,
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 30,
                px: 3,
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Awesome!
            </Button>
          </Paper>
        </Box>
      </Fade>
    );
  };

  // Handle exit game
  const handleExitGame = () => {
    // Use the navigate function to redirect to the home page
    navigate('/');
  };

  // Go to story selection
  const goToStorySelection = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentStory(-1);
      setIsFading(false);
    }, 500);
  };

  // Add missing renderGameContent function
  const renderGameContent = () => {
    if (!gameStarted) {
      return renderStartScreen();
    }
  
    if (currentStory === -1) {
      return renderStorySelection();
    }
  
    // If we have story content, render the scene
    return renderSceneContent();
  };
  
  // Replace the current renderStartScreen function with this enhanced version

const renderStartScreen = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
        overflow: 'hidden',
        borderRadius: 8,
        bgcolor: darkMode ? 'rgba(0,0,0,0.5)' : 'transparent',
      }}
    >
      {/* Dynamic animated background */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        overflow: 'hidden', 
        zIndex: 0,
        background: darkMode ? 
          'linear-gradient(135deg, #170b2a 0%, #27104e 100%)' : 
          'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      }}>
        {/* Animated floating shapes */}
        {Array.from({ length: 30 }).map((_, i) => (
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
              width: Math.random() * 60 + 40,
              height: Math.random() * 60 + 40,
              borderRadius: Math.random() > 0.5 ? '50%' : Math.random() > 0.5 ? '30%' : '0%',
              background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.2 + 0.1})`,
              filter: 'blur(40px)',
              zIndex: 0
            }}
          />
        ))}
        
        {/* Animated gradient overlay */}
        <motion.div
          initial={{ backgroundPosition: '0% 0%' }}
          animate={{ backgroundPosition: '100% 100%' }}
          transition={{ 
            repeat: Infinity,
            repeatType: "mirror",
            duration: 10,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(156, 39, 176, 0.2) 70%, rgba(156, 39, 176, 0.3) 100%)',
            zIndex: 0
          }}
        />
      </Box>

      {/* Content Container to prevent overlapping */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 5 }}>
        {/* Header Section with Title Animation */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                fontWeight: 900, 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                color: darkMode ? '#e1bee7' : '#7b1fa2',
                textShadow: darkMode ? '0 0 20px rgba(156, 39, 176, 0.5)' : '2px 2px 4px rgba(0,0,0,0.1)',
                mb: 1,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                background: 'linear-gradient(45deg, #7b1fa2, #ff4081)',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
              }}
            >
              Teen Life Navigator
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: darkMode ? '#bbdefb' : '#1565c0', 
                mb: 2,
                fontWeight: 500,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.5
              }}
            >
              Join Swathi's journey through important life lessons and discover the path to confident growing up
            </Typography>
          </motion.div>
        </Box>

        {/* Main Content Area - Character and Button */}
        <Grid container spacing={4} sx={{ alignItems: 'center', mb: 4 }}>
          {/* Left Side - Character Animation */}
          <Grid item xs={12} md={6} sx={{ position: 'relative', height: { xs: 350, md: 400 } }}>
            {/* Character Images with Motion Effects */}
            <Box sx={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'center' }}>
              {/* Glowing background behind character */}
              <Box
                component={motion.div}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: [0.8, 1.1, 0.9], opacity: [0.5, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 5 }}
                sx={{
                  position: 'absolute',
                  width: 250,
                  height: 250,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(156,39,176,0.4) 0%, rgba(233,30,99,0.2) 50%, rgba(156,39,176,0) 70%)',
                  filter: 'blur(30px)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}
              />
              
              {/* Main Character */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                style={{ position: 'relative', zIndex: 3 }}
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3.5,
                    ease: "easeInOut"
                  }}
                >
                  <Box
                    component="img"
                    src={swathiHappy}
                    alt="Swathi"
                    sx={{
                      height: { xs: 280, md: 340 },
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: darkMode ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))',
                      borderRadius: '30px',
                      zIndex: 3
                    }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Orbiting Elements */}
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 15 + index * 5,
                      ease: "linear",
                      repeat: Infinity
                    },
                    scale: {
                      duration: 2 + index,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                  style={{
                    position: 'absolute',
                    width: 180 + index * 60,
                    height: 180 + index * 60,
                    borderRadius: '50%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: `2px dashed ${index === 0 ? '#ff4081' : index === 1 ? '#5c6bc0' : '#7e57c2'}`,
                    opacity: 0.3,
                    zIndex: 2
                  }}
                />
              ))}
              
              {/* Floating Icons */}
              {['💪', '❤️', '🧠', '🔍', '🌟'].map((emoji, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    x: [0, (index % 2 === 0 ? 80 : -80) * Math.sin(index)],
                    y: [-20, -80 - (index * 20)]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    delay: index * 1.2,
                    repeatDelay: 3
                  }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '40%',
                    fontSize: '32px',
                    zIndex: 4
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </Box>
          </Grid>
          
          {/* Right Side - Text and Call to Action */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }}}>
              {/* Speech bubble with typing animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                style={{ alignSelf: 'flex-start', marginBottom: 40, maxWidth: '90%' }}
              >
                <Paper
                  elevation={5}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      bottom: -18,
                      left: 30,
                      width: 0,
                      height: 0,
                      borderLeft: '25px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: darkMode ? '20px solid rgba(255,255,255,0.1)' : '20px solid white',
                    }
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      color: darkMode ? 'white' : '#333',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box component="span" sx={{ color: '#e91e63', mr: 1, fontWeight: 'bold' }}>Swathi:</Box>
                    <Box component="span">
                      Hi! I'm Swathi. I'll help you navigate the challenges of growing up and learn about important topics in a fun way!
                    </Box>
                  </Typography>
                </Paper>
              </motion.div>
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 350 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    onClick={() => setGameStarted(true)}
                    startIcon={<ArrowForward />}
                    sx={{
                      py: 1.8,
                      fontSize: '1.2rem',
                      borderRadius: 30,
                      background: 'linear-gradient(45deg, #ff4081 30%, #f50057 90%)',
                      boxShadow: '0 5px 15px rgba(255, 64, 129, 0.4)',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': animationStyles['@keyframes pulse']
                    }}
                  >
                    Start Your Journey
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      mt: 1,
                      color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                      fontStyle: 'italic'
                    }}
                  >
                    An interactive journey designed especially for teens
                  </Typography>
                </motion.div>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Feature Cards Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 3,
              color: darkMode ? '#e1bee7' : '#6200ea',
              fontWeight: 600
            }}
          >
            What You'll Discover
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {[
              { icon: <Favorite sx={{ fontSize: 40 }} />, title: "Health & Wellness", desc: "Learn about your body and wellness" },
              { icon: <Psychology sx={{ fontSize: 40 }} />, title: "Emotional Growth", desc: "Understand feelings and relationships" },
              { icon: <School sx={{ fontSize: 40 }} />, title: "Life Skills", desc: "Build skills for confident living" },
              { icon: <EmojiPeople sx={{ fontSize: 40 }} />, title: "Self Confidence", desc: "Develop a positive self-image" }
            ].map((item, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <motion.div
                  whileHover={{ 
                    y: -10, 
                    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                    background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 2.2 + index * 0.2,
                    type: "spring",
                    stiffness: 100,
                    hover: { type: "spring", stiffness: 300 }
                  }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                      textAlign: 'center',
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: darkMode ? 'white' : 'inherit',
                      transition: 'all 0.3s',
                      '&:hover': {
                        color: 'white'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        mb: 2, 
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: darkMode ? 'rgba(156,39,176,0.2)' : 'rgba(156,39,176,0.1)',
                        color: index === 0 ? '#e91e63' : 
                              index === 1 ? '#2196f3' : 
                              index === 2 ? '#4caf50' : '#ff9800',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">
                      {item.desc}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

  // Update the renderStorySelection function to ensure story access works
const renderStorySelection = () => {
  // Ensure unlockedStories has at least the first story
  const stories = [
    { 
      id: 0,
      title: "Understanding Your Body", 
      description: "Learn about physical changes and body awareness" 
    },
    { 
      id: 1,
      title: "Learning Boundaries", 
      description: "Explore personal boundaries and consent" 
    },
    { 
      id: 2,
      title: "Navigating Relationships", 
      description: "Understand healthy relationships and communication" 
    }
  ];

  return (
    <Box sx={{ 
      p: 3, 
      borderRadius: 4, 
      bgcolor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
      boxShadow: 3
    }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: darkMode ? '#e1bee7' : '#6200ea' }}>
        Choose a Story
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {stories.map((story) => {
          // Check if story is unlocked - default to unlocked for first story
          const isLocked = story.id === 0 ? false : !unlockedStories.includes(story.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={story.id}>
              <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={(story.id + 1) * 300}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    transform: isLocked ? 'scale(0.95)' : 'scale(1)',
                    opacity: isLocked ? 0.7 : 1,
                    bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                    color: darkMode ? 'white' : 'inherit',
                    '&:hover': {
                      transform: isLocked ? 'scale(0.95)' : 'scale(1.03)',
                      boxShadow: isLocked ? 1 : 6
                    }
                  }}
                >
                  <CardMedia
                    component="div" // Changed from "img" to avoid image loading errors
                    sx={{ 
                      height: 140,
                      backgroundColor: story.id === 0 ? '#7b1fa2' : 
                                      story.id === 1 ? '#0288d1' : '#d32f2f',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: isLocked ? 'grayscale(1) brightness(0.7)' : 'none',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {story.id === 0 && <Favorite sx={{ fontSize: 60, color: 'rgba(255,255,255,0.7)' }} />}
                    {story.id === 1 && <Psychology sx={{ fontSize: 60, color: 'rgba(255,255,255,0.7)' }} />}
                    {story.id === 2 && <Forum sx={{ fontSize: 60, color: 'rgba(255,255,255,0.7)' }} />}
                  </CardMedia>
                  {isLocked && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 2
                      }}
                    >
                      <School fontSize="large" sx={{ color: 'white', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                        Reach Level {story.id + 2} to Unlock
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="div" color={darkMode ? 'white' : 'inherit'}>
                      {story.title}
                    </Typography>
                    <Typography variant="body2" color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 2 }}>
                      {story.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        disabled={isLocked}
                        onClick={() => {
                          // Log for debugging
                          console.log(`Starting story ${story.id}`);
                          // Set current story and scene
                          setCurrentStory(story.id);
                          setCurrentScene(0);
                          // Show character dialog
                          setCharacterDialogContent(`I'm ready to explore ${story.title}. Let's go!`);
                          setShowCharacterDialog(true);
                        }}
                        startIcon={isLocked ? <School /> : <ArrowForward />}
                        sx={{
                          mt: 'auto',
                          animation: !isLocked ? 'pulse 1.5s infinite ease-in-out' : 'none',
                          '@keyframes pulse': animationStyles['@keyframes pulse']
                        }}
                      >
                        {isLocked ? `Unlocks at Level ${story.id + 2}` : 'Start Story'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
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
      <>
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              bgcolor: darkMode ? '#1a2035' : 'white',
              color: darkMode ? 'white' : 'inherit',
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              bgcolor: 
                dialogContent.type === 'info' ? (darkMode ? '#1a365d' : '#e3f2fd') :
                dialogContent.type === 'warning' ? (darkMode ? '#7e4b00' : '#fff8e1') :
                dialogContent.type === 'success' ? (darkMode ? '#1b4d3e' : '#e8f5e9') : 
                                                  (darkMode ? '#1a365d' : '#e3f2fd'),
              color: darkMode ? 'white' : 'inherit',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {dialogContent.type === 'info' && <Info sx={{ mr: 1, color: darkMode ? '#90caf9' : '#2196f3' }} />}
            {dialogContent.type === 'warning' && <Warning sx={{ mr: 1, color: darkMode ? '#ffb74d' : '#ff9800' }} />}
            {dialogContent.type === 'success' && <Check sx={{ mr: 1, color: darkMode ? '#a5d6a7' : '#4caf50' }} />}
            {dialogContent.title}
          </DialogTitle>
          <DialogContent sx={{ mt: 2, color: darkMode ? 'white' : 'inherit' }}>
            <Typography variant="body1">{dialogContent.content}</Typography>
          </DialogContent>
          <DialogActions>
            {dialogContent.title === 'Exit Game' ? (
              <>
                <Button onClick={() => setShowDialog(false)} color="inherit">
                  Cancel
                </Button>
                <Button onClick={handleExitGame} color="primary" variant="contained">
                  Confirm Exit
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowDialog(false)} color="primary">
                Continue
              </Button>
            )}
          </DialogActions>
        </Dialog>
        
        <Snackbar
          open={notification.show}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setNotification(prev => ({ ...prev, show: false }))} 
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
        
        <Dialog
          open={showTip}
          onClose={() => setShowTip(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              bgcolor: darkMode ? '#1a2035' : 'white',
              color: darkMode ? 'white' : 'inherit',
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: darkMode ? '#1a365d' : '#e3f2fd', 
            color: darkMode ? 'white' : 'inherit',
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <School sx={{ mr: 1, color: darkMode ? '#90caf9' : '#2196f3' }} />
            Educational Tip
          </DialogTitle>
          <DialogContent sx={{ mt: 2, color: darkMode ? 'white' : 'inherit' }}>
            <Typography variant="body1">{tipContent}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTip(false)} color="primary">
              Got it
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  // Inside your Game4 component, add this function to render scene content

const renderSceneContent = () => {
  const story = storyContent[currentStory];
  if (!story) return null;
  
  const scene = story.scenes.find(s => s.id === currentScene);
  if (!scene) return null;
  
  return (
    <Box sx={{ 
      p: 3, 
      borderRadius: 4, 
      bgcolor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
      boxShadow: 3
    }}>
      <Typography variant="h5" textAlign="center" color="primary" fontWeight="bold" mb={2}>
        {scene.title}
      </Typography>
      
      <Paper 
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
          color: darkMode ? 'white' : 'inherit',
          borderRadius: 2
        }}
      >
        <Typography variant="body1" mb={3}>
          {scene.content}
        </Typography>
        
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(156, 39, 176, 0.05)',
            mb: 2
          }}
        >
          <Avatar 
            sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: '#9c27b0',
              boxShadow: 2
            }}
          >
            {scene.character === 'swathi' ? 'S' : 
             scene.character === 'mom' ? 'M' : 
             scene.character === 'teacher' ? 'T' : '?'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              {scene.character === 'swathi' ? 'Swathi' :
               scene.character === 'mom' ? 'Mom' :
               scene.character === 'teacher' ? 'Teacher' : 'Character'}:
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              "{scene.dialog}"
            </Typography>
          </Box>
          {emotionIcons[scene.emotion] && (
            <Tooltip title={`Feeling ${scene.emotion}`}>
              <Box sx={{ ml: 'auto' }}>
                {emotionIcons[scene.emotion]}
              </Box>
            </Tooltip>
          )}
        </Box>
      </Paper>
      
      <Typography variant="h6" color="primary" mb={2}>
        What will you do?
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {scene.choices.map((choice, index) => (
          <Button
            key={index}
            variant="contained"
            color={index === 0 ? "primary" : index === 1 ? "info" : "secondary"}
            sx={{ 
              py: 1.5,
              justifyContent: 'flex-start',
              textAlign: 'left',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 4
              }
            }}
            onClick={() => handleChoiceSelected(choice)}
            ref={el => choiceButtonsRef.current[index] = el}
          >
            {choice.text}
          </Button>
        ))}
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 3
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Help />}
          onClick={() => showEducationalTip(scene.eduTip)}
          sx={{
            borderRadius: 20,
            '&:hover': {
              bgcolor: 'rgba(123, 31, 162, 0.05)'
            }
          }}
        >
          Helpful Tip
        </Button>
      </Box>
    </Box>
  );
};

// Add a handler for choice selection
const handleChoiceSelected = (choice) => {
  // Show feedback first
  setDialogContent({
    title: 'Feedback',
    content: choice.feedback,
    type: 'info'
  });
  setShowDialog(true);
  
  // Update player stats based on choice impact
  if (choice.impact) {
    if (choice.impact.health) {
      setHealthMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.health)));
    }
    
    if (choice.impact.confidence) {
      setConfidenceMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.confidence)));
    }
    
    if (choice.impact.knowledge) {
      setKnowledgeMeter(prev => Math.max(0, Math.min(100, prev + choice.impact.knowledge)));
      // Also award XP for knowledge gains
      setXp(prev => prev + Math.abs(choice.impact.knowledge));
    }
    
    // Create particle effect at the choice button location
    const buttonIndex = choice.impact.health > 0 ? 0 : 
                       choice.impact.confidence > 0 ? 1 : 2;
    const button = choiceButtonsRef.current[buttonIndex];
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      createParticleEffect(x, y, 
        choice.impact.health > 0 ? '#f44336' : 
        choice.impact.confidence > 0 ? '#ff9800' : 
        '#2196f3');
    }
    
    // Update character emotion based on impacts
    updateCharacterEmotion();
    
    // Show character dialog based on the choice
    if (choice.impact.health > 0 || choice.impact.confidence > 0) {
      setCharacterDialogContent("I feel good about this decision!");
    } else if (choice.impact.health < 0 || choice.impact.confidence < 0) {
      setCharacterDialogContent("I'm not sure if that was the best choice...");
    } else {
      setCharacterDialogContent("That's interesting, I learned something new.");
    }
    setShowCharacterDialog(true);
  }
  
  // Increment streak for good choices
  if (choice.impact && 
      (choice.impact.health > 0 || 
       choice.impact.confidence > 0 || 
       choice.impact.knowledge > 0)) {
    setStreak(prev => prev + 1);
    if (streak + 1 >= 5 && badges.indexOf("Star Student") === -1) {
      setBadges(prev => [...prev, "Star Student"]);
      setNewAchievement({
        icon: <Star sx={{ fontSize: 50, color: '#ffab00' }} />,
        title: "Star Student",
        description: "Made 5 good choices in a row!"
      });
      setShowAchievementPopup(true);
    }
  } else {
    setStreak(0);
  }
  
  // Check for level up
  const newXp = xp + Math.abs(choice.impact?.knowledge || 0);
  const newLevel = Math.floor(newXp / 100) + 1;
  if (newLevel > level) {
    setLevel(newLevel);
    // Unlock new stories based on level
    if (newLevel >= 2 && !unlockedStories.includes(1)) {
      setUnlockedStories(prev => [...prev, 1]);
      setNewAchievement({
        icon: <EmojiEvents sx={{ fontSize: 50, color: '#ffab00' }} />,
        title: "Level Up!",
        description: "Reached Level 2 and unlocked new content!"
      });
      setShowAchievementPopup(true);
    }
    if (newLevel >= 3 && !unlockedStories.includes(2)) {
      setUnlockedStories(prev => [...prev, 2]);
    }
  }
  
  // Move to next scene after a delay
  setTimeout(() => {
    setCurrentScene(choice.nextScene);
  }, 1500);
};

// Function to show educational tips
const showEducationalTip = (tip) => {
  setTipContent(tip);
  setShowTip(true);
  // Award small XP for seeking knowledge
  setXp(prev => prev + 5);
};

// Add this function to trigger avatar animations based on stat changes
const triggerAvatarReaction = (statChange) => {
  if (statChange.health > 10) {
    setReactionEmoji('❤️');
    setAvatarAnimation('jump');
    setCharacterEmotion('happy');
  } else if (statChange.health < 0) {
    setReactionEmoji('💔');
    setAvatarAnimation('shake');
    setCharacterEmotion('sad');
  } else if (statChange.confidence > 10) {
    setReactionEmoji('💪');
    setAvatarAnimation('pulse');
    setCharacterEmotion('confident');
  } else if (statChange.confidence < 0) {
    setReactionEmoji('😰');
    setAvatarAnimation('shake');
    setCharacterEmotion('nervous');
  } else if (statChange.knowledge > 10) {
    setReactionEmoji('💡');
    setAvatarAnimation('bounce');
    setCharacterEmotion('happy');
  } else {
    setReactionEmoji('✨');
    setAvatarAnimation('pulse');
  }
  
  setShowReaction(true);
  setTimeout(() => {
    setShowReaction(false);
    setAvatarAnimation('idle');
  }, 2000);
};

// Update your handleChoiceSelected function to include avatar reactions
const handleChoiceSelected1 = (choice) => {
  // Existing code...
  
  // Add this to handle avatar animation
  if (choice.impact) {
    triggerAvatarReaction(choice.impact);
    
    // Store previous emotion to animate transition
    setPreviousEmotion(characterEmotion);
  }
  
  // Rest of your existing code...
};

// Add this component to render the avatar with animations
const renderCharacterAvatar = () => {
  // Don't show avatar on start screen or story selection
  if (!gameStarted || currentStory === -1) return null;
  
  // Define animation variants
  const avatarVariants = {
    idle: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1],
      transition: { duration: 0.5, repeat: 1 }
    },
    jump: { 
      y: [0, -20, 0],
      transition: { duration: 0.5, repeat: 1 }
    },
    shake: { 
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4, repeat: 1 }
    },
    bounce: { 
      y: [0, -10, 0, -5, 0],
      transition: { duration: 0.5, repeat: 1 }
    }
  };
  
  const emotionTransition = { 
    type: "tween", 
    ease: "easeInOut", 
    duration: 0.3 
  };
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Character emotion reaction bubble */}
      <AnimatePresence>
        {showReaction && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'white',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              marginBottom: 10,
              fontSize: '24px'
            }}
          >
            {reactionEmoji}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Character avatar with animation */}
      <motion.div
        variants={avatarVariants}
        animate={avatarAnimation}
        style={{
          position: 'relative',
          width: 120,
          height: 120
        }}
      >
        {/* Previous emotion fading out */}
        <AnimatePresence>
          {previousEmotion !== characterEmotion && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={emotionTransition}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}
            >
              <Box
                component="img"
                src={swathiEmotionImages[previousEmotion] || swathiEmotionImages.neutral}
                alt="Swathi"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: darkMode ? 'brightness(0.85)' : 'none'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Current emotion */}
        <motion.div
          initial={{ opacity: previousEmotion !== characterEmotion ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={emotionTransition}
        >
          <Box
            component="img"
            src={swathiEmotionImages[characterEmotion] || swathiEmotionImages.neutral}
            alt="Swathi"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: darkMode ? 'brightness(0.85)' : 'none',
              borderRadius: '10px'
            }}
          />
        </motion.div>
        
        {/* Character attribute indicators */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          position: 'absolute',
          top: -15,
          right: -15
        }}>
          {healthMeter > 80 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Favorite sx={{ color: 'red' }} fontSize="small" />
            </motion.div>
          )}
          {confidenceMeter > 80 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <EmojiPeople sx={{ color: '#ff9800' }} fontSize="small" />
            </motion.div>
          )}
          {knowledgeMeter > 80 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <School sx={{ color: '#2196f3' }} fontSize="small" />
            </motion.div>
          )}
        </Box>
      </motion.div>
      
      {/* Character name tag */}
      <Paper
        elevation={2}
        sx={{
          mt: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 10,
          background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          Swathi
        </Typography>
        <Box 
          sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: '#4caf50',
            boxShadow: '0 0 5px #4caf50'
          }} 
        />
      </Paper>
    </Box>
  );
};

  // Main render method with ThemeProvider for consistent game theme
  return (
    <ThemeProvider theme={gameTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          pb: 8,
          minHeight: '100vh',
          background: darkMode ? 
            'linear-gradient(135deg, #141e30 0%, #243b55 100%)' : 
            'linear-gradient(135deg, #f5f7fa 0%, #e8ebf2 100%)',
          transition: 'background 0.3s ease'
        }}
      >
        {/* Header with back button, dark mode toggle and player stats */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 2,
            p: 2,
            borderRadius: { xs: 0, md: 4 },
            bgcolor: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => {
                setDialogContent({
                  title: 'Exit Game',
                  content: 'Are you sure you want to exit the game? Your progress will be saved.',
                  type: 'warning'
                });
                setShowDialog(true);
              }}
              sx={{ 
                borderRadius: 8,
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  transform: 'translateX(-3px)'
                },
                transition: 'all 0.3s'
              }}
            >
              Exit Game
            </Button>
            
            <IconButton 
              onClick={() => setDarkMode(!darkMode)} 
              sx={{ 
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                }
              }}
            >
              {darkMode ? <WbSunny /> : <Nightlight />}
            </IconButton>
          </Box>
          
          {gameStarted && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {currentStory !== -1 && (
                <Button
                  onClick={goToStorySelection}
                  startIcon={<ArrowBack fontSize="small" />}
                  size="small"
                  sx={{ mr: 2 }}
                >
                  Back to Stories
                </Button>
              )}
              
              <Paper 
                elevation={1} 
                sx={{ 
                  py: 0.5, 
                  px: 1.5, 
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(45deg, #ff9800 30%, #ff6d00 90%)',
                }}
              >
                <EmojiEvents sx={{ color: 'white', mr: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                  Level: {level}
                </Typography>
              </Paper>
              
              <Paper 
                elevation={1} 
                sx={{ 
                  py: 0.5, 
                  px: 1.5, 
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                }}
              >
                <School sx={{ color: 'white', mr: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                  XP: {xp}
                </Typography>
              </Paper>
              
              {streak > 0 && (
                <Paper 
                  elevation={1} 
                  sx={{ 
                    py: 0.5, 
                    px: 1.5, 
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: streak >= 5 ? 
                      'linear-gradient(45deg, #ff4081 30%, #f50057 90%)' : 
                      'rgba(255,255,255,0.8)',
                    animation: streak >= 5 ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': animationStyles['@keyframes pulse']
                  }}
                >
                  <Forum sx={{ color: streak >= 5 ? 'white' : '#757575', mr: 1 }} />
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: streak >= 5 ? 'white' : 'inherit'
                    }}
                  >
                    Streak: {streak}
                  </Typography>
                </Paper>
              )}
              
              {badges.length > 0 && (
                <Tooltip 
                  title={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Earned Badges:</Typography>
                      {badges.map((badge, index) => (
                        <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Check fontSize="small" sx={{ mr: 0.5, color: '#4caf50' }} />
                          {badge}
                        </Typography>
                      ))}
                    </Box>
                  }
                  arrow
                >
                  <IconButton 
                    size="small" 
                    sx={{
                      background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #aa2aba 30%, #7e57c2 90%)',
                      }
                    }}
                  >
                    <Celebration />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {badges.length}
                    </Typography>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
          
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <WbSunny /> : <Nightlight />}
          </IconButton>
        </Box>
        
        {/* Main content */}
        <Container maxWidth="lg">
          {renderGameContent()}
        </Container>
        
        {/* Character avatar */}
        {renderCharacterAvatar()}
        
        {/* Various dialogs and notifications */}
        {renderAchievementPopup()}
        {renderCharacterDialog()}
        {renderDialogs()}
        {renderCharacterDialog()}
        {renderAchievementPopup()}
      </Box>
    </ThemeProvider>
  );
};

export default Game4;
