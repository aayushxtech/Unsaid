import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Container, Paper, Typography, CircularProgress, Alert, Tooltip, Zoom } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoodIcon from '@mui/icons-material/Mood';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Remove the problematic animation imports
// Instead of trying to import missing animations, we'll use MUI icons as fallbacks

const Meme = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarState, setAvatarState] = useState('idle'); // idle, thinking, success, error
  const [isPulsing, setIsPulsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Pulsing effect for upload area
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 1500);
    
    return () => clearInterval(pulseInterval);
  }, []);

  // Get avatar icon based on state
  const getAvatarIcon = () => {
    switch (avatarState) {
      case 'thinking':
        return <SearchIcon sx={{ fontSize: 60, color: '#42a5f5' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 60, color: '#66bb6a' }} />;
      case 'error':
        return <ErrorOutlineIcon sx={{ fontSize: 60, color: '#f44336' }} />;
      default: // idle
        return <FactCheckIcon sx={{ fontSize: 60, color: '#42a5f5' }} />;
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
    setAvatarState('idle');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (files) => {
    if (files && files[0]) {
      const selectedFile = files[0];
      
      // Check if file is an image or video
      if (!selectedFile.type.match('image/*') && !selectedFile.type.match('video/*')) {
        setError("Please select an image or video file");
        setAvatarState('error');
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setAvatarState('thinking');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Call the image analysis service
      const response = await fetch('http://localhost:5001/api/analyze-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error(`Error 500: The backend service has a code issue. The 'fact_check' function appears to be missing.`);
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      }
      
      const result = await response.json();
      
      console.log("📝 AI Description:", result.description);
      console.log("✅ Fact Checked:", result.facts);
      
      // Set the analysis state with the result
      setAnalysis(result);
      setAvatarState('success');
    } catch (err) {
      console.error("Analysis failed:", err);
      setAvatarState('error');
      
      // More user-friendly error message with troubleshooting steps
      if (err.message.includes("fact_check") || err.message.includes("code issue")) {
        setError("There's a problem with the AI service code. The developer needs to define the 'fact_check' function in the backend.\n\nFor now, you can still see image descriptions but fact checking won't work.");
      } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Could not connect to the AI service. Please check that the service is running at port 5001. Try these steps:\n\n1. Make sure Ollama is running (run 'ollama serve' in a terminal)\n2. Check if the API process is active\n3. Verify that the service is listening on port 5001");
      } else {
        setError(`${err.message}\n\nTroubleshooting steps:\n1. Make sure Ollama is running (run 'ollama serve' in a terminal)\n2. Check if the API process is active\n3. Restart the service if necessary`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
    setError(null);
    setAvatarState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={5}
        sx={{
          py: 4,
          px: { xs: 2, md: 4 },
          borderRadius: 8,
          mt: 4,
          mb: 4,
          background: "linear-gradient(180deg, #f5f7fa 0%, #e8ebf2 100%)",
          border: '4px solid #42a5f5',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(66, 165, 245, 0.2)'
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
          overflow: 'hidden',
          opacity: 0.1,
        }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="polka-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle fill="#42a5f5" cx="3" cy="3" r="3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#polka-dots)" />
          </svg>
        </Box>

        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          variant="outlined"
          sx={{ 
            mb: 3,
            color: '#42a5f5',
            borderColor: '#42a5f5',
            borderRadius: '30px',
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
            fontWeight: 'bold',
            position: 'relative',
            zIndex: 1,
            '&:hover': {
              transform: 'scale(1.05)',
              borderColor: '#42a5f5',
              backgroundColor: 'rgba(66, 165, 245, 0.1)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Back to Tools
        </Button>

        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              mb: 2
            }}
          >
            <FactCheckIcon 
              sx={{ 
                fontSize: 70, 
                color: '#42a5f5',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                animation: isPulsing ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                  '100%': { transform: 'scale(1)' },
                }
              }} 
            />
          </Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
              color: '#42a5f5',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '1px'
            }}
          >
            Meme Detective
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 2,
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
              color: '#444',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 600
            }}
          >
            Is that meme telling the truth? Drop it here and become a fact-checking superhero!
          </Typography>
        </Box>

        {/* Avatar icon (replacing Lottie animation) */}
        <Box 
          sx={{
            position: 'absolute',
            right: { xs: '50%', md: 30 },
            top: { xs: 20, md: 20 },
            transform: { xs: 'translateX(50%)', md: 'none' },
            width: { xs: 80, md: 100 },
            height: { xs: 80, md: 100 },
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.85)',
            borderRadius: '50%',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            animation: isPulsing ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: { xs: 'translateX(50%) scale(1)', md: 'scale(1)' } },
              '50%': { transform: { xs: 'translateX(50%) scale(1.1)', md: 'scale(1.1)' } },
              '100%': { transform: { xs: 'translateX(50%) scale(1)', md: 'scale(1)' } },
            }
          }}
        >
          {getAvatarIcon()}
        </Box>

        {/* Main content area */}
        <Box sx={{ 
          p: 4, 
          backgroundColor: 'white', 
          borderRadius: 4,
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)',
          minHeight: '400px',
          position: 'relative',
          zIndex: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '10px',
            background: 'linear-gradient(90deg, #ff9a8b, #ff6b6b, #42a5f5, #66bb6a, #ab47bc)',
            borderRadius: '4px 4px 0 0'
          }
        }}>
          {!file && !analysis ? (
            <Box
              sx={{
                border: dragActive ? '3px solid #42a5f5' : '3px dashed #42a5f5',
                borderRadius: 4,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                bgcolor: dragActive ? 'rgba(66, 165, 245, 0.1)' : 'rgba(66, 165, 245, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: dragActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: dragActive ? '0 0 20px rgba(66, 165, 245, 0.3)' : 'none',
                '&:hover': {
                  bgcolor: 'rgba(66, 165, 245, 0.1)',
                  transform: 'scale(1.01)'
                },
              }}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 80, 
                  color: '#42a5f5', 
                  mb: 2,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2, 
                  fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                  color: '#42a5f5',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {dragActive ? "Drop your meme right here!" : "Drag and drop a meme or click to upload"}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
                Drop any picture or video meme here to check if it's telling the truth!
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                {['JPG', 'PNG', 'GIF', 'MP4'].map((format) => (
                  <Tooltip 
                    key={format} 
                    title={`${format} supported`} 
                    arrow 
                    TransitionComponent={Zoom}
                  >
                    <Box sx={{ 
                      p: 1, 
                      px: 2, 
                      bgcolor: 'rgba(66, 165, 245, 0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(66, 165, 245, 0.3)',
                      color: '#42a5f5',
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {format}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          ) : !analysis ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  mb: 3,
                  maxWidth: '100%',
                  maxHeight: '300px',
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '2px solid #42a5f5',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  position: 'relative'
                }}
              >
                {file && file.type.startsWith('image') ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px',
                      objectFit: 'contain'
                    }} 
                  />
                ) : (
                  <video 
                    src={preview} 
                    controls 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px' 
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    p: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <MoodIcon sx={{ color: '#42a5f5', fontSize: 30 }} />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={analyzeImage}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FactCheckIcon />}
                  sx={{
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                    backgroundColor: '#42a5f5',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(66, 165, 245, 0.5)',
                    '&:hover': {
                      backgroundColor: '#1e88e5',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 15px rgba(66, 165, 245, 0.6)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? "Analyzing..." : "Analyze This Meme"}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={resetAnalysis}
                  disabled={loading}
                  sx={{
                    borderRadius: '30px',
                    color: '#42a5f5',
                    borderColor: '#42a5f5',
                    fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                    '&:hover': {
                      borderColor: '#1e88e5',
                      backgroundColor: 'rgba(66, 165, 245, 0.05)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Choose Different File
                </Button>
              </Box>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3, 
                    width: '100%',
                    borderRadius: 2,
                    fontSize: '0.9rem',
                    '& .MuiAlert-message': {
                      fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                      whiteSpace: 'pre-line',
                    }
                  }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => window.open('http://localhost:5001/health', '_blank')}
                    >
                      Check Service
                    </Button>
                  }
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Oops! The Detective's Magnifying Glass Needs Help!
                  </Typography>
                  {error}
                </Alert>
              )}
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'stretch'
              }}
            >
              <Box sx={{ display: 'flex', mb: 3, gap: 3, flexDirection: {xs: 'column', md: 'row'} }}>
                <Box 
                  sx={{
                    maxWidth: {xs: '100%', md: '40%'},
                    flexShrink: 0,
                    borderRadius: 2,
                    border: '2px solid #42a5f5',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  {file && file.type.startsWith('image') ? (
                    <img 
                      src={preview} 
                      alt="Analyzed content" 
                      style={{ 
                        width: '100%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  ) : (
                    <video 
                      src={preview} 
                      controls 
                      style={{ width: '100%' }}
                    />
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      bgcolor: 'rgba(66, 165, 245, 0.05)',
                      border: '1px solid rgba(66, 165, 245, 0.2)',
                      height: '100%',
                      boxShadow: '0 10px 30px rgba(66, 165, 245, 0.15)'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                        color: '#1e88e5',
                        borderBottom: '2px solid #42a5f5',
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <EmojiEmotionsIcon sx={{ color: '#FFD700', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                      Detective Results:
                    </Typography>

                    {/* Visual Description */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                        color: '#444',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '&::before': {
                          content: '"🔍"',
                          marginRight: '8px',
                          fontSize: '1.3em'
                        }
                      }}
                    >
                      What's in this picture:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3, 
                        p: 2, 
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #ddd',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '30px',
                          background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                          pointerEvents: 'none',
                          opacity: 0.7
                        }
                      }}
                    >
                      {analysis?.description || 
                        "Our detective couldn't analyze this image. The AI model might not be properly loaded. Try refreshing the page or uploading a clearer image."}
                    </Typography>

                    {/* Fact Check */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                        color: '#444',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '&::before': {
                          content: '"🧐"',
                          marginRight: '8px',
                          fontSize: '1.3em'
                        }
                      }}
                    >
                      Fact Check:
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ 
                        p: 2, 
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #ddd',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)',
                        maxHeight: '150px',
                        overflowY: 'auto'
                      }}
                    >
                      {analysis?.facts || 
                        "Our fact-checker needs a bit more time. Make sure the AI service is running properly."}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={resetAnalysis}
                  sx={{
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                    backgroundColor: '#42a5f5',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(66, 165, 245, 0.5)',
                    '&:hover': {
                      backgroundColor: '#1e88e5',
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 6px 15px rgba(66, 165, 245, 0.6)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Check Another Meme
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Tips Section */}
          <Box 
            sx={{ 
              mt: 4, 
              p: 3, 
              bgcolor: 'rgba(255, 243, 224, 0.7)', 
              borderRadius: 3,
              border: '2px dashed #FFB74D',
              boxShadow: '0 5px 15px rgba(255, 183, 77, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '40px',
                height: '40px',
                background: '#FFB74D',
                borderRadius: '50%',
                opacity: 0.2
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                right: '-15px',
                width: '60px',
                height: '60px',
                background: '#FFB74D',
                borderRadius: '50%',
                opacity: 0.2
              }
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
                color: '#E65100',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&::before': {
                  content: '"💡"',
                  fontSize: '1.5em'
                }
              }}
            >
              Detective Tips:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                "Not everything you see online is true! Always question what you find.",
                "Check if the image has been edited or if it's showing the whole story.",
                "Look for clues like unusual lighting, blurry edges, or weird shadows.",
                "Remember: Even your friends might share false information without knowing it!"
              ].map((tip, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    gap: 1.5,
                    transition: 'all 0.3s ease',
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.6)',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: '#FFB74D', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body1" sx={{ color: '#555', fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }}>
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Meme;