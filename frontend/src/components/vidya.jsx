import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Vidya = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi, I'm Vidya! I'm here to be your friend and help you learn. Ask me anything!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sample responses for demo purposes - in production, would connect to actual AI
  const demoResponses = [
    "That's a great question! Learning is always fun when we do it together!",
    "I think that's really interesting! Want to know more about it?",
    "Wow! You're so smart to ask about that! Let me explain...",
    "I love how curious you are! That's how we learn new things!",
    "That's something I know about! Let me share with you...",
    "What a thoughtful question! Let's explore that together!",
  ];

  // Check if the API is available when component mounts
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log("Checking API availability...");
        const response = await fetch('/');
        const data = await response.json();
        
        console.log("API health check response:", data);
        
        if (data.message === "Welcome to the Ollama Local Model API!") {
          setApiAvailable(true);
          console.log("API connection successful! Ollama Local Model API is available.");
          // Add a welcome message indicating API connection
          setMessages(prev => [
            ...prev, 
            { 
              type: 'bot', 
              text: "I'm connected to the AI brain! I can answer your questions with smart responses." 
            }
          ]);
        } else {
          console.warn("API responded but with unexpected format:", data);
          setApiAvailable(false);
          setMessages(prev => [
            ...prev, 
            { 
              type: 'bot', 
              text: "I'm running in demonstration mode right now. My responses will be pre-scripted." 
            }
          ]);
        }
      } catch (error) {
        console.error("API connection error:", error);
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        setApiAvailable(false);
        // Add a message indicating fallback mode
        setMessages(prev => [
          ...prev, 
          { 
            type: 'bot', 
            text: "I'm running in demonstration mode right now. My responses will be pre-scripted." 
          }
        ]);
      }
    };

    checkApiStatus();
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = { type: 'user', text: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);
    
    if (apiAvailable) {
      // If API is available, attempt to use it for responses
      try {
        console.log("Sending message to API:", userMessage.text);
        
        // Construct the request payload based on your API format
        const payload = {
          question: userMessage.text
        };
        
        console.log("API request payload:", payload);
        
        // Send request to the API
        const response = await fetch('/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          console.error("API response not OK:", {
            status: response.status,
            statusText: response.statusText
          });
          
          // Try to get error details from response if possible
          try {
            const errorData = await response.text();
            console.error("Error response body:", errorData);
          } catch (textError) {
            console.error("Could not read error response body:", textError);
          }
          
          throw new Error(`Failed to get response from API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("API response data:", data);
        
        // Hide typing indicator and add bot response
        // The response format appears to be { answer: "response text" }
        setIsTyping(false);
        
        if (data && data.answer) {
          setMessages(prev => [...prev, { type: 'bot', text: data.answer }]);
        } else {
          console.warn("Unexpected API response format:", data);
          setMessages(prev => [...prev, { type: 'bot', text: "I received a response but couldn't understand it. Let me try to help anyway!" }]);
        }
        
      } catch (error) {
        console.error("Error getting API response:", error);
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        // Fallback to demo responses if API call fails
        const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        setIsTyping(false);
        setMessages(prev => [
          ...prev, 
          { 
            type: 'bot', 
            text: "Sorry, I couldn't connect to my brain right now. " + randomResponse 
          }
        ]);
      }
    } else {
      // If API is not available, use demo responses
      setTimeout(() => {
        const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
      }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds
    }
    
    // Play sound if audio is enabled
    if (isAudioEnabled) {
      const audio = new Audio('/message-sound.mp3'); // Add a sound file to your project
      audio.play().catch(e => console.log("Audio play failed: ", e));
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleClose = () => {
    setIsChatOpen(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for exit animation
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-80 md:w-96 h-[500px] rounded-2xl shadow-xl overflow-hidden flex flex-col z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-400 py-3 px-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-300">
                {/* Cartoon avatar */}
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2995/2995401.png" 
                  alt="Vidya" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Vidya</h3>
                <div className="flex items-center">
                  <div className={`w-2 h-2 ${apiAvailable ? 'bg-green-400' : 'bg-yellow-400'} rounded-full mr-1`}></div>
                  <span className="text-xs text-white opacity-90">{apiAvailable ? 'Online' : 'Demo Mode'}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={toggleAudio}
                className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30 transition"
              >
                {isAudioEnabled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-purple-50"
            style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
              backgroundBlendMode: "soft-light"
            }}
          >
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {message.type === 'bot' && (
                  <div className="mr-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-300">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/2995/2995401.png" 
                        alt="Vidya"
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  </div>
                )}
                <div 
                  className={`rounded-2xl py-2 px-4 max-w-[70%] ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' 
                      : 'bg-gradient-to-br from-pink-400 to-red-400 text-white'
                  }`}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                </div>
                {message.type === 'user' && (
                  <div className="ml-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 font-bold border-2 border-purple-300">
                      {/* Replace with user avatar or initial */}
                      U
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-300">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/2995/2995401.png" 
                      alt="Vidya"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-400 to-red-400 rounded-2xl py-3 px-4">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messageEndRef} />
          </div>
          
          {/* Input Area */}
          <form 
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t-2 border-purple-100 flex items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your question..."
              className="flex-1 py-2 px-4 bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-900 placeholder-purple-300 text-sm md:text-base"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={inputValue.trim() === ''}
              className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${
                inputValue.trim() === '' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg'
              } transition-all`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2a1 1 0 00.894-.553l7-14A1 1 0 0017.894 2.553L10.894 2.553z" />
              </svg>
            </motion.button>
          </form>
          
          {/* Footer */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-400 py-1 px-3 text-center">
            <p className="text-white text-xs font-medium">
              Powered by {apiAvailable ? 'Ollama AI' : 'Vidya AI'} • Made with ❤️ for kids
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Vidya;