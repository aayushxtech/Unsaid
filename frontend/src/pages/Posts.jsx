import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
  Paper,
  Divider,
  Fade,
  Chip,
  Alert,
  Tooltip,
  Zoom,
  Collapse,
  Slide,
  Grow,
  Avatar
} from "@mui/material";
import { motion } from "framer-motion";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import calculateAge from "../lib/calculateAge";
import getAgeGroup from "../lib/ageGroup";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ShieldIcon from "@mui/icons-material/Shield";
import InfoIcon from "@mui/icons-material/Info";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';

const customAnimations = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  @keyframes sparkle {
    0% { transform: scale(0) rotate(0deg); }
    50% { transform: scale(1) rotate(180deg); }
    100% { transform: scale(0) rotate(360deg); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .purple-gradient-bg {
    background: linear-gradient(-45deg, #7c3aed, #9333ea, #4f46e5, #6366f1);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }

  .glassmorphic {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .floating-bubble {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.4), rgba(139, 92, 246, 0.1));
    filter: blur(8px);
    pointer-events: none;
    animation: float 10s infinite ease-in-out;
  }

  .sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    animation: sparkle 2s infinite;
  }

  .textbox-gradient {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6366f1 100%);
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
  }

  .textbox-inner {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.1);
  }

  .textbox-shimmer {
    background: linear-gradient(
      90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.15) 50%, 
      rgba(255,255,255,0) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
  }

  @keyframes expandCard {
    0% { transform: scale(1); }
    100% { transform: scale(1.02); }
  }

  .expanded-card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1000;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1));
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
    animation: expandCard 0.3s ease forwards;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: 999;
  }

  .content-animation {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 10px rgba(147, 51, 234, 0.4); }
    50% { box-shadow: 0 0 25px rgba(147, 51, 234, 0.7); }
  }
  
  @keyframes float-rotate {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }

  .trending-item {
    animation: pulse-glow 3s infinite;
    transition: all 0.3s ease;
  }

  .trending-item:hover {
    transform: translateY(-5px) scale(1.03);
  }

  .trending-icon {
    animation: float-rotate 4s infinite ease-in-out;
  }

  .fire-icon {
    position: relative;
  }

  .fire-icon::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: radial-gradient(circle, rgba(255,105,30,0.4) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
    animation: pulse 2s infinite;
  }

  @keyframes gentle-pulse {
    0%, 100% { box-shadow: 0 8px 25px rgba(124, 58, 237, 0.2); }
    50% { box-shadow: 0 12px 30px rgba(124, 58, 237, 0.4); }
  }
  
  .post-card {
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(167, 139, 250, 0.3);
    transition: all 0.4s ease;
    animation: gentle-pulse 4s infinite ease-in-out;
  }
  
  .post-card:hover {
    transform: translateY(-5px) scale(1.02);
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%);
    border: 1px solid rgba(167, 139, 250, 0.5);
    box-shadow: 0 15px 30px rgba(124, 58, 237, 0.3) !important;
  }
  
  .post-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #9333EA, #A855F7);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .post-card:hover::before {
    opacity: 1;
  }
`;

// Animated text renderer for titles
const AnimatedText = ({ text }) => {
  return (
    <div className="inline-block">
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.03,
            duration: 0.5,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

const TrendingDiscussions = () => {
  const [activeTrending, setActiveTrending] = useState('today');
  
  const trendingTopics = {
    today: [
      { 
        id: 't1', 
        title: "Not Sure If It's Just Me... Or Something Bigger?",
        author: "EducationAdvocate",
        likes: 487,
        comments: 56,
        participants: 34,
        tag: "Communication",
        color: "#9333EA" 
      },
      { 
        id: 't2', 
        title: "Let’s Talk Consent: The Foundation of Every Healthy Relationshipe",
        author: "HealthExpert",
        likes: 412,
        comments: 78,
        participants: 41,
        tag: "Youth Health",
        color: "#6366F1" 
      },
    
    ],
    week: [
      { 
        id: 'w1', 
        title: "Healthy relationships 101: What teens should know",
        author: "RelationshipCoach",
        likes: 892,
        comments: 103,
        participants: 67,
        tag: "Relationships",
        color: "#4F46E5" 
      },
      { 
        id: 'w2', 
        title: "Talking to kids about bodies: Age-appropriate approaches",
        author: "FamilyTherapist",
        likes: 756,
        comments: 89,
        participants: 53,
        tag: "Parenting",
        color: "#8B5CF6" 
      },
      { 
        id: 'w3', 
        title: "Dispelling myths: Common sex education misconceptions",
        author: "MythBuster",
        likes: 621,
        comments: 74,
        participants: 49,
        tag: "Education",
        color: "#EC4899" 
      },
    ],
    month: [
      { 
        id: 'm1', 
        title: "How schools can improve their sex education curriculum",
        author: "CurriculumSpecialist",
        likes: 1245,
        comments: 187,
        participants: 93,
        tag: "Education Reform",
        color: "#7C3AED" 
      },
      { 
        id: 'm2', 
        title: "Digital safety and sex education in the online era",
        author: "TechEducator",
        likes: 1089,
        comments: 132,
        participants: 87,
        tag: "Digital Safety",
        color: "#8B5CF6" 
      },
      { 
        id: 'm3', 
        title: "Supporting LGBTQ+ youth: Inclusive approaches to education",
        author: "InclusionAdvocate",
        likes: 978,
        comments: 145,
        participants: 78,
        tag: "Inclusivity",
        color: "#D946EF" 
      },
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="mb-12"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <motion.div
            whileHover={{ scale: 1.2, rotate: -15 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <LocalFireDepartmentIcon
              sx={{ 
                color: "#FF6B00", 
                mr: 2, 
                fontSize: 34,
                filter: "drop-shadow(0 0 5px rgba(255, 107, 0, 0.5))" 
              }}
              className="trending-icon fire-icon"
            />
          </motion.div>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "600",
              color: "#fff",
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <AnimatedText text="Trending Discussions" />
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {["today", "week", "month"].map((period) => (
            <motion.div
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="small"
                variant={activeTrending === period ? "contained" : "outlined"}
                onClick={() => setActiveTrending(period)}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  px: 2,
                  backgroundColor: activeTrending === period ? 
                    "rgba(255, 255, 255, 0.2)" : "transparent",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "#fff",
                  backdropFilter: "blur(5px)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
                startIcon={
                  period === "today" ? (
                    <TrendingUpIcon fontSize="small" />
                  ) : period === "week" ? (
                    <ForumIcon fontSize="small" />
                  ) : (
                    <PeopleIcon fontSize="small" />
                  )
                }
              >
                {period}
              </Button>
            </motion.div>
          ))}
        </Box>
      </Box>

      <motion.div
        key={activeTrending}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {trendingTopics[activeTrending].map((topic) => (
            <Grid item xs={12} md={4} key={topic.id}>
              <Paper
                className="trending-item glassmorphic"
                sx={{
                  p: 3,
                  position: "relative",
                  overflow: "hidden",
                  borderLeft: `4px solid ${topic.color}`,
                  cursor: "pointer",
                }}
              >
                {/* Tag */}
                <Chip 
                  label={topic.tag}
                  size="small"
                  sx={{ 
                    mb: 2, 
                    backgroundColor: `${topic.color}30`,
                    color: "white",
                    fontWeight: 500,
                    borderRadius: "12px"
                  }}
                />
                
                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{ 
                    color: "white", 
                    mb: 2,
                    fontWeight: 600,
                    fontSize: "1.1rem" 
                  }}
                >
                  {topic.title}
                </Typography>
                
                {/* Author */}
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    mb: 2 
                  }}
                >
                  <Avatar
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      bgcolor: topic.color,
                      fontSize: "0.8rem",
                      mr: 1.5
                    }}
                  >
                    {topic.author.substring(0, 1)}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    {topic.author}
                  </Typography>
                </Box>
                
                {/* Stats */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FavoriteIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: "rgba(255, 255, 255, 0.7)",
                        mr: 0.5 
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {topic.likes}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ForumIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: "rgba(255, 255, 255, 0.7)",
                        mr: 0.5 
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {topic.comments}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PeopleIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: "rgba(255, 255, 255, 0.7)",
                        mr: 0.5 
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {topic.participants}
                    </Typography>
                  </Box>
                </Box>

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20"
                  style={{
                    background: `radial-gradient(circle, ${topic.color}30 0%, transparent 70%)`,
                    borderRadius: "50%",
                    transform: "translate(50%, -50%)",
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Featured Discussion Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="mt-8"
      >
        <Paper
          className="glassmorphic"
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(139, 92, 246, 0.2))",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 3,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 1 }}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
              >
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    bgcolor: "#9333EA",
                    border: "3px solid rgba(255,255,255,0.2)"
                  }}
                >
                  <StarIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </motion.div>
              
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h3" sx={{ color: "white", fontWeight: "bold" }}>1.2k</Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Engaging</Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Chip 
                  label="Featured" 
                  color="secondary"
                  sx={{ 
                    bgcolor: "#9333EA", 
                    fontWeight: "bold",
                    px: 1 
                  }}
                />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>2 days ago</Typography>
              </Box>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "white", 
                  fontWeight: 600,
                  mb: 2,
                  textShadow: "0 2px 3px rgba(0,0,0,0.2)"
                }}
              >
                How can we make sex education more accessible and inclusive?
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255,255,255,0.9)",
                  mb: 3 
                }}
              >
                Join our community-led discussion on breaking barriers and ensuring everyone has access to comprehensive sex education. Share your insights, experiences, and suggestions for creating more inclusive learning environments.
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(5px)",
                      textTransform: "none",
                      px: 3,
                      borderRadius: "20px",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                      }
                    }}
                  >
                    Join Discussion
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "white",
                      textTransform: "none",
                      px: 3,
                      borderRadius: "20px",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.5)",
                        bgcolor: "rgba(255,255,255,0.05)",
                      }
                    }}
                  >
                    Save for Later
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </Box>

          {/* Decorative background elements */}
          <Box
            className="absolute inset-0 pointer-events-none"
            sx={{ position: "absolute", inset: 0, zIndex: 0 }}
          >
            <motion.div
              className="absolute bottom-0 right-0 w-60 h-60"
              style={{
                background: "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(30%, 30%)",
              }}
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <motion.div
              className="absolute top-0 left-0 w-40 h-40"
              style={{
                background: "radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(-30%, -30%)",
              }}
              animate={{ 
                scale: [1, 1.3, 1],
              }}
              transition={{ 
                duration: 8,
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </Box>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

const Posts = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [userAgeGroup, setUserAgeGroup] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [animateTitle, setAnimateTitle] = useState(false);
  const [hoverPostIndex, setHoverPostIndex] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const scrollRef = useRef(null);

  // Staggered animation for posts
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Fetch user profile and set age group
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          const age = calculateAge(data.date_of_birth);
          const ageGroup = getAgeGroup(age);
          setUserAgeGroup(ageGroup);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const fetchPosts = async () => {
    try {
      // First, let's try to see what relationships are available
      const { data: postsData, error } = await supabase
        .from("posts")
        .select(
          `
          *
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If we need to get profiles data, we'll do it separately
      const userIds = postsData
        .filter((post) => !post.is_anonymous && post.user_id)
        .map((post) => post.user_id);

      // Fetch profiles data for non-anonymous posts
      let profilesData = [];
      if (userIds.length > 0) {
        const { data, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, avatar_url, date_of_birth")
          .in("id", userIds);

        if (!profilesError) {
          profilesData = data;
        }
      }

      // Now map posts with profile data
      const formattedPosts = postsData.map((post) => {
        // Find corresponding profile
        const profile = post.is_anonymous
          ? null
          : profilesData.find((p) => p.id === post.user_id);

        return {
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          content: post.content,
          is_anonymous: post.is_anonymous,
          created_at: post.created_at,
          updated_at: post.updated_at,
          imageUrl: post.image_url,
          fullName: post.is_anonymous
            ? "Anonymous Friend"
            : profile
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
            : "Community Member",
          userAvatar: post.is_anonymous ? null : profile?.avatar_url,
          timePosted: formatTimeAgo(post.created_at),
          ageGroup: profile
            ? getAgeGroup(calculateAge(profile.date_of_birth))
            : null,
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return "Just now";
  };

  useEffect(() => {
    fetchPosts();
    
    // Start title animation after a delay
    const titleTimer = setTimeout(() => {
      setAnimateTitle(true);
    }, 800);
    
    // Set page loaded for entrance animations
    const pageTimer = setTimeout(() => {
      setPageLoaded(true);
    }, 200);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(pageTimer);
    };
  }, []);

  // Add scroll monitoring for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [posts.length, loading]);

  const handlePostCreated = async () => {
    setOpenCreatePost(false); // Close the create post dialog
    setLoading(true); // Show loading state
    await fetchPosts(); // Refresh the posts
  };

  // Animated text renderer for titles
  const AnimatedText = ({ text }) => {
    return (
      <div className="inline-block">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.03,
              duration: 0.5,
              ease: "easeOut"
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    );
  };

  // Loading state with animated loader
  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box textAlign="center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 2,
                ease: "linear"
              }}
            >
              <CircularProgress
                size={70}
                thickness={4}
                sx={{ mb: 3, color: "secondary.main" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary"
                className="text-lg"
              >
                <AnimatedText text="Loading our friendly community discussions..." />
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    );
  }

  // Check banned status with animated transition
  if (profile?.is_banned) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Paper
            elevation={5}
            sx={{
              textAlign: "center",
              p: 5,
              borderRadius: 4,
              bgcolor: "#FFF4F5",
              border: "1px solid",
              borderColor: "#FFCDD2",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full bg-red-100 opacity-20"
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-0 left-0 w-40 h-40 -mb-10 -ml-10 rounded-full bg-red-100 opacity-20"
            />
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="h5"
                color="#D32F2F"
                gutterBottom
                fontWeight="medium"
              >
                <AnimatedText text="Account Temporarily Paused" />
              </Typography>
            </motion.div>
            <Divider sx={{ my: 2, width: "50%", mx: "auto" }} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Typography color="#D32F2F" sx={{ maxWidth: "80%", mx: "auto" }}>
                Your account has been temporarily paused. Our community guidelines
                help keep this a safe space for everyone. Please contact our
                friendly support team for assistance and information on next
                steps.
              </Typography>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                color="error"
                sx={{ 
                  mt: 3, 
                  borderRadius: 3, 
                  textTransform: "none",
                  px: 4,
                  py: 1.2
                }}
              >
                Contact Support
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  // Age restriction check with animated friendly message
  if (userAgeGroup === "3-12") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Paper
            elevation={3}
            sx={{
              textAlign: "center",
              p: 5,
              borderRadius: 4,
              bgcolor: "#FFF8E1",
              border: "1px solid",
              borderColor: "#FFE082",
              overflow: "hidden",
              position: "relative"
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            >
              <EmojiPeopleIcon sx={{ fontSize: 70, color: "#FFA000", mb: 2 }} />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="h5"
                color="#F57F17"
                gutterBottom
                fontWeight="medium"
                className="tracking-wide"
              >
                <AnimatedText text="Hey There, Young Friend!" />
              </Typography>
            </motion.div>
            
            <Divider sx={{ my: 2, width: "50%", mx: "auto" }} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <Typography
                color="#795548"
                sx={{ maxWidth: "80%", mx: "auto", mb: 2 }}
              >
                This part of our community is designed for older members. We have
                special areas just for you that are full of fun and
                age-appropriate content!
              </Typography>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="contained"
                color="warning"
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  bgcolor: "#FFB74D",
                  "&:hover": {
                    bgcolor: "#FFA726",
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 14px rgba(255, 167, 38, 0.4)"
                }}
              >
                Go to Kids Zone
              </Button>
            </motion.div>
            
            {/* Decorative elements */}
            <motion.div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amber-100 opacity-30"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-200 opacity-30"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <>
      <style>{customAnimations}</style>
      <Box className="purple-gradient-bg min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="floating-bubble"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Sparkles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        <Container 
          maxWidth="lg" 
          sx={{ 
            py: 6,
            position: 'relative',
            zIndex: 1 
          }}
          ref={scrollRef}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Update Alert styling */}
            {showWelcomeMessage && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert
                  severity="info"
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    '& .MuiAlert-icon': {
                      color: '#fff'
                    }
                  }}
                  icon={
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 10, 0],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                    >
                      <ShieldIcon fontSize="inherit" />
                    </motion.div>
                  }
                  onClose={() => setShowWelcomeMessage(false)}
                >
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                    >
                      Welcome to our community space! This is a safe and supportive
                      environment where everyone's voice matters.
                    </motion.span>
                    <Tooltip 
                      title={
                        <Typography variant="body2">
                          We monitor content to ensure it's appropriate for all age groups. 
                          Please be kind and respectful to others.
                        </Typography>
                      }
                      arrow
                      TransitionComponent={Zoom}
                    >
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <InfoIcon
                          sx={{
                            ml: 1,
                            fontSize: 18,
                            cursor: "pointer",
                            verticalAlign: "middle",
                          }}
                        />
                      </motion.span>
                    </Tooltip>
                  </Typography>
                </Alert>
              </motion.div>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 5,
                pb: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                overflow: "hidden"
              }}
              className="relative"
            >
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: animateTitle ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <ChatBubbleOutlineIcon
                    sx={{ color: "primary.main", mr: 2, fontSize: 34 }}
                  />
                </motion.div>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: "medium",
                      color: "#fff",
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    {animateTitle ? (
                      <AnimatedText text="Community Discussions" />
                    ) : (
                      "Community Discussions"
                    )}
                  </Typography>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Chip
                    label={userAgeGroup}
                    size="small"
                    color="secondary"
                    sx={{ 
                      ml: 2, 
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      '& .MuiChip-label': {
                        fontWeight: 500
                      }
                    }}
                  />
                </motion.div>
              </Box>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15,
                  delay: 0.3
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCreatePost(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: "30px",
                    px: 4,
                    py: 1.5,
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "white",
                    boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 25px rgba(124, 58, 237, 0.4)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      transition: "0.5s",
                    },
                    "&:hover::before": {
                      left: "100%",
                    }
                  }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      background: [
                        "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                        "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  Share Your Thoughts
                </Button>
              </motion.div>
            </Box>

            <TrendingDiscussions />

            {/* Category Pills - Add this for better filtering */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mb: 4,
                pb: 2, 
                borderBottom: '1px solid rgba(255,255,255,0.1)' 
              }}
            >
              {['All Posts', 'Questions', 'Discussions', 'Resources', 'Advice', 'Stories'].map((category, i) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={category}
                    onClick={() => {}}
                    sx={{ 
                      bgcolor: category === 'All Posts' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      borderRadius: '16px',
                      px: 1,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      }
                    }}
                  />
                </motion.div>
              ))}
            </Box>

            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 4,
                    background: "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                    border: "1px solid rgba(167, 139, 250, 0.3)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <motion.div
                    className="absolute top-0 right-0 w-48 h-48 -mt-16 -mr-16 rounded-full bg-green-100 opacity-50"
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h6" color="#2E7D32" gutterBottom>
                      <AnimatedText text="Be the first to start a friendly discussion!" />
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Typography variant="body1" color="#33691E" sx={{ mb: 3 }}>
                      Our community is waiting to hear your thoughts, questions, and
                      ideas.
                    </Typography>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => setOpenCreatePost(true)}
                      sx={{
                        mt: 2,
                        borderRadius: 3,
                        textTransform: "none",
                        px: 4,
                        py: 1.5,
                        fontSize: "1.05rem",
                        background: "linear-gradient(135deg, #9333EA, #A855F7)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #7E22CE, #9333EA)",
                          transform: "translateY(-3px)",
                          boxShadow: "0 12px 20px rgba(147, 51, 234, 0.4)",
                        },
                        boxShadow: "0 8px 15px rgba(147, 51, 234, 0.3)"
                      }}
                    >
                      Start a New Discussion
                    </Button>
                  </motion.div>
                </Paper>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {posts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ 
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Box 
                          className="post-card"
                          sx={{ 
                            position: 'relative',
                            height: '100%',
                            'img': {
                              filter: 'saturate(1.1)'
                            },
                            '.MuiCardHeader-root': {
                              borderBottom: '1px solid rgba(167, 139, 250, 0.2)'
                            },
                            '.MuiCardContent-root': {
                              background: 'linear-gradient(180deg, rgba(147, 51, 234, 0.05) 0%, rgba(167, 139, 250, 0.1) 100%)'
                            },
                            '.MuiCardActions-root': {
                              borderTop: '1px solid rgba(167, 139, 250, 0.2)',
                              background: 'rgba(147, 51, 234, 0.08)'
                            }
                          }}
                        >
                          <PostCard {...post} />
                          
                          {/* Add decorative elements */}
                          <Box 
                            className="absolute top-0 right-0 w-20 h-20 opacity-30"
                            sx={{
                              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
                              borderRadius: '50%',
                              transform: 'translate(30%, -30%)',
                              pointerEvents: 'none'
                            }}
                          />
                          
                          <Box 
                            className="absolute bottom-0 left-0 w-16 h-16 opacity-20"
                            sx={{
                              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
                              borderRadius: '50%',
                              transform: 'translate(-30%, 30%)',
                              pointerEvents: 'none'
                            }}
                          />
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            <CreatePostForm
              open={openCreatePost}
              onClose={() => setOpenCreatePost(false)}
              onPostCreated={handlePostCreated}
            />
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default Posts;