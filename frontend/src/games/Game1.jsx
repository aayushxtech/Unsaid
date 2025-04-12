import React, { useState, useEffect } from "react";
import {
  Book,
  Navigation,
  User,
  Heart,
  Brain,
  Fingerprint,
  Shield,
  Pill,
  MessageCircleWarning,
  Hand,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Home,
  MessageCircle,
  Sparkles,
  Check,
  X,
} from "lucide-react";

export default function Game1() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [choices, setChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [characterAnimState, setCharacterAnimState] = useState("idle");

  const chapters = [
    {
      id: 0,
      title: "GROWTH - Sexual Health and Anatomy",
      icon: <Book className="w-8 h-8 text-purple-600" />,
      bgColor: "bg-purple-100",
      dialogs: [
        {
          speaker: "riya",
          text: "I've noticed some changes in my body lately, and I'm not sure what's normal. My period started last month and I have so many questions.",
          emotion: "confused",
        },
        {
          speaker: "aarav",
          text: "I get it. My voice keeps cracking when I talk and it's embarrassing. Everyone laughs but I don't know why it's happening.",
          emotion: "embarrassed",
        },
        {
          speaker: "riya",
          text: "Yesterday in biology class, someone said that irregular periods mean something is seriously wrong with you. Is that true?",
          emotion: "worried",
        },
        {
          speaker: "aarav",
          text: "And some guys were saying that voice changes mean... other things are changing too. I'm confused about what's actually true.",
          emotion: "confused",
        },
        {
          speaker: "narrator",
          text: "Riya and Aarav are experiencing normal puberty changes, but myths and misinformation are causing unnecessary worry. What should they do?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Talk to the school nurse",
          icon: <User className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Research online",
          icon: <Navigation className="w-4 h-4" />,
        },
        { id: "c", text: "Ignore it", icon: <X className="w-4 h-4" /> },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "riya",
              text: "We decided to visit the school nurse yesterday. I was nervous at first...",
              emotion: "relieved",
            },
            {
              speaker: "aarav",
              text: "But she was really understanding and didn't make us feel embarrassed at all.",
              emotion: "happy",
            },
            {
              speaker: "riya",
              text: "She explained that irregular periods are actually common when you first start menstruating. I feel so much better knowing that!",
              emotion: "happy",
            },
            {
              speaker: "aarav",
              text: "And she said voice cracking is just part of how boys' voices change during puberty. Nothing to worry about.",
              emotion: "relieved",
            },
            {
              speaker: "narrator",
              text: "The school nurse provided accurate information about puberty and created a safe space for questions. Riya and Aarav learned that their changes are normal parts of development.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Great choice! Seeking information from a trusted healthcare professional provides accurate information.",
          rating: "positive",
        },
        b: {
          dialogs: [
            {
              speaker: "riya",
              text: "I found this website that explains menstrual cycles, but then I saw this other site that said something completely different...",
              emotion: "confused",
            },
            {
              speaker: "aarav",
              text: "Same here. Some sources were helpful, but others seemed like they were just trying to sell products.",
              emotion: "skeptical",
            },
            {
              speaker: "riya",
              text: "How do we know which information to trust?",
              emotion: "worried",
            },
            {
              speaker: "aarav",
              text: "Maybe we should look for sites from health organizations or doctors?",
              emotion: "thinking",
            },
            {
              speaker: "narrator",
              text: "They found some helpful resources but also encountered misleading information. They realized the importance of verifying sources.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Looking for information is good, but it's important to find reliable sources.",
          rating: "neutral",
        },
        c: {
          dialogs: [
            {
              speaker: "riya",
              text: "Maybe if we just don't talk about it, these changes will start making sense on their own?",
              emotion: "worried",
            },
            {
              speaker: "aarav",
              text: "I heard that if your voice cracks, it means... well, I'm not even sure what it means now.",
              emotion: "confused",
            },
            {
              speaker: "riya",
              text: "Someone told me that having cramps means something is wrong with me. I'm getting really worried...",
              emotion: "sad",
            },
            {
              speaker: "aarav",
              text: "I wish we had better information instead of just rumors.",
              emotion: "frustrated",
            },
            {
              speaker: "narrator",
              text: "Without proper information, their confusion grew and they started believing some myths heard at school.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Ignoring questions about your body can lead to more worry and misinformation.",
          rating: "negative",
        },
      },
      learning:
        "Understanding reproductive anatomy, hormonal changes, and STI awareness.",
    },
    {
      id: 1,
      title: "LOVE - Relationships and Consent",
      icon: <Heart className="w-8 h-8 text-red-600" />,
      bgColor: "bg-red-100",
      dialogs: [
        {
          speaker: "aarav",
          text: "Did you go to Priya's party last weekend? It got really awkward at one point.",
          emotion: "uncomfortable",
        },
        {
          speaker: "riya",
          text: "What happened?",
          emotion: "curious",
        },
        {
          speaker: "aarav",
          text: "During truth or dare, Sanjay kept pressuring me to kiss Neha as a dare. Everyone was laughing and egging him on.",
          emotion: "uncomfortable",
        },
        {
          speaker: "riya",
          text: "That's not cool. I was talking to Maya yesterday, and she didn't understand why I said no when her cousin tried to hug me. She said I was being rude.",
          emotion: "frustrated",
        },
        {
          speaker: "aarav",
          text: "It feels weird when everyone expects you to be okay with something you're not comfortable with.",
          emotion: "frustrated",
        },
        {
          speaker: "narrator",
          text: "Riya and Aarav are facing situations where their boundaries aren't being respected. What should they do?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Speak up against the pressure",
          icon: <MessageCircle className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Talk to an adult about it later",
          icon: <User className="w-4 h-4" />,
        },
        {
          id: "c",
          text: "Go along with the group",
          icon: <Check className="w-4 h-4" />,
        },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "aarav",
              text: "At the party, I finally said 'I'm not doing that. Nobody should be forced to kiss someone as a dare.'",
              emotion: "confident",
            },
            {
              speaker: "riya",
              text: "That must have been hard. What happened?",
              emotion: "surprised",
            },
            {
              speaker: "aarav",
              text: "Some people rolled their eyes, but Neha actually thanked me later. And Raj backed me up too.",
              emotion: "proud",
            },
            {
              speaker: "riya",
              text: "I told Maya that everyone has the right to decide who touches them, even for a hug. It was uncomfortable, but she seemed to understand eventually.",
              emotion: "relieved",
            },
            {
              speaker: "narrator",
              text: "Standing up was uncomfortable but created an important conversation about boundaries. Some friends respected their choices.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Standing up for boundaries takes courage but helps establish healthy relationships.",
          rating: "positive",
        },
        b: {
          dialogs: [
            {
              speaker: "riya",
              text: "I talked to my older sister about what happened with Maya. She helped me understand how to explain consent better.",
              emotion: "thoughtful",
            },
            {
              speaker: "aarav",
              text: "My football coach overheard some guys talking about the party and pulled me aside. He said those dares aren't okay and explained why it matters.",
              emotion: "relieved",
            },
            {
              speaker: "riya",
              text: "Do you wish you had said something in the moment?",
              emotion: "curious",
            },
            {
              speaker: "aarav",
              text: "Yeah, I do. Next time I'll be more prepared to speak up right away.",
              emotion: "determined",
            },
            {
              speaker: "narrator",
              text: "The adults helped them understand the importance of consent, but they wished they had acted in the moment.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Getting advice helps, but you might miss the chance to set boundaries in the moment.",
          rating: "neutral",
        },
        c: {
          dialogs: [
            {
              speaker: "aarav",
              text: "I ended up giving in at the party. I didn't want to make a scene.",
              emotion: "regretful",
            },
            {
              speaker: "riya",
              text: "I've been letting Maya's cousin hug me even though it makes me uncomfortable. It just seemed easier.",
              emotion: "sad",
            },
            {
              speaker: "aarav",
              text: "But now Sanjay thinks it's okay to dare people to do things like that all the time.",
              emotion: "worried",
            },
            {
              speaker: "riya",
              text: "And I get anxious whenever I know Maya's cousin will be around. I wish I had just been honest from the start.",
              emotion: "anxious",
            },
            {
              speaker: "narrator",
              text: "Going along with pressure left them feeling uncomfortable and set a concerning precedent for future situations.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Going along with something that makes you uncomfortable often leads to more discomfort later.",
          rating: "negative",
        },
      },
      learning: "Learn about boundaries, consent, and peer pressure.",
    },
    {
      id: 2,
      title: "EMOTIONS - Emotional Well-being",
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      bgColor: "bg-blue-100",
      dialogs: [
        {
          speaker: "riya",
          text: "I'm so stressed about exams. I stayed up until 2 AM studying, and I still don't feel prepared.",
          emotion: "stressed",
        },
        {
          speaker: "aarav",
          text: "At least you have your friend group. Nikhil isn't talking to me anymore after we argued about that cricket match.",
          emotion: "sad",
        },
        {
          speaker: "riya",
          text: "My parents expect perfect scores. Sometimes I feel like I can't breathe thinking about disappointing them.",
          emotion: "anxious",
        },
        {
          speaker: "aarav",
          text: "I pretend everything's fine, but eating lunch alone every day this week has been really hard.",
          emotion: "lonely",
        },
        {
          speaker: "narrator",
          text: "Riya and Aarav are dealing with emotional challenges. How should they handle these feelings?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Suppress feelings and focus on other things",
          icon: <X className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Open up to someone trustworthy",
          icon: <MessageCircle className="w-4 h-4" />,
        },
        {
          id: "c",
          text: "Find healthy outlets like art or exercise",
          icon: <Sparkles className="w-4 h-4" />,
        },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "riya",
              text: "I've been trying to ignore how stressed I feel. I just need to study harder.",
              emotion: "tense",
            },
            {
              speaker: "aarav",
              text: "Same here. I've been pretending the situation with Nikhil doesn't bother me.",
              emotion: "forcing a smile",
            },
            {
              speaker: "riya",
              text: "But I've been having trouble sleeping, and I can't concentrate during class.",
              emotion: "exhausted",
            },
            {
              speaker: "aarav",
              text: "I keep getting headaches, and yesterday I snapped at my little sister for no reason.",
              emotion: "irritated",
            },
            {
              speaker: "narrator",
              text: "Ignoring emotions made them build up, eventually affecting concentration and sleep.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Suppressing emotions often causes them to emerge in other ways, affecting health and relationships.",
          rating: "negative",
        },
        b: {
          dialogs: [
            {
              speaker: "riya",
              text: "I finally talked to my mom about the pressure I feel. I was crying, but it felt good to be honest.",
              emotion: "vulnerable",
            },
            {
              speaker: "aarav",
              text: "What did she say?",
              emotion: "curious",
            },
            {
              speaker: "riya",
              text: "She said she cares more about my wellbeing than perfect grades. She didn't realize how anxious I was feeling.",
              emotion: "relieved",
            },
            {
              speaker: "aarav",
              text: "That's great. I talked to my coach about feeling isolated, and he helped me see how I could make the first move to resolve things with Nikhil.",
              emotion: "hopeful",
            },
            {
              speaker: "narrator",
              text: "Sharing with someone supportive provided relief and helpful perspective on their situations.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Talking about feelings with someone you trust can provide relief and new perspectives.",
          rating: "positive",
        },
        c: {
          dialogs: [
            {
              speaker: "riya",
              text: "I started a stress journal where I draw and write about how I'm feeling. It helps me process everything.",
              emotion: "creative",
            },
            {
              speaker: "aarav",
              text: "I've been going for runs in the morning. The physical activity clears my head.",
              emotion: "energized",
            },
            {
              speaker: "riya",
              text: "Has it helped with the Nikhil situation?",
              emotion: "curious",
            },
            {
              speaker: "aarav",
              text: "Actually, yes. Running gives me time to think about things more clearly. And I feel more confident to handle whatever happens.",
              emotion: "confident",
            },
            {
              speaker: "narrator",
              text: "Creative and physical outlets helped them process emotions and build confidence through accomplishments.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Creative and physical activities provide healthy ways to process emotions and build resilience.",
          rating: "positive",
        },
      },
      learning:
        "Emotional awareness, managing stress and anxiety, building resilience.",
    },
    {
      id: 3,
      title: "IDENTITY - Orientation and Gender",
      icon: <Fingerprint className="w-8 h-8 text-green-600" />,
      bgColor: "bg-green-100",
      dialogs: [
        {
          speaker: "aarav",
          text: "Sometimes I feel like I don't fit the 'typical boy' mold. I like dance and poetry more than cricket, and people make fun of me for it.",
          emotion: "uncertain",
        },
        {
          speaker: "riya",
          text: "Did you hear that Preeti came out as bisexual yesterday? Some students were supportive, but others were saying really hurtful things.",
          emotion: "concerned",
        },
        {
          speaker: "aarav",
          text: "I've been thinking a lot about gender roles lately. Why do we expect girls to be one way and boys another?",
          emotion: "thoughtful",
        },
        {
          speaker: "riya",
          text: "I know. My cousin identifies as non-binary now, and my aunt is struggling to understand.",
          emotion: "empathetic",
        },
        {
          speaker: "narrator",
          text: "Aarav and Riya are exploring questions of identity while witnessing both acceptance and prejudice. What should they do?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Support the classmate and explore identity questions",
          icon: <Heart className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Stay neutral in class but research privately",
          icon: <Book className="w-4 h-4" />,
        },
        {
          id: "c",
          text: "Keep feelings inside and conform to expectations",
          icon: <X className="w-4 h-4" />,
        },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "riya",
              text: "I spoke up when people were saying mean things about Preeti. It wasn't easy, but it felt right.",
              emotion: "determined",
            },
            {
              speaker: "aarav",
              text: "I've been more open about my interests too. I joined the dance team despite what some people might say.",
              emotion: "proud",
            },
            {
              speaker: "riya",
              text: "Preeti said having allies made a huge difference. And we've found other friends who accept everyone for who they are.",
              emotion: "happy",
            },
            {
              speaker: "aarav",
              text: "I'm understanding myself better too. It's okay to just be me, not what others expect.",
              emotion: "confident",
            },
            {
              speaker: "narrator",
              text: "Supporting others and exploring identity led to greater self-understanding and forming an inclusive friend group.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Supporting others and being authentic helps create a more inclusive environment for everyone.",
          rating: "positive",
        },
        b: {
          dialogs: [
            {
              speaker: "aarav",
              text: "I've been reading about gender identity and expression online. There's so much I didn't know.",
              emotion: "curious",
            },
            {
              speaker: "riya",
              text: "I borrowed some books from the library about LGBTQ+ experiences. It's helping me understand my cousin better.",
              emotion: "thoughtful",
            },
            {
              speaker: "aarav",
              text: "But when Kabir said those mean things about Preeti in class, I didn't say anything. I regret that.",
              emotion: "regretful",
            },
            {
              speaker: "riya",
              text: "It's hard to speak up sometimes. But I wonder if our silence made things worse.",
              emotion: "concerned",
            },
            {
              speaker: "narrator",
              text: "Learning more helped develop understanding, but not speaking up when others were unsupportive created regret.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Learning is good, but silence can sometimes be interpreted as agreement with harmful views.",
          rating: "neutral",
        },
        c: {
          dialogs: [
            {
              speaker: "aarav",
              text: "I dropped out of the dance audition and joined cricket instead. It's just easier to fit in.",
              emotion: "resigned",
            },
            {
              speaker: "riya",
              text: "I haven't talked to my cousin much since they came out. I'm not sure what to say.",
              emotion: "avoidant",
            },
            {
              speaker: "aarav",
              text: "Do you ever feel like you're just playing a role that everyone expects?",
              emotion: "unhappy",
            },
            {
              speaker: "riya",
              text: "All the time. But isn't that just part of growing up?",
              emotion: "doubtful",
            },
            {
              speaker: "narrator",
              text: "Suppressing questions about identity led to continued discomfort and disconnection from their authentic selves.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Conforming to expectations at the cost of authenticity often leads to inner conflict.",
          rating: "negative",
        },
      },
      learning:
        "Explore gender identity, orientation, inclusivity, and stereotypes.",
    },
    {
      id: 4,
      title: "CYBER - Online Safety and Privacy",
      icon: <Shield className="w-8 h-8 text-yellow-600" />,
      bgColor: "bg-yellow-100",
      dialogs: [
        {
          speaker: "riya",
          text: "Someone took a screenshot of me falling asleep in class and made it into a meme. It's all over school social media now.",
          emotion: "embarrassed",
        },
        {
          speaker: "aarav",
          text: "That's awful. You know what's weird? I got a DM from someone I don't know who says they go to a nearby school. They're asking for personal photos.",
          emotion: "suspicious",
        },
        {
          speaker: "riya",
          text: "I'm so embarrassed. People are tagging me and making jokes. I don't even want to go to school tomorrow.",
          emotion: "humiliated",
        },
        {
          speaker: "aarav",
          text: "This person keeps messaging me. They're offering to send me game credits if I send pictures or meet up.",
          emotion: "uncomfortable",
        },
        {
          speaker: "narrator",
          text: "Riya and Aarav are facing online challenges that feel overwhelming. What should they do?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Report inappropriate content and messages",
          icon: <Shield className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Talk to a parent or teacher",
          icon: <User className="w-4 h-4" />,
        },
        {
          id: "c",
          text: "Delete accounts and withdraw",
          icon: <X className="w-4 h-4" />,
        },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "riya",
              text: "I reported every post with that meme and messaged the account admins explaining why it was hurtful.",
              emotion: "determined",
            },
            {
              speaker: "aarav",
              text: "I blocked and reported that account that was messaging me. Turns out they were sending the same messages to other kids too.",
              emotion: "relieved",
            },
            {
              speaker: "riya",
              text: "Most of the posts got taken down, and some friends posted supportive messages. It helped a lot.",
              emotion: "grateful",
            },
            {
              speaker: "aarav",
              text: "The school IT department is now looking into that account. They said it might not even be a student.",
              emotion: "concerned",
            },
            {
              speaker: "narrator",
              text: "Reporting helped remove harmful content and block inappropriate contacts, protecting themselves and others.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Using platform reporting tools helps address problems and protect the community.",
          rating: "positive",
        },
        b: {
          dialogs: [
            {
              speaker: "riya",
              text: "I showed my dad what was happening with the meme. He was really understanding and helped me talk to my teacher.",
              emotion: "relieved",
            },
            {
              speaker: "aarav",
              text: "I told Ms. Sharma about the strange messages. She explained that this is actually a common scam targeting teenagers.",
              emotion: "surprised",
            },
            {
              speaker: "riya",
              text: "The school counselor talked to our class about digital citizenship without singling anyone out.",
              emotion: "grateful",
            },
            {
              speaker: "aarav",
              text: "My parents helped me strengthen my privacy settings and showed me how to recognize suspicious accounts.",
              emotion: "secure",
            },
            {
              speaker: "narrator",
              text: "Adults provided guidance on handling the situation and strengthening privacy settings.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Adults often have experience dealing with online issues and can provide valuable support.",
          rating: "positive",
        },
        c: {
          dialogs: [
            {
              speaker: "riya",
              text: "I deleted all my social media accounts. I can't deal with seeing that meme anymore.",
              emotion: "overwhelmed",
            },
            {
              speaker: "aarav",
              text: "I deleted my gaming accounts too after those messages. It feels safer that way.",
              emotion: "anxious",
            },
            {
              speaker: "riya",
              text: "But now I'm missing announcements about school events, and everyone's asking why I disappeared.",
              emotion: "isolated",
            },
            {
              speaker: "aarav",
              text: "And I heard that person is now messaging other students. I feel guilty for not reporting them first.",
              emotion: "regretful",
            },
            {
              speaker: "narrator",
              text: "Deleting accounts temporarily felt safe but didn't address the underlying issues or prevent future problems.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Running away from problems doesn't usually solve them and can isolate you from support.",
          rating: "negative",
        },
      },
      learning:
        "Learn digital consent, protecting privacy, and dealing with cyberbullying.",
    },
    {
      id: 5,
      title: "CONTRACEPTIVE - Prevention and Protection",
      icon: <Pill className="w-8 h-8 text-pink-600" />,
      bgColor: "bg-pink-100",
      dialogs: [
        {
          speaker: "riya",
          text: "Our school is having that relationship workshop tomorrow. The permission slip says they'll discuss contraception.",
          emotion: "neutral",
        },
        {
          speaker: "aarav",
          text: "Yeah, some students were giggling about it, but it seems like important information.",
          emotion: "thoughtful",
        },
        {
          speaker: "riya",
          text: "Tanvi was asking if emergency contraception is the same as abortion. Nobody seemed to know the answer.",
          emotion: "confused",
        },
        {
          speaker: "aarav",
          text: "And Rohit was wondering where teens can get help if they need it. It's awkward to talk about, but people have real questions.",
          emotion: "concerned",
        },
        {
          speaker: "narrator",
          text: "The workshop will cover important health information, but the topic makes many students uncomfortable. How should Riya and Aarav approach it?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Ignore the awkwardness and participate",
          icon: <Check className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Join the session but stay quiet",
          icon: <User className="w-4 h-4" />,
        },
        {
          id: "c",
          text: "Ask anonymous questions",
          icon: <MessageCircle className="w-4 h-4" />,
        },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "aarav",
              text: "During the workshop, I actually asked about the difference between various contraceptive methods. It was a little embarrassing, but worth it.",
              emotion: "brave",
            },
            {
              speaker: "riya",
              text: "I added to the conversation about emergency contraception. The facilitator explained how it works and how it's different from abortion.",
              emotion: "engaged",
            },
            {
              speaker: "aarav",
              text: "Once we started asking questions, others did too. It became much less awkward.",
              emotion: "surprised",
            },
            {
              speaker: "riya",
              text: "The facilitator gave us information about youth health clinics that provide confidential services. That could help a lot of people.",
              emotion: "pleased",
            },
            {
              speaker: "narrator",
              text: "Active participation helped normalize important conversations and provided accurate information.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Active participation helps normalize important health conversations and benefits everyone.",
          rating: "positive",
        },
        b: {
          dialogs: [
            {
              speaker: "riya",
              text: "I went to the workshop but didn't say anything. It was actually really informative.",
              emotion: "reflective",
            },
            {
              speaker: "aarav",
              text: "Same here. I learned a lot about different methods and their effectiveness rates.",
              emotion: "thoughtful",
            },
            {
              speaker: "riya",
              text: "I still wonder about some things, but I was too shy to ask in front of everyone.",
              emotion: "hesitant",
            },
            {
              speaker: "aarav",
              text: "Me too. I wish I had asked about where teens can access these services. Maybe we can look it up later?",
              emotion: "curious",
            },
            {
              speaker: "narrator",
              text: "They learned useful information but missed the chance to clarify specific questions.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Attending is better than avoiding, but you might miss answers to your specific questions.",
          rating: "neutral",
        },
        c: {
          dialogs: [
            {
              speaker: "riya",
              text: "The anonymous question box was a great idea. I asked about emergency contraception without anyone knowing it was me.",
              emotion: "relieved",
            },
            {
              speaker: "aarav",
              text: "I submitted a question about local youth health resources. The facilitator gave really detailed answers.",
              emotion: "satisfied",
            },
            {
              speaker: "riya",
              text: "It was much less stressful than asking out loud, but we still got the information.",
              emotion: "comfortable",
            },
            {
              speaker: "aarav",
              text: "They're going to compile all the Q&As into a resource sheet for students. That will help people who were too shy to come to the workshop.",
              emotion: "pleased",
            },
            {
              speaker: "narrator",
              text: "Anonymous questions allowed them to get information while maintaining comfort levels.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Anonymous questions are a great way to get information without feeling embarrassed.",
          rating: "positive",
        },
      },
      learning:
        "Understanding contraception options, STI protection, and accessing reproductive health services.",
    },
    {
      id: 6,
      title: "DIALOGUE - Effective Communication",
      icon: <MessageCircleWarning className="w-8 h-8 text-orange-600" />,
      bgColor: "bg-orange-100",
      dialogs: [
        {
          speaker: "aarav",
          text: "My parents never listen when I try to talk about anything important. They just lecture me.",
          emotion: "frustrated",
        },
        {
          speaker: "riya",
          text: "At least they talk to you. Mine just say 'we'll discuss it later' and never do.",
          emotion: "disappointed",
        },
        {
          speaker: "aarav",
          text: "I want to tell them about wanting to switch from science to arts stream, but I'm afraid they'll get angry.",
          emotion: "anxious",
        },
        {
          speaker: "riya",
          text: "And I need to talk to my friend Sanya about how she's been excluding me lately, but I don't want to start a fight.",
          emotion: "worried",
        },
        {
          speaker: "narrator",
          text: "Riya and Aarav both want to have difficult conversations but aren't sure how to approach them. What should they do?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Practice assertive communication",
          icon: <MessageCircle className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Write a letter or text message",
          icon: <Book className="w-4 h-4" />,
        },
        {
          id: "c",
          text: "Avoid the conversation",
          icon: <X className="w-4 h-4" />,
        },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "riya",
              text: "I practiced what I wanted to say to Sanya first. I used 'I feel' statements instead of blaming her.",
              emotion: "thoughtful",
            },
            {
              speaker: "aarav",
              text: "How did it go?",
              emotion: "curious",
            },
            {
              speaker: "riya",
              text: "She actually listened. She didn't realize how her actions were affecting me. We're going to hang out this weekend.",
              emotion: "relieved",
            },
            {
              speaker: "aarav",
              text: "I chose a calm moment and told my parents I wanted to discuss something important. I explained my passion for arts and listened to their concerns too.",
              emotion: "hopeful",
            },
            {
              speaker: "narrator",
              text: "Using assertive communication helped them express needs clearly while respecting others.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Clear, respectful communication often leads to better understanding on both sides.",
          rating: "positive",
        },
        b: {
          dialogs: [
            {
              speaker: "aarav",
              text: "I wrote my parents a letter explaining why I'm interested in arts instead of science. It gave me time to organize my thoughts.",
              emotion: "thoughtful",
            },
            {
              speaker: "riya",
              text: "Did they respond well?",
              emotion: "curious",
            },
            {
              speaker: "aarav",
              text: "Better than I expected. They asked to talk about it after reading the letter, and they seemed more open to listening.",
              emotion: "surprised",
            },
            {
              speaker: "riya",
              text: "I sent Sanya a message about how I've been feeling. She said she had no idea and appreciated me telling her.",
              emotion: "relieved",
            },
            {
              speaker: "narrator",
              text: "Writing allowed them to express themselves clearly without emotional interruptions.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Writing can help organize thoughts and give the other person time to process before responding.",
          rating: "positive",
        },
        c: {
          dialogs: [
            {
              speaker: "riya",
              text: "I decided not to say anything to Sanya. It's probably not worth the drama.",
              emotion: "resigned",
            },
            {
              speaker: "aarav",
              text: "I'm just going along with science for now. Maybe my parents will change their minds later.",
              emotion: "hopeless",
            },
            {
              speaker: "riya",
              text: "But I still feel hurt when Sanya excludes me, and now it's happening more often.",
              emotion: "sad",
            },
            {
              speaker: "aarav",
              text: "And I'm really struggling with the science courses. My grades are dropping, but my parents don't understand why.",
              emotion: "stressed",
            },
            {
              speaker: "narrator",
              text: "Avoiding difficult conversations allowed problems to persist and grow worse over time.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Avoiding important conversations often allows problems to grow larger over time.",
          rating: "negative",
        },
      },
      learning:
        "Develop communication skills for healthy relationships and boundaries.",
    },
    {
      id: 7,
      title: "SELF - Body Image and Self-esteem",
      icon: <Hand className="w-8 h-8 text-indigo-600" />,
      bgColor: "bg-indigo-100",
      dialogs: [
        {
          speaker: "aarav",
          text: "Have you seen those fitness influencers everyone follows? I've been trying to get abs like that for months.",
          emotion: "insecure",
        },
        {
          speaker: "riya",
          text: "I know what you mean. I spent two hours yesterday trying to take a 'perfect' selfie like the ones I see online.",
          emotion: "frustrated",
        },
        {
          speaker: "aarav",
          text: "Sometimes I feel like no matter how much I work out, I'll never look like those guys. It's getting to me.",
          emotion: "discouraged",
        },
        {
          speaker: "riya",
          text: "Someone commented 'eat something' on my last photo, while my mom says I should lose weight. I can't win.",
          emotion: "upset",
        },
        {
          speaker: "narrator",
          text: "Riya and Aarav are struggling with body image and social media comparison. How should they approach this?",
          emotion: "neutral",
        },
      ],
      choices: [
        {
          id: "a",
          text: "Take a social media break",
          icon: <X className="w-4 h-4" />,
        },
        {
          id: "b",
          text: "Focus on health rather than appearance",
          icon: <Heart className="w-4 h-4" />,
        },
        {
          id: "c",
          text: "Try harder to achieve the 'ideal' look",
          icon: <Trophy className="w-4 h-4" />,
        },
      ],
      outcome: {
        a: {
          dialogs: [
            {
              speaker: "riya",
              text: "I decided to delete Instagram for two weeks. The first few days were weird, but then I felt... lighter somehow.",
              emotion: "relieved",
            },
            {
              speaker: "aarav",
              text: "I unfollowed most fitness accounts and started following artists and musicians instead. My feed is much more interesting now.",
              emotion: "content",
            },
            {
              speaker: "riya",
              text: "I realized I was spending hours comparing myself to edited photos. That time feels wasted now.",
              emotion: "thoughtful",
            },
            {
              speaker: "aarav",
              text: "I'm focusing more on how exercise makes me feel strong rather than how it makes me look. It's actually more motivating.",
              emotion: "energized",
            },
            {
              speaker: "narrator",
              text: "Creating distance from constant comparison helped improve their relationship with their bodies.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Taking breaks from social comparison can improve mental health and body image.",
          rating: "positive",
        },
        b: {
          dialogs: [
            {
              speaker: "aarav",
              text: "I started thinking about what my body can do instead of how it looks. I ran my first 5K last weekend!",
              emotion: "proud",
            },
            {
              speaker: "riya",
              text: "That's awesome! I've been learning about nutrition for energy instead of weight loss. I feel so much better.",
              emotion: "energized",
            },
            {
              speaker: "aarav",
              text: "It's weird, but caring less about getting perfect abs has actually made me enjoy workouts more.",
              emotion: "relaxed",
            },
            {
              speaker: "riya",
              text: "And I've started posting photos I like without worrying about filters or angles. It's freeing.",
              emotion: "confident",
            },
            {
              speaker: "narrator",
              text: "Focusing on health and function rather than appearance led to a more positive relationship with their bodies.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Focusing on what your body can do rather than how it looks builds healthier self-image.",
          rating: "positive",
        },
        c: {
          dialogs: [
            {
              speaker: "aarav",
              text: "I've been following this extreme workout and diet plan I found online. I'm exhausted all the time.",
              emotion: "tired",
            },
            {
              speaker: "riya",
              text: "I've been skipping meals to try to look like the models in my feed. My mom is getting worried.",
              emotion: "weak",
            },
            {
              speaker: "aarav",
              text: "I got injured last week pushing too hard. The doctor said I need to rest, but I'm afraid of losing progress.",
              emotion: "anxious",
            },
            {
              speaker: "riya",
              text: "I can't concentrate in class anymore. All I think about is food and how I look.",
              emotion: "distracted",
            },
            {
              speaker: "narrator",
              text: "Pursuing unrealistic appearance goals led to physically and mentally unhealthy patterns.",
              emotion: "neutral",
            },
          ],
          feedback:
            "Chasing unrealistic beauty standards often leads to harmful physical and mental health consequences.",
          rating: "negative",
        },
      },
      learning:
        "Develop healthy body image and critique media influence on self-perception.",
    },
  ];

  const characters = {
    riya: {
      name: "Riya",
      states: {
        idle: "/Riya.jpg",
        happy: "/Riya.jpg",
        sad: "/Riya.jpg",
        confused: "/Riya.jpg",
        worried: "/Riya.jpg",
        embarrassed: "/Riya.jpg",
        surprised: "/Riya.jpg",
        thoughtful: "/Riya.jpg",
        anxious: "/Riya.jpg",
        relieved: "/Riya.jpg",
        proud: "/Riya.jpg",
        determined: "/Riya.jpg",
        frustrated: "/Riya.jpg",
        curious: "/Riya.jpg",
        neutral: "/Riya.jpg",
        uncomfortable: "/Riya.jpg", // Add this for chapter 2
      },
    },
    aarav: {
      name: "Aarav",
      states: {
        idle: "/Aarav.jpg",
        happy: "/Aarav.jpg",
        sad: "/Aarav.jpg",
        confused: "/Aarav.jpg",
        worried: "/Aarav.jpg",
        embarrassed: "/Aarav.jpg",
        surprised: "/Aarav.jpg",
        thoughtful: "/Aarav.jpg",
        anxious: "/Aarav.jpg",
        relieved: "/Aarav.jpg",
        proud: "/Aarav.jpg",
        determined: "/Aarav.jpg",
        frustrated: "/Aarav.jpg",
        curious: "/Aarav.jpg",
        neutral: "/Aarav.jpg",
        uncomfortable: "/Aarav.jpg", // Add this for chapter 2
        confident: "/Aarav.jpg", // Add this for outcomes
        regretful: "/Aarav.jpg", // Add this for outcomes
      },
    },
    narrator: {
      name: "Narrator",
      states: {
        neutral: "/narrator-icon.jpg", // You'll need to create or find a narrator icon
      },
    },
  };

  const advanceDialog = () => {
    const currentDialogs = gameStarted
      ? showOutcome
        ? chapters[currentChapter].outcome[choices[currentChapter]].dialogs
        : chapters[currentChapter].dialogs
      : [];

    if (dialogIndex < currentDialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
      const speaker = currentDialogs[dialogIndex + 1].speaker;
      const emotion = currentDialogs[dialogIndex + 1].emotion || "idle";
      setCharacterAnimState(emotion);
    } else if (gameStarted && !showOutcome) {
      // All dialogs done, show choices or outcome
      setDialogIndex(0);
      setShowOutcome(true);
    } else if (gameStarted && showOutcome) {
      // Outcome finished, go to next chapter
      if (currentChapter < chapters.length - 1) {
        setCurrentChapter(currentChapter + 1);
        setDialogIndex(0);
        setShowOutcome(false);
      } else {
        // Game complete!
        setGameComplete(true);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setDialogIndex(0);
  };

  const makeChoice = (choiceId) => {
    setChoices({ ...choices, [currentChapter]: choiceId });
    setShowOutcome(true);
    setDialogIndex(0);
  };

  const restartGame = () => {
    setGameStarted(false);
    setCurrentChapter(0);
    setDialogIndex(0);
    setChoices({});
    setShowOutcome(false);
    setGameComplete(false);
  };

  const getCurrentDialog = () => {
    if (!gameStarted) return null;

    const dialogs = showOutcome
      ? chapters[currentChapter].outcome[choices[currentChapter]]?.dialogs || []
      : chapters[currentChapter].dialogs || [];

    return dialogs[dialogIndex] || null;
  };

  const dialog = getCurrentDialog();
  const currentCharacter = dialog ? characters[dialog.speaker] : null;
  const emotionState = dialog ? dialog.emotion || "idle" : "idle";

  // Calculate player score
  const calculateScore = () => {
    let score = 0;
    Object.entries(choices).forEach(([chapter, choice]) => {
      const outcome = chapters[chapter].outcome[choice];
      if (outcome.rating === "positive") score += 10;
      if (outcome.rating === "neutral") score += 5;
    });
    return score;
  };

  // Get all learnings
  const getAllLearnings = () => {
    return chapters.map((chapter) => chapter.learning);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {!gameStarted ? (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">
            Growing Up with Confidence
          </h1>
          <p className="text-gray-700 mb-6">
            Navigate through common scenarios related to puberty, relationships,
            and growing up. Make choices to help Riya and Aarav through these
            situations.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <img
                src="/Riya.jpg"
                alt="Riya character"
                className="mx-auto mb-2"
              />
              <h3 className="font-semibold text-lg">Riya</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <img
                src="/Aarav.jpg"
                alt="Aarav character"
                className="mx-auto mb-2"
              />
              <h3 className="font-semibold text-lg">Aarav</h3>
            </div>
          </div>
          <button
            onClick={startGame}
            className="bg-purple-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Start Adventure
          </button>
        </div>
      ) : gameComplete ? (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">
            Adventure Complete!
          </h1>
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">
              Your Score: {calculateScore()} points
            </h2>
            <p className="text-gray-700">
              Great job navigating these challenging situations!
            </p>
          </div>
          <div className="mb-6 text-left">
            <h3 className="text-xl font-bold text-purple-600 mb-2">
              What You've Learned:
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {getAllLearnings().map((learning, index) => (
                <li key={index} className="text-gray-700">
                  {learning}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={restartGame}
            className="bg-purple-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {/* Chapter Header */}
          <div
            className={`p-4 rounded-t-lg flex items-center ${chapters[currentChapter].bgColor}`}
          >
            <div className="mr-4">{chapters[currentChapter].icon}</div>
            <h2 className="text-xl font-bold">
              Chapter {currentChapter + 1}: {chapters[currentChapter].title}
            </h2>
          </div>

          {/* Main content area */}
          <div className="bg-white rounded-b-lg shadow-lg p-4 flex flex-col md:flex-row">
            {/* Character display */}
            <div className="w-full md:w-1/3 flex flex-col items-center p-2">
              {dialog && (
                <>
                  <img
                    src={
                      currentCharacter?.states[emotionState] ||
                      currentCharacter?.states["idle"] ||
                      "/placeholder.jpg"
                    }
                    alt={currentCharacter?.name}
                    className="h-64 object-cover mb-2 rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      console.log(
                        `Failed to load image for ${dialog.speaker} with emotion ${emotionState}`
                      );
                      e.target.src =
                        dialog.speaker === "riya"
                          ? "/Riya.jpg"
                          : dialog.speaker === "aarav"
                          ? "/Aarav.jpg"
                          : "/narrator-icon.jpg";
                    }}
                  />
                  <h3 className="text-lg font-semibold">
                    {currentCharacter?.name}
                  </h3>
                  <p className="text-sm text-gray-500 italic">{emotionState}</p>
                </>
              )}
            </div>

            {/* Dialog and choices */}
            <div className="w-full md:w-2/3 p-2">
              {dialog && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-32">
                  <p className="text-lg">{dialog.text}</p>
                </div>
              )}

              {/* Show choices or continue button */}
              <div className="flex flex-col space-y-2">
                {gameStarted &&
                  !showOutcome &&
                  dialogIndex ===
                    chapters[currentChapter].dialogs.length - 1 && (
                    <>
                      <h3 className="font-semibold text-lg">
                        What will you do?
                      </h3>
                      {chapters[currentChapter].choices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => makeChoice(choice.id)}
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                        >
                          <span className="mr-2">{choice.icon}</span>
                          {choice.text}
                        </button>
                      ))}
                    </>
                  )}

                {/* Outcome feedback */}
                {showOutcome &&
                  dialogIndex ===
                    chapters[currentChapter].outcome[choices[currentChapter]]
                      .dialogs.length -
                      1 && (
                    <div
                      className={`p-4 rounded-lg mt-4 ${
                        chapters[currentChapter].outcome[
                          choices[currentChapter]
                        ].rating === "positive"
                          ? "bg-green-100 text-green-800"
                          : chapters[currentChapter].outcome[
                              choices[currentChapter]
                            ].rating === "neutral"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <p className="font-semibold">
                        {
                          chapters[currentChapter].outcome[
                            choices[currentChapter]
                          ].feedback
                        }
                      </p>
                    </div>
                  )}

                {/* Continue button */}
                {(dialogIndex <
                  (showOutcome
                    ? chapters[currentChapter].outcome[choices[currentChapter]]
                        .dialogs.length - 1
                    : chapters[currentChapter].dialogs.length - 1) ||
                  showOutcome) && (
                  <button
                    onClick={advanceDialog}
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    {currentChapter < chapters.length - 1 || !showOutcome ? (
                      <>
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Adventure <Trophy className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={restartGame}
              className="flex items-center text-purple-600 hover:text-purple-800"
            >
              <Home className="w-4 h-4 mr-1" /> Home
            </button>
            <div className="flex space-x-1">
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className={`w-6 h-2 rounded-full ${
                    index === currentChapter
                      ? "bg-purple-600"
                      : index < currentChapter
                      ? "bg-purple-300"
                      : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
