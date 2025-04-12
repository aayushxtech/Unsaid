import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, Avatar, IconButton, Container, Zoom, Grow } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios'; // Make sure axios is installed
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown'; // Changed from "MarkdownPreview from 'react-markdown'"

const Chatbot = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { 
      text: "Hi there! I'm DEVI, your friendly AI therapist and your freind. I'm here to chat about growing up, feelings, relationships, and all that fun stuff. What would you like to talk about today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [animation, setAnimation] = useState('idle');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const characterRef = useRef(null);
  
  // Add this at the top of your component
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/status');
        if (response.data.status !== "ready") {
          setError("The AI system is still initializing. Your questions may take longer to answer.");
        }
      } catch (err) {
        console.error("Failed to check backend status:", err);
        setError("Unable to connect to the AI system. Please try again later.");
      }
    };
    
    checkBackendStatus();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Character animations
  useEffect(() => {
    if (isThinking) {
      setAnimation('thinking');
    } else {
      // Occasionally have DEVI do a random animation
      const randomAnim = Math.random() > 0.7 ? 'wave' : 'idle';
      setAnimation(randomAnim);
      
      // Return to idle after a few seconds
      if (randomAnim !== 'idle') {
        const timer = setTimeout(() => {
          setAnimation('idle');
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isThinking, messages]);

  // Setup 3D character rotation effect
  useEffect(() => {
    const character = characterRef.current;
    if (!character) return;

    let frameId;
    let rotationY = 0;
    let targetRotationY = 0;
    let mouseX = 0;

    const handleMouseMove = (e) => {
      // Calculate normalized mouse position (-1 to 1)
      const windowWidth = window.innerWidth;
      mouseX = (e.clientX / windowWidth) * 2 - 1;
      
      // Set target rotation based on mouse position
      targetRotationY = mouseX * 15; // Max 15 degrees rotation
    };

    const animate = () => {
      // Smoothly interpolate current rotation towards target
      rotationY += (targetRotationY - rotationY) * 0.05;
      
      if (character) {
        character.style.transform = `perspective(1000px) rotateY(${rotationY}deg) ${
          animation === 'thinking' ? 'translateY(-5px)' : ''
        }`;
      }
      
      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [animation]);

  // Update the handleSendMessage function

const handleSendMessage = async () => {
  if (input.trim() === '') return;
  
  // Add user message to chat
  setMessages([...messages, { text: input, sender: 'user' }]);
  
  // Save the input and clear input field
  const userQuestion = input;
  setInput('');
  
  // Show thinking animation
  setIsThinking(true);
  setError(null);
  
  try {
    // Updated API call to match the FastAPI endpoint structure
    const response = await axios.post('http://localhost:5000/chat', {
      question: userQuestion
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("API Response:", response.data);
    
    // Get response from API - the FastAPI endpoint returns { "response": "answer" }
    const botResponse = response.data.response || "I'm not sure how to answer that right now.";
    
    // Process the bot response to separate paragraphs, bullets, etc.
    const processedResponse = {
      text: botResponse,
      type: 'text',
      generationTime: new Date().toISOString()
    };
    
    // Add bot's response to messages
    setIsThinking(false);
    setAnimation('happy');
    setMessages(prev => [
      ...prev, 
      { 
        ...processedResponse,
        sender: 'bot' 
      }
    ]);
    
    // Return to idle after showing happiness
    setTimeout(() => {
      setAnimation('idle');
    }, 2000);
    
  } catch (err) {
    console.error("API error details:", err);
    console.error("Response data:", err.response?.data);
    console.error("Response status:", err.response?.status);
    
    // Handle error
    setIsThinking(false);
    setAnimation('idle');
    setError("Sorry, I couldn't process that request. Please try again.");
    
    // Add error message to chat
    setMessages(prev => [
      ...prev, 
      { 
        text: "Sorry, I'm having trouble connecting right now. Can you try asking me again?", 
        sender: 'bot' 
      }
    ]);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 3D character model URLs based on expression
  const characterModels = {
    idle: '/devi.jpg', // Replace with actual image paths or 3D model URLs
    thinking: '/devi2.jpg',
    wave: '/devi.jpg',
    happy: '/devi.jpg'
  };

  return (
    <Container maxWidth="md">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes wave {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-20deg); }
            50% { transform: rotate(10deg); }
            75% { transform: rotate(-10deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .message-bubble {
            position: relative;
            transition: all 0.3s ease;
          }
          .message-bubble:hover {
            transform: scale(1.03);
          }
          .bot-bubble:before {
            content: '';
            position: absolute;
            left: -10px;
            top: 50%;
            border-right: 10px solid white;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
          }
          .user-bubble:after {
            content: '';
            position: absolute;
            right: -10px;
            top: 50%;
            border-left: 10px solid #ff7043;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
          }
          
          /* 3D Character Styles */
          .character-container {
            position: relative;
            width: 180px;
            height: 300px;
            perspective: 1000px;
            transform-style: preserve-3d;
          }
          
          .character-model {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.5s ease;
          }
          
          .character-shadow {
            position: absolute;
            bottom: -10px;
            left: 10%;
            width: 80%;
            height: 20px;
            background: radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%);
            border-radius: 50%;
            transform: rotateX(90deg);
            filter: blur(5px);
            z-index: -1;
            opacity: 0.6;
          }
          /* Existing animations... */
    
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
          }
          
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .highlight-text {
            background: linear-gradient(120deg, rgba(255,154,139,0.2) 0%, rgba(255,107,107,0.2) 100%);
            padding: 2px 4px;
            border-radius: 4px;
          }
        `}
      </style>

      <Paper 
        elevation={6} 
        sx={{ 
          height: '85vh',
          mt: 3,
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 6,
          overflow: 'hidden',
          border: '5px solid #FF9A8B',
          position: 'relative',
          background: 'linear-gradient(135deg, #f9f9ff 0%, #f0f2ff 100%)'
        }}
      >
        {/* Fun background elements */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          opacity: 0.05, 
          zIndex: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z\' fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
        }} />

        {/* Header */}
        <Box 
          sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, #FF9A8B 0%, #FF6B6B 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            zIndex: 5,
          }}
        >
          <IconButton onClick={onBack} sx={{ color: 'white', mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.3)', 
              mr: 2,
              width: 40,
              height: 40
            }}
          >
            <EmojiEmotionsIcon />
          </Avatar>
          
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }}>
              Chat with DEVI
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }}>
              Your friendly AI guide
            </Typography>
          </Box>
          
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <FavoriteIcon sx={{ fontSize: 18, mr: 1, color: 'pink' }} />
            <Typography variant="body2" fontWeight="bold">
              Always Here to Help
            </Typography>
          </Box>
        </Box>
        
        {/* Character and Chat Area */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left sidebar with 3D character */}
          <Box 
            sx={{ 
              width: '220px',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'linear-gradient(to bottom, rgba(255,154,139,0.1) 0%, rgba(255,107,107,0.1) 100%)',
              borderRight: '2px dashed rgba(255,107,107,0.3)',
              p: 2,
              overflow: 'hidden',
            }}
          >
            {/* 3D Character Container */}
            <Box className="character-container">
              {/* Choose display based on device capability */}
              {/* For actual implementation, replace with proper 3D model or character */}
              <Box
                ref={characterRef}
                className="character-model"
                sx={{
                  background: animation === 'idle' ? 
                    'url("/devi.jpg") center/contain no-repeat' : 
                    animation === 'thinking' ? 
                      'url("/devi2.jpg") center/contain no-repeat' :
                      animation === 'wave' ?
                        'url("/devi.jpg") center/contain no-repeat' :
                        'url("/devi2.jpg") center/contain no-repeat',
                  width: '100%',
                  height: '100%',
                  transformOrigin: 'center center',
                  animation: animation === 'thinking' ? 'pulse 1.5s infinite' : 
                             animation === 'wave' ? 'wave 1s' : 
                             animation === 'happy' ? 'bounce 0.5s' : 'float 3s infinite ease-in-out'
                }}
              />
              <Box className="character-shadow" />
            </Box>
            
            <Box 
              sx={{ 
                mt: 2, 
                backgroundColor: 'white', 
                borderRadius: '20px', 
                p: 2, 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '2px solid #FF9A8B',
                textAlign: 'center',
                animation: isThinking ? 'pulse 1.5s infinite' : 'none'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                  color: '#FF6B6B',
                  fontWeight: 'bold'
                }}
              >
                {isThinking ? "I'm thinking..." : "What's on your mind?"}
              </Typography>
            </Box>
          </Box>
          
          {/* Chat messages */}
          <Box 
            sx={{ 
              p: 3, 
              flexGrow: 1, 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              position: 'relative',
              zIndex: 1
            }}
          >
            {messages.map((message, index) => (
              <Grow 
                in={true} 
                key={index}
                timeout={300 + (index * 100)} 
                style={{ transformOrigin: message.sender === 'user' ? 'right' : 'left' }}
              >
                <Box 
                  sx={{ 
                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1
                  }}
                >
                  {message.sender === 'bot' && (
                    <Avatar
                      sx={{
                        display: { xs: 'flex', md: 'none' },
                        bgcolor: '#FF9A8B',
                        width: 35,
                        height: 35,
                        animation: isThinking ? 'pulse 1.5s infinite' : 'none'
                      }}
                    >
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {animation === 'thinking' ? '🤔' : 
                         animation === 'wave' ? '👋' : 
                         animation === 'happy' ? '😄' : '👧'}
                      </Typography>
                    </Avatar>
                  )}
                  
                  <Paper 
                    elevation={2}
                    className={`message-bubble ${message.sender === 'bot' ? 'bot-bubble' : 'user-bubble'}`}
                    sx={{ 
                      p: 2, 
                      borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px', 
                      backgroundColor: message.sender === 'user' ? '#ff7043' : 'white',
                      color: message.sender === 'user' ? 'white' : 'inherit',
                      border: message.sender === 'bot' ? '1px solid #e0e0e0' : 'none',
                      boxShadow: message.sender === 'bot' 
                        ? '0 4px 15px rgba(0,0,0,0.05)' 
                        : '0 4px 15px rgba(255,112,67,0.2)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {message.sender === 'bot' && (
                      <Box 
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '4px',
                          background: 'linear-gradient(90deg, #FF9A8B, #FF6B6B, #FF9A8B)',
                          backgroundSize: '200% 100%',
                          animation: 'gradientMove 2s ease infinite',
                        }}
                      />
                    )}
                    
                    <Box>
                      {message.text.split('\n').map((paragraph, i) => (
                        <Typography 
                          key={i}
                          sx={{ 
                            fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                            fontSize: '1rem',
                            lineHeight: 1.5,
                            mb: 1,
                            // For bot messages, add typewriter effect to the latest message
                            animation: message.sender === 'bot' && 
                                      index === messages.length - 1 && 
                                      i === 0 ? 
                                      'fadeIn 0.5s ease-out' : 'none',
                            '& strong': {
                              color: message.sender === 'bot' ? '#FF6B6B' : 'white',
                              fontWeight: 'bold',
                            },
                            '& em': {
                              fontStyle: 'italic',
                            },
                            '& ul, & ol': {
                              pl: 2,
                              mb: 1,
                            },
                            '& li': {
                              mb: 0.5,
                            }
                          }}
                        >
                          {paragraph}
                        </Typography>
                      ))}
                      
                      {message.sender === 'bot' && (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                            pt: 1,
                            borderTop: '1px dashed rgba(0,0,0,0.1)',
                            opacity: 0.7,
                            fontSize: '0.75rem',
                          }}
                        >
                          <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                            Generated by DEVI
                          </Typography>
                          
                          {message.generationTime && (
                            <Typography variant="caption">
                              {new Date(message.generationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>
              </Grow>
            ))}
            
            {isThinking && (
              <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    bgcolor: '#FF9A8B',
                    width: 35,
                    height: 35,
                    animation: 'pulse 1.5s infinite'
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>🤔</Typography>
                </Avatar>
                
                <Paper 
                  elevation={1}
                  sx={{ 
                    p: 2, 
                    borderRadius: '20px 20px 20px 5px', 
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    alignItems: 'center' 
                  }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: '#ff7043',
                      animation: 'pulse 0.6s infinite',
                      animationDelay: '0s'
                    }} />
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: '#ff7043',
                      animation: 'pulse 0.6s infinite',
                      animationDelay: '0.2s'
                    }} />
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: '#ff7043',
                      animation: 'pulse 0.6s infinite',
                      animationDelay: '0.4s'
                    }} />
                  </Box>
                  <Typography sx={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }}>
                    DEVI is thinking...
                  </Typography>
                </Paper>
              </Box>
            )}
            
            {error && (
              <Box sx={{ padding: 2, textAlign: 'center', color: 'error.main' }}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
        </Box>
        
        {/* Input area */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'white',
            borderRadius: '0 0 24px 24px',
            position: 'relative',
            zIndex: 2
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask DEVI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isThinking}
            sx={{ 
              mr: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '30px',
                backgroundColor: '#f8f9fa',
                '& fieldset': {
                  borderColor: '#FF9A8B',
                },
                '&:hover fieldset': {
                  borderColor: '#FF6B6B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B6B',
                  borderWidth: '2px',
                },
              }
            }}
            InputProps={{
              style: { fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }
            }}
          />
          <Zoom in={input.length > 0}>
            <Button 
              variant="contained" 
              color="primary" 
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={isThinking || !input.trim()}
              sx={{ 
                backgroundColor: '#ff7043', 
                borderRadius: '30px',
                px: 3,
                py: 1.2,
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                boxShadow: '0 4px 10px rgba(255,112,67,0.3)',
                '&:hover': {
                  backgroundColor: '#ff5722',
                  boxShadow: '0 6px 15px rgba(255,112,67,0.4)',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#ffccbc',
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            >
              Send
            </Button>
          </Zoom>
        </Paper>
      </Paper>
      
      <Box 
        sx={{
          maxWidth: 500,
          mx: 'auto',
          mb: 4,
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderRadius: 4,
          p: 2,
          border: '2px dashed #FF9A8B',
        }}
      >
        <Typography 
          sx={{
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
            color: '#444',
          }}
        >
          DEVI is your friendly guide to help you learn! Remember to talk to grown-ups you trust too! 💗
        </Typography>
      </Box>
    </Container>
  );
};

export default Chatbot;