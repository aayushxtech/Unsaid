import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Container, Button, useTheme, Paper } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import Chatbot from "../components/Chatbot"; // Import the Chatbot component
import Meme from "../components/Meme"; // Import the Meme component

const Ask = () => {
  const theme = useTheme();
  const [activeComponent, setActiveComponent] = useState(null);

  const handleCardClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const flashcards = [
    {
      title: "DEVI: Your AI Friend",
      description: "Chat with DEVI about growing up, feelings, and body stuff! It's like having a cool older friend who knows all the answers.",
      icon: <PsychologyIcon fontSize="large" />,
      color: "#ff7043",
      gradient: "linear-gradient(135deg, #FF9A8B 0%, #FF6B6B 100%)",
      animation: "bounce",
      component: "chatbot"
    },
    {
      title: "Meme Detective",
      description: "Is that TikTok video telling the truth? Drop it here and become a fact-checking superhero!",
      icon: <FactCheckIcon fontSize="large" />,
      color: "#42a5f5",
      gradient: "linear-gradient(135deg, #72C6EF 0%, #004E8F 100%)",
      animation: "wobble",
      component: "meme"
    },
    {
      title: "Myth Busters",
      description: "Separate facts from fiction about bodies, relationships, and growing up! Become the smartest kid in your class!",
      icon: <MedicalInformationIcon fontSize="large" />,
      color: "#66bb6a",
      gradient: "linear-gradient(135deg, #B5FFBC 0%, #21A179 100%)",
      animation: "pulse"
    },
    {
      title: "Progress Tracker",
      description: "See how much you've learned with colorful charts and fun badges! Collect them all as you become a knowledge champion!",
      icon: <AssessmentIcon fontSize="large" />,
      color: "#ab47bc",
      gradient: "linear-gradient(135deg, #FFB7D5 0%, #AA26DA 100%)",
      animation: "shake"
    }
  ];

  const animations = {
    bounce: `@keyframes bounce { 
      0%, 100% { transform: translateY(0); } 
      50% { transform: translateY(-15px); } 
    }`,
    wobble: `@keyframes wobble { 
      0%, 100% { transform: rotate(0); } 
      25% { transform: rotate(-5deg); } 
      75% { transform: rotate(5deg); } 
    }`,
    pulse: `@keyframes pulse { 
      0%, 100% { transform: scale(1); } 
      50% { transform: scale(1.1); } 
    }`,
    shake: `@keyframes shake { 
      0%, 100% { transform: translateX(0); } 
      25% { transform: translateX(-5px); } 
      75% { transform: translateX(5px); } 
    }`
  };

  // If chatbot is active, render the Chatbot component
  if (activeComponent === "chatbot") {
    return <Chatbot onBack={() => setActiveComponent(null)} />;
  }
  
  // If meme detective is active, render the Meme component
  if (activeComponent === "meme") {
    return <Meme onBack={() => setActiveComponent(null)} />;
  }

  // Otherwise render the main menu with cards
  return (
    <Container maxWidth="lg">
      <style>
        {Object.values(animations).join('\n')}
      </style>
      
      <Paper
        elevation={5}
        sx={{
          py: 6,
          px: { xs: 2, md: 4 },
          borderRadius: 8,
          mt: 4,
          mb: 4,
          background: "linear-gradient(180deg, #f5f7fa 0%, #e8ebf2 100%)",
          border: '4px dashed #FF6B6B',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-20 20l1.732 1-10 17.32-1.732-1 10-17.32zM58.16 4.134l1 1.732-17.32 10-1-1.732 17.32-10zm-40 40l1 1.732-17.32 10-1-1.732 17.32-10zM80 9v2H60V9h20zM20 69v2H0v-2h20zm79.32-55l-1 1.732-17.32-10L82 4l17.32 10zm-80 80l-1 1.732-17.32-10L2 84l17.32 10zm96.546-75.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32zM38.16 24.134l1 1.732-17.32 10-1-1.732 17.32-10zM60 29v2H40v-2h20zm19.32 5l-1 1.732-17.32-10L62 24l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM111 40h-2V20h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zM40 49v2H20v-2h20zm19.32 5l-1 1.732-17.32-10L42 44l17.32 10zm-40 40l-1 1.732-17.32-10L2 84l17.32 10zm75.546-80.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32zM98.16 24.134l1 1.732-17.32 10-1-1.732 17.32-10zm-80 80l1 1.732-17.32 10-1-1.732 17.32-10zM80 49v2H60v-2h20zm19.32 5l-1 1.732-17.32-10L82 44l17.32 10zm-40 40l-1 1.732-17.32-10L62 84l17.32 10zm75.546-80.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32z' fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{ 
            mb: 1, 
            textAlign: 'center', 
            fontWeight: 800,
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
            color: '#5D1049',
            textShadow: '2px 2px 0px #FFB6C1',
            position: 'relative'
          }}
        >
          Awesome Learning Tools!
          <EmojiPeopleIcon sx={{ 
            position: 'absolute', 
            fontSize: 40, 
            top: -20, 
            right: { xs: 10, md: 100 },
            animation: 'bounce 2s infinite'
          }} />
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 5, 
            textAlign: 'center', 
            maxWidth: 700,
            mx: 'auto',
            fontWeight: 500,
            color: '#444',
            borderRadius: '20px',
            p: 2,
            backgroundColor: 'rgba(255,255,255,0.7)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
          }}
        >
          Discover super cool ways to learn about your body, feelings, and growing up! 
          Everything is safe, fun, and made just for you!
        </Typography>

        <Grid 
          container 
          spacing={4} 
          alignItems="stretch" 
          justifyContent="center"
          sx={{ mt: 2, maxWidth: "900px", mx: "auto" }} // Add max width to container
        >
          {flashcards.map((card, index) => (
            <Grid 
              xs={12} 
              sm={6} // 2 cards per row on small screens and up
              key={index} 
              sx={{ 
                display: 'flex',
                height: { xs: 'auto', sm: '400px' }, // Slightly smaller height
              }}
            >
              <Card 
                onClick={() => handleCardClick(card.component)}
                sx={{ 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                  border: '3px solid #fff',
                  position: 'relative',
                  height: '100%',
                  maxWidth: '350px', // Limit maximum width
                  mx: 'auto', // Center cards horizontally
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                    '& .card-icon-box': {
                      animation: `${card.animation} 1s infinite`
                    },
                    '& .card-action': {
                      opacity: 1,
                      transform: 'translateY(0) scale(1.1)'
                    }
                  }
                }}
              >
                {/* The icon box - use exact height but make it smaller */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    background: card.gradient, 
                    py: 3, // Reduce padding
                    height: '120px', // Smaller height
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {/* Keep the icon box code the same but make icons slightly smaller */}
                  <Box
                    className="card-icon-box"
                    sx={{
                      p: 1.5, // Smaller padding
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '2px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                    }}
                  >
                    {React.cloneElement(card.icon, { fontSize: 'large', style: { fontSize: '2.2rem' } })}
                  </Box>
                  
                  {/* Keep decorative elements */}
                  {[...Array(5)].map((_, i) => (
                    <Box 
                      key={i}
                      sx={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </Box>

                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2.5, // Slightly reduced padding
                    backgroundColor: '#fff',
                    height: 'calc(100% - 120px)', // Adjust based on icon area height
                  }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 800,
                        mb: 1.5, // Smaller margin
                        color: card.color,
                        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                        fontSize: { xs: '1.1rem', sm: '1.3rem' }, // Slightly smaller font
                        height: '2.6rem', // Slightly reduced height
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {card.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#444',
                        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                        lineHeight: 1.5,
                        fontSize: '0.9rem', // Slightly smaller font
                        height: '5.4rem', // Adjusted for smaller font
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    <Button
                      className="card-action"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        backgroundColor: card.color,
                        color: 'white',
                        borderRadius: '30px',
                        px: 2.5, // Smaller padding
                        py: 0.75, // Smaller padding
                        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        transform: 'translateY(10px)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        fontSize: '0.9rem', // Smaller font
                        '&:hover': {
                          backgroundColor: card.color,
                          opacity: 0.9,
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        }
                      }}
                    >
                      Let's Go!
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 5, 
            pt: 2,
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '20px',
            p: 2,
            maxWidth: '80%',
            mx: 'auto',
            border: '2px dashed #AB47BC',
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'bold',
              color: '#5D1049',
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
            }}
          >
            Everything here is super accurate and made just right for kids your age!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Ask;
