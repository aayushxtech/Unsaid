import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import getAgeGroup from "../lib/ageGroup";
import calculateAge from "../lib/calculateAge";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  Award,
  CheckCircle,
  BookOpen,
  FileText,
  Video,
  Image,
  Activity,
  Zap,
  TrendingUp,
  Percent,
  Flame,
  AlertTriangle,
  Phone,
  MapPin,
  Mail,
  Flag,
  Heart,
  Star,
  Coffee,
  HelpCircle,
  PenTool,
  BarChart2,
  Database,
  Settings,
  Grid,
  DollarSign,
  Send,
  Bell,
} from "lucide-react";

const checkBannedStatus = (profile) => {
  if (profile?.is_banned) {
    throw new Error("Account suspended");
  }
};

const BannedUserMessage = ({ profile }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <AlertTriangle className="text-red-500 w-8 h-8" />
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-bold text-red-800">Account Suspended</h3>
        <p className="text-red-600 mt-2">
          Your account has been suspended on{" "}
          {new Date(profile.banned_at).toLocaleDateString()}
        </p>
        <p className="text-red-600 mt-1">
          Reason: {profile.ban_reason || "No reason provided"}
        </p>
        <p className="text-red-600 mt-2">
          Please contact support for more information.
        </p>
      </div>
    </div>
  </div>
);

const calculateAnalytics = (contentProgress, quizAttempts, contents) => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Calculate recent activities from content progress
  const recentActivities = contentProgress
    .filter((p) => new Date(p.last_interacted_at) > lastWeek)
    .sort(
      (a, b) => new Date(b.last_interacted_at) - new Date(a.last_interacted_at)
    );

  // Calculate weekly progress
  const weeklyProgress = recentActivities.length;

  // Calculate total time spent
  const totalTimeSpent = contentProgress.reduce(
    (total, curr) => total + (curr.time_spent_minutes || 0),
    0
  );

  // Calculate quiz performance
  const quizPerformance =
    quizAttempts.length > 0
      ? {
          totalAttempts: quizAttempts.length,
          averageScore:
            quizAttempts.reduce((acc, curr) => acc + curr.total_score, 0) /
            quizAttempts.length,
          bestScore: Math.max(...quizAttempts.map((a) => a.total_score)),
        }
      : { totalAttempts: 0, averageScore: 0, bestScore: 0 };

  // Calculate completion rate
  const completionRate =
    contents.length > 0
      ? (contentProgress.filter((p) => p.is_completed).length /
          contents.length) *
        100
      : 0;

  // Calculate learning streak
  const learningStreak = calculateLearningStreak(contentProgress);

  return {
    weeklyProgress,
    totalTimeSpent,
    averageQuizScore: quizPerformance.averageScore,
    completionRate,
    learningStreak,
    recentActivity: recentActivities.slice(0, 5).map((activity) => ({
      ...activity,
      content: contents.find((c) => c.id === activity.content_id),
    })),
  };
};

const calculateLearningStreak = (contentProgress) => {
  if (!contentProgress.length) return 0;

  const dates = [
    ...new Set(
      contentProgress.map(
        (p) => new Date(p.last_interacted_at).toISOString().split("T")[0]
      )
    ),
  ].sort();

  let streak = 1;
  let currentStreak = 1;

  for (let i = dates.length - 1; i > 0; i--) {
    const diff =
      Math.abs(
        new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()
      ) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      currentStreak++;
      streak = Math.max(streak, currentStreak);
    } else {
      break;
    }
  }

  return currentStreak;
};

const ContentTypeIcon = ({ type, size = 20 }) => {
  switch (type) {
    case "video":
      return <Video size={size} className="text-red-500" />;
    case "quiz":
      return <FileText size={size} className="text-purple-500" />;
    case "image":
      return <Image size={size} className="text-green-500" />;
    case "document":
      return <FileText size={size} className="text-blue-500" />;
    case "text":
      return <BookOpen size={size} className="text-indigo-500" />;
    default:
      return <BookOpen size={size} className="text-gray-500" />;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  // State for all the data
  const [profile, setProfile] = useState(null);
  const [contentProgress, setContentProgress] = useState([]);
  const [contents, setContents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch content progress
        const { data: progressData, error: progressError } = await supabase
          .from("user_content_progress")
          .select("*")
          .eq("user_id", user.id);

        if (progressError) throw progressError;
        setContentProgress(progressData);

        // Fetch contents
        const { data: contentsData, error: contentsError } = await supabase
          .from("contents")
          .select("*")
          .order("created_at", { ascending: false });

        if (contentsError) throw contentsError;
        setContents(contentsData);

        // Fetch quizzes with their questions
        const { data: quizzesData, error: quizzesError } = await supabase
          .from("quizzes")
          .select(
            `
            *,
            quiz_questions (
              id,
              marks
            )
          `
          )
          .eq("is_published", true);

        if (quizzesError) throw quizzesError;

        // Calculate totals for each quiz
        const quizzesWithTotals = quizzesData.map((quiz) => ({
          ...quiz,
          questions_count: quiz.quiz_questions?.length || 0,
          total_marks:
            quiz.quiz_questions?.reduce((sum, q) => sum + (q.marks || 1), 0) ||
            0,
        }));

        setQuizzes(quizzesWithTotals);

        // Fetch user's quiz attempts with scores
        const { data: attemptsData, error: attemptsError } = await supabase
          .from("user_quiz_attempts")
          .select(
            `
            *,
            user_quiz_answers (
              is_correct,
              question_id
            )
          `
          )
          .eq("user_id", user.id)
          .order("attempt_time", { ascending: false });

        if (attemptsError) throw attemptsError;

        setQuizAttempts(attemptsData);

        // Fetch topics
        const { data: topicsData, error: topicsError } = await supabase
          .from("topics")
          .select("*")
          .eq("is_published", true);

        if (topicsError) throw topicsError;
        setTopics(topicsData);

        // Fetch subtopics
        const { data: subtopicsData, error: subtopicsError } = await supabase
          .from("subtopics")
          .select("*")
          .order("order_no");

        if (subtopicsError) throw subtopicsError;
        setSubtopics(subtopicsData);

        // Fetch quiz questions
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select("*");

        if (questionsError) throw questionsError;
        setQuizQuestions(questionsData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Calculate age and age group when profile is available
  const userAge = profile
    ? calculateAge(new Date(profile.date_of_birth))
    : null;
  const userAgeGroup = profile ? getAgeGroup(userAge) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center max-w-md mx-auto px-4">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600">
            We couldn't find your profile information. Please try refreshing the
            page or contact support.
          </p>
        </div>
      </div>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    // Check for banned status first
    if (profile?.is_banned) {
      return <BannedUserMessage profile={profile} />;
    }

    switch (activeTab) {
      case "overview": {
        const analytics = calculateAnalytics(
          contentProgress,
          quizAttempts,
          contents
        );

        return (
          <div className="space-y-6">
            {profile.is_banned && <BannedUserMessage profile={profile} />}
            <section className="bg-white rounded-3xl shadow-lg p-6 overflow-hidden">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <BarChart2 className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold ml-3 text-indigo-800">
                  Learning Analytics
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Learning Streak</p>
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {analytics.learningStreak} days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">This Week</p>
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">
                    {analytics.weeklyProgress} topics
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Progress</p>
                    <Percent className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {Math.round(analytics.completionRate)}%
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-lg p-6 mb-6 overflow-hidden">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold ml-3 text-indigo-800">
                  Personal Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2 text-indigo-500" />
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium text-indigo-700">
                        {profile.first_name} {profile.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Age</span>
                      <span className="font-medium text-indigo-700">
                        {userAge} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Age Group</span>
                      <span className="font-medium text-indigo-700">
                        {userAgeGroup}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                    Contact Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium text-indigo-700">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-medium text-indigo-700 flex items-center">
                        {profile.phone ? (
                          <>
                            <Phone className="w-3 h-3 mr-1 text-indigo-400" />
                            {profile.phone}
                          </>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-indigo-700 flex items-center">
                        {profile.location ? (
                          <>
                            <MapPin className="w-3 h-3 mr-1 text-indigo-400" />
                            {profile.location}
                          </>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-indigo-500" />
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium text-indigo-700 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-indigo-400" />
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Login</span>
                      <span className="font-medium text-indigo-700 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-indigo-400" />
                        {new Date(user.last_sign_in_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Health Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Date of Birth</span>
                      <span className="font-medium text-indigo-700">
                        {new Date(profile.date_of_birth).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gender</span>
                      <span className="font-medium text-indigo-700">
                        {profile.gender || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Blood Group</span>
                      <span className="font-medium text-indigo-700">
                        {profile.blood_group || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-lg p-6 overflow-hidden">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold ml-3 text-indigo-800">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <ContentTypeIcon
                          type={activity.content?.content_type}
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.content?.title || "Deleted Content"}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(
                            activity.last_interacted_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time_spent_minutes} min
                      </span>
                      {activity.is_completed && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {analytics.recentActivity.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No recent activity found. Start learning!
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      }

      case "progress":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-800 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-indigo-600" />
              Your Learning Progress
            </h3>
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h4 className="font-semibold text-lg mb-4 text-indigo-700 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                Content Progress
              </h4>
              <div className="space-y-4">
                {contentProgress.map((progress, index) => {
                  // Find corresponding content
                  const content = contents.find(
                    (c) => c.id === progress.content_id
                  );

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 bg-white p-2 rounded-lg shadow-sm">
                          <ContentTypeIcon type={content?.content_type} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {content?.title || "Unknown Content"}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(
                              progress.last_interacted_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {progress.time_spent_minutes} min
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          {progress.points_earned} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
                {contentProgress.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No content progress yet. Start exploring!
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h4 className="font-semibold text-lg mb-4 text-indigo-700 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Quiz Attempts
              </h4>
              <div className="space-y-4">
                {quizAttempts.map((attempt, index) => {
                  // Find corresponding quiz
                  const quiz = quizzes.find((q) => q.id === attempt.quiz_id);

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="mr-3 bg-white p-2 rounded-lg shadow-sm">
                            <PenTool className="w-5 h-5 text-purple-500" />
                          </div>
                          <h5 className="font-medium">
                            {quiz?.title || "Unknown Quiz"}
                          </h5>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm flex items-center ${
                            attempt.is_completed
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {attempt.is_completed ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </>
                          )}
                        </span>
                      </div>

                      <div className="mt-3 flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(attempt.attempt_time).toLocaleString()}
                        </span>
                        <span className="font-bold flex items-center">
                          <Award className="w-4 h-4 mr-1 text-indigo-500" />
                          Score: {attempt.total_score}/
                          {quiz?.total_marks || 100}
                        </span>
                      </div>

                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full"
                          style={{
                            width: `${
                              (attempt.total_score /
                                (quiz?.total_marks || 100)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {quizAttempts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No quiz attempts yet. Try some quizzes!
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-800 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
              Content for {userAgeGroup}
            </h3>

            {topics
              .filter((topic) => topic.age_group === userAgeGroup) // Filter topics by age group
              .map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl shadow-md p-6 overflow-hidden"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-2xl">
                      <Grid className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-bold ml-3 text-indigo-700">
                      {topic.title}
                    </h4>
                  </div>

                  <p className="text-gray-600 mb-4">{topic.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contents
                      .filter((content) => content.topic_id === topic.id)
                      .map((content) => {
                        // Find progress for this content if any
                        const progress = contentProgress.find(
                          (p) => p.content_id === content.id
                        );

                        return (
                          <div
                            key={content.id}
                            className="bg-gray-50 rounded-xl p-4 hover:bg-indigo-50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/content/${content.id}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="mr-3 bg-white p-2 rounded-lg shadow-sm">
                                  <ContentTypeIcon
                                    type={content.content_type}
                                  />
                                </div>
                                <h5 className="font-medium">{content.title}</h5>
                              </div>
                              {progress?.is_completed && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </span>
                              )}
                            </div>

                            <div className="mt-3 flex justify-between items-center text-sm">
                              <span className="text-gray-500">
                                {content.estimated_time || "10"} min
                              </span>
                              {progress && (
                                <span className="font-medium flex items-center">
                                  <Zap className="w-3 h-3 mr-1 text-indigo-500" />
                                  {progress.points_earned || 0} pts
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            {topics.filter((topic) => topic.age_group === userAgeGroup)
              .length === 0 && (
              <div className="text-center py-8 bg-white rounded-3xl shadow-md">
                <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">
                  No content available for your age group yet.
                </p>
              </div>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-800 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-indigo-600" />
              Account Settings
            </h3>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="max-w-md mx-auto">
                <h4 className="font-semibold text-lg mb-4 text-indigo-700">
                  Personal Information
                </h4>

                <div className="space-y-4">
                  <button
                    className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl transition-colors"
                    onClick={() => navigate("/profile/edit")}
                  >
                    <span className="flex items-center">
                      <User className="w-5 h-5 mr-3 text-indigo-600" />
                      Edit Profile
                    </span>
                    <span className="text-indigo-600">&rarr;</span>
                  </button>

                  <button
                    className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl transition-colors"
                    onClick={() => navigate("/password/change")}
                  >
                    <span className="flex items-center">
                      <Settings className="w-5 h-5 mr-3 text-indigo-600" />
                      Change Password
                    </span>
                    <span className="text-indigo-600">&rarr;</span>
                  </button>

                  <button
                    className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl transition-colors"
                    onClick={() => navigate("/notifications/settings")}
                  >
                    <span className="flex items-center">
                      <Bell className="w-5 h-5 mr-3 text-indigo-600" />
                      Notification Settings
                    </span>
                    <span className="text-indigo-600">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h2>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
          {["overview", "progress", "content", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-indigo-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
