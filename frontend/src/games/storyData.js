// This file will contain all your story content

export const storyContent = {
  0: { // Story 0: Understanding Your Body
    title: "Understanding Your Body",
    description: "Learn about physical changes and body awareness",
    icon: "Favorite",
    color: "#7b1fa2",
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
      // More scenes would continue here...
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
};