import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import calculateAge from "../lib/calculateAge";
import getAgeGroup from "../lib/ageGroup";
import {
  User,
  Heart,
  Shield,
  MessageCircle,
  Star,
  CheckCircle,
} from "lucide-react";
import CharacterSelect from "./components/CharacterSelect";
import { motion } from "framer-motion"; // For animations

const Game3 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [choices, setChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [showMoral, setShowMoral] = useState(false);
  const [completedCharacters, setCompletedCharacters] = useState([]);

  const characters = [
    { id: "riya", name: "Riya", states: { idle: "/avatars/riya-idle.png" } },
    { id: "aarav", name: "Aarav", states: { idle: "/avatars/aarav-idle.png" } },
    { id: "zoya", name: "Zoya", states: { idle: "/avatars/zoya-idle.png" } },
    { id: "kabir", name: "Kabir", states: { idle: "/avatars/kabir-idle.png" } },
    { id: "meera", name: "Meera", states: { idle: "/avatars/meera-idle.png" } },
  ];

  const chapters = [
    // Riya's Journey
    {
      id: "riya",
      title: "Riya's Journey: Navigating Relationships",
      overview:
        "Riya is in a long-term relationship with Varun. She feels her boundaries are being pushed, and she struggles with self-worth. Help her navigate these challenges and make empowering decisions.",
      quiz: [
        {
          question:
            "What should Riya do when she feels her boundaries are being pushed?",
          options: [
            {
              id: "a",
              text: "Communicate openly with her partner",
              icon: <MessageCircle className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Ignore the issue and hope it resolves",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Seek advice from a trusted friend",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Open communication is key to resolving conflicts and maintaining healthy boundaries.",
            },
            b: {
              feedback:
                "Ignoring the issue may lead to further misunderstandings.",
            },
            c: {
              feedback:
                "Seeking advice can help, but Riya should also address the issue directly.",
            },
          },
        },
        {
          question: "How should Riya handle red flags in her relationship?",
          options: [
            {
              id: "a",
              text: "Confront Varun calmly and discuss her concerns",
              icon: <MessageCircle className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Ignore the red flags and focus on the positives",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Talk to a therapist for guidance",
              icon: <Heart className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Addressing concerns calmly can lead to constructive conversations.",
            },
            b: {
              feedback: "Ignoring red flags may lead to unresolved issues.",
            },
            c: {
              feedback:
                "Seeking professional help can provide clarity and support.",
            },
          },
        },
        {
          question: "What can Riya do to rebuild her self-worth?",
          options: [
            {
              id: "a",
              text: "Focus on her hobbies and passions",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Rely solely on Varun for validation",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Surround herself with supportive friends",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Engaging in hobbies can help Riya rediscover her identity.",
            },
            b: {
              feedback:
                "Relying solely on Varun may hinder her personal growth.",
            },
            c: {
              feedback:
                "Supportive friends can boost Riya's confidence and self-worth.",
            },
          },
        },
        {
          question: "How can Riya ensure her future relationships are healthy?",
          options: [
            {
              id: "a",
              text: "Set clear boundaries",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Avoid difficult conversations",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Focus on self-growth",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Setting boundaries ensures mutual respect and understanding.",
            },
            b: {
              feedback: "Avoiding conversations may lead to unresolved issues.",
            },
            c: {
              feedback:
                "Focusing on self-growth helps build healthier relationships.",
            },
          },
        },
      ],
      moral:
        "Healthy relationships are built on trust, communication, and mutual respect. Never lose yourself while trying to hold on to someone else.",
    },
    // Aarav's Journey
    {
      id: "aarav",
      title: "Aarav's Journey: Family Planning",
      overview:
        "Aarav and his wife are trying to start a family but face fertility challenges. Help Aarav navigate these concerns and make informed decisions.",
      quiz: [
        {
          question:
            "What should Aarav and his partner do to address their fertility concerns?",
          options: [
            {
              id: "a",
              text: "Visit a fertility specialist",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Wait and see if things improve naturally",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Discuss their concerns with family",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Consulting a specialist can provide clarity and options for family planning.",
            },
            b: { feedback: "Waiting may delay addressing potential issues." },
            c: {
              feedback:
                "Family support is valuable, but professional advice is crucial.",
            },
          },
        },
        {
          question:
            "How can Aarav support his wife emotionally during this time?",
          options: [
            {
              id: "a",
              text: "Listen to her concerns and offer reassurance",
              icon: <MessageCircle className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Avoid discussing the topic to reduce stress",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Encourage her to focus on work instead",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Listening and offering reassurance can strengthen their bond.",
            },
            b: {
              feedback: "Avoiding the topic may lead to emotional distance.",
            },
            c: {
              feedback:
                "Encouraging distractions may not address the root concerns.",
            },
          },
        },
        {
          question:
            "What lifestyle changes can Aarav and his wife make to improve fertility?",
          options: [
            {
              id: "a",
              text: "Adopt a healthier diet and exercise routine",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Rely on supplements without consulting a doctor",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Reduce stress through mindfulness practices",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback: "A healthy lifestyle can positively impact fertility.",
            },
            b: {
              feedback:
                "Supplements should only be taken under medical supervision.",
            },
            c: {
              feedback:
                "Mindfulness practices can help reduce stress and improve overall well-being.",
            },
          },
        },
        {
          question:
            "How should Aarav handle societal pressure about starting a family?",
          options: [
            {
              id: "a",
              text: "Focus on their journey",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Give in to pressure",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Avoid the topic",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Focusing on their journey ensures emotional well-being.",
            },
            b: {
              feedback: "Giving in to pressure may lead to unnecessary stress.",
            },
            c: {
              feedback: "Avoiding the topic may delay addressing concerns.",
            },
          },
        },
      ],
      moral:
        "Building a family is a journey that requires patience, understanding, and mutual support. Trust the process and prioritize your emotional well-being.",
    },
    // Zoya's Journey
    {
      id: "zoya",
      title: "Zoya's Journey: Exploring Safe Relationships",
      overview:
        "Zoya, a queer woman, is exploring a new relationship. She wants to ensure safety and mutual understanding while navigating contraception and trust. Help her make informed decisions.",
      quiz: [
        {
          question:
            "How should Zoya approach discussing contraception with her new partner?",
          options: [
            {
              id: "a",
              text: "Have an open and honest conversation",
              icon: <MessageCircle className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Avoid the topic to avoid discomfort",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Research options together",
              icon: <Heart className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Honest communication builds trust and ensures mutual understanding.",
            },
            b: {
              feedback: "Avoiding the topic may lead to misunderstandings.",
            },
            c: {
              feedback:
                "Researching together fosters collaboration and informed decisions.",
            },
          },
        },
        {
          question:
            "What should Zoya do if her partner is hesitant about contraception?",
          options: [
            {
              id: "a",
              text: "Respect their concerns and discuss alternatives",
              icon: <MessageCircle className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Ignore their concerns and make decisions alone",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Seek advice from a trusted LGBTQ+ community",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Respecting concerns and discussing alternatives fosters trust.",
            },
            b: { feedback: "Ignoring concerns may harm the relationship." },
            c: {
              feedback:
                "Seeking advice from a supportive community can provide valuable insights.",
            },
          },
        },
        {
          question: "How can Zoya ensure her relationship remains healthy?",
          options: [
            {
              id: "a",
              text: "Set clear boundaries and communicate openly",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Avoid difficult conversations to maintain peace",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Spend quality time together and build trust",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Clear boundaries and open communication are essential for a healthy relationship.",
            },
            b: {
              feedback:
                "Avoiding difficult conversations may lead to unresolved issues.",
            },
            c: {
              feedback: "Spending quality time together strengthens the bond.",
            },
          },
        },
        {
          question:
            "How can Zoya create a safe space for her partner to express themselves?",
          options: [
            {
              id: "a",
              text: "Be empathetic and listen actively",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Focus only on her needs",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Avoid sensitive topics to maintain peace",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Empathy and active listening foster trust and understanding.",
            },
            b: {
              feedback: "Focusing only on her needs may alienate her partner.",
            },
            c: {
              feedback:
                "Avoiding sensitive topics may hinder open communication.",
            },
          },
        },
      ],
      moral:
        "Healthy relationships thrive on trust, communication, and mutual respect. Embrace your identity and build connections that empower you.",
    },
    // Kabir's Journey
    {
      id: "kabir",
      title: "Kabir's Journey: Learning About Boundaries",
      overview:
        "Kabir is actively dating and learning about STIs and boundaries. Help him navigate these challenges and make responsible decisions.",
      quiz: [
        {
          question: "What should Kabir do after experiencing a condom failure?",
          options: [
            {
              id: "a",
              text: "Get tested for STIs and inform his partner",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Ignore the incident and move on",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Research STI prevention methods",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Getting tested and informing his partner shows responsibility and care.",
            },
            b: { feedback: "Ignoring the incident may lead to health risks." },
            c: {
              feedback:
                "Researching prevention methods is helpful, but immediate action is crucial.",
            },
          },
        },
        {
          question:
            "How should Kabir inform his partner about a potential STI risk?",
          options: [
            {
              id: "a",
              text: "Be honest and transparent",
              icon: <MessageCircle className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Avoid the topic to prevent discomfort",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Wait for symptoms to appear before discussing",
              icon: <Heart className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Honesty and transparency build trust and ensure safety.",
            },
            b: {
              feedback:
                "Avoiding the topic may harm the relationship and health.",
            },
            c: { feedback: "Waiting for symptoms may delay necessary action." },
          },
        },
        {
          question: "What can Kabir do to educate himself about sexual health?",
          options: [
            {
              id: "a",
              text: "Attend workshops and read reliable resources",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Rely on online forums for advice",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Avoid the topic altogether",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Educating himself through reliable resources ensures informed decisions.",
            },
            b: {
              feedback:
                "Online forums may provide inaccurate or misleading information.",
            },
            c: {
              feedback: "Avoiding the topic may lead to ignorance and risks.",
            },
          },
        },
        {
          question:
            "How can Kabir ensure his future relationships are safe and respectful?",
          options: [
            {
              id: "a",
              text: "Set boundaries and communicate openly",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Avoid discussing safety to maintain peace",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Focus solely on trust without discussing boundaries",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Setting boundaries and communicating openly fosters respect and safety.",
            },
            b: {
              feedback:
                "Avoiding discussions may lead to misunderstandings and risks.",
            },
            c: {
              feedback:
                "Trust is important, but boundaries ensure mutual respect.",
            },
          },
        },
      ],
      moral:
        "Respect and responsibility are the cornerstones of healthy relationships. Educate yourself and prioritize safety for yourself and your partner.",
    },
    // Meera's Journey
    {
      id: "meera",
      title: "Meera's Journey: Rebuilding Intimacy",
      overview:
        "Meera is navigating life after childbirth and feels disconnected from her partner. Help her rebuild intimacy and strengthen her relationship.",
      quiz: [
        {
          question:
            "How can Meera address her feelings of disconnection with her partner?",
          options: [
            {
              id: "a",
              text: "Have an open conversation about her feelings",
              icon: <MessageCircle className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Focus solely on her child and ignore the issue",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Seek professional counseling",
              icon: <Heart className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Open communication can help rebuild intimacy and understanding.",
            },
            b: {
              feedback:
                "Ignoring the issue may lead to further emotional distance.",
            },
            c: {
              feedback:
                "Counseling can provide tools to navigate post-pregnancy challenges.",
            },
          },
        },
        {
          question: "What should Meera do to prioritize her mental health?",
          options: [
            {
              id: "a",
              text: "Practice self-care and mindfulness",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Ignore her needs and focus solely on her family",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Seek support from friends and family",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Self-care and mindfulness can help Meera manage stress and improve well-being.",
            },
            b: {
              feedback:
                "Ignoring her needs may lead to burnout and emotional strain.",
            },
            c: {
              feedback:
                "Support from loved ones can provide emotional strength and encouragement.",
            },
          },
        },
        {
          question: "How can Meera rebuild intimacy with her partner?",
          options: [
            {
              id: "a",
              text: "Plan regular date nights and spend quality time together",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Avoid discussing her feelings to maintain peace",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Focus solely on her child and hope things improve",
              icon: <MessageCircle className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Quality time and regular date nights can help rekindle the connection.",
            },
            b: {
              feedback: "Avoiding discussions may lead to unresolved issues.",
            },
            c: {
              feedback:
                "Focusing solely on her child may neglect the relationship with her partner.",
            },
          },
        },
        {
          question: "What can Meera do to manage the challenges of parenthood?",
          options: [
            {
              id: "a",
              text: "Share responsibilities with her partner",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "b",
              text: "Take on all responsibilities herself",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              id: "c",
              text: "Seek advice from other parents",
              icon: <User className="w-4 h-4" />,
            },
          ],
          outcomes: {
            a: {
              feedback:
                "Sharing responsibilities can reduce stress and strengthen the partnership.",
            },
            b: {
              feedback: "Taking on all responsibilities may lead to burnout.",
            },
            c: {
              feedback:
                "Advice from other parents can provide valuable insights and support.",
            },
          },
        },
      ],
      moral:
        "Rebuilding intimacy after childbirth requires open communication, mutual support, and self-care. Prioritize your relationship and well-being to navigate this new chapter together.",
    },
  ];

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect in useEffect
  }

  const handleCharacterCompletion = () => {
    setCompletedCharacters((prev) => [...prev, selectedCharacter]);
    setSelectedCharacter(null);
    setGameStarted(false);
    setDialogIndex(0);
    setChoices({});
    setShowOutcome(false);
    setShowMoral(false);
  };

  const renderFinalSummary = () => (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-purple-800 mb-4">
        Congratulations!
      </h2>
      <p className="text-gray-700 mb-6">
        You’ve completed the journeys of all 5 characters. Here’s a summary of
        their stories:
      </p>
      <ul className="text-left mb-6">
        <li>
          🌟 <strong>Riya:</strong> Learned to set boundaries and rebuild her
          self-worth.
        </li>
        <li>
          🌟 <strong>Aarav:</strong> Navigated family planning with patience and
          understanding.
        </li>
        <li>
          🌟 <strong>Zoya:</strong> Built trust and mutual respect in her
          relationship.
        </li>
        <li>
          🌟 <strong>Kabir:</strong> Learned about boundaries and sexual health
          responsibility.
        </li>
        <li>
          🌟 <strong>Meera:</strong> Rebuilt intimacy and prioritized self-care
          after childbirth.
        </li>
      </ul>
      <div className="flex justify-center mb-6">
        <Star className="w-10 h-10 text-yellow-500" />
        <Star className="w-10 h-10 text-yellow-500" />
        <Star className="w-10 h-10 text-yellow-500" />
      </div>
      <p className="text-xl font-semibold text-purple-800">Good job!</p>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
      {!gameStarted ? (
        completedCharacters.length === characters.length ? (
          renderFinalSummary()
        ) : (
          <CharacterSelect
            characters={characters}
            completedCharacters={completedCharacters}
            onSelect={(character) => {
              setSelectedCharacter(character.id);
              setGameStarted(true);
            }}
            nextCharacter={characters[completedCharacters.length]?.id}
          />
        )
      ) : (
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Chapter Navigation */}
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              {
                chapters.find((chapter) => chapter.id === selectedCharacter)
                  ?.title
              }
            </h2>
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                {
                  chapters.find((chapter) => chapter.id === selectedCharacter)
                    ?.overview
                }
              </p>
            </div>

            {/* Quiz Area */}
            <div className="min-h-[300px] bg-purple-50 rounded-lg p-6 mb-6">
              {chapters.find((chapter) => chapter.id === selectedCharacter)
                ?.quiz[dialogIndex] && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-semibold text-purple-800 mb-4">
                    {
                      chapters.find(
                        (chapter) => chapter.id === selectedCharacter
                      )?.quiz[dialogIndex].question
                    }
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {chapters
                      .find((chapter) => chapter.id === selectedCharacter)
                      ?.quiz[dialogIndex].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            setChoices((prev) => ({
                              ...prev,
                              [selectedCharacter]: option.id,
                            }));
                            setShowOutcome(true);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 w-full p-4 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
                        >
                          {option.icon}
                          <span>{option.text}</span>
                        </motion.button>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Outcome Section */}
            {showOutcome && (
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 mt-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Outcome
                </h3>
                <p className="text-gray-700 mb-4">
                  {
                    chapters.find((chapter) => chapter.id === selectedCharacter)
                      ?.quiz[dialogIndex]?.outcomes[choices[selectedCharacter]]
                      ?.feedback
                  }
                </p>
                <button
                  onClick={() => {
                    setShowOutcome(false);
                    if (
                      dialogIndex <
                      chapters.find(
                        (chapter) => chapter.id === selectedCharacter
                      )?.quiz.length -
                        1
                    ) {
                      setDialogIndex((prev) => prev + 1);
                    } else {
                      setShowMoral(true);
                    }
                  }}
                  className="bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Moral Section */}
            {showMoral && (
              <motion.div
                className="bg-purple-50 rounded-lg p-6 mt-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-purple-800 mb-4">
                  Moral of the Story
                </h3>
                <p className="text-gray-700 mb-4">
                  {
                    chapters.find((chapter) => chapter.id === selectedCharacter)
                      ?.moral
                  }
                </p>
                <button
                  onClick={handleCharacterCompletion}
                  className="bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Game3;
