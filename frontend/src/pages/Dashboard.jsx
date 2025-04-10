import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import getAgeGroup from "../lib/ageGroup";
import calculateAge from "../lib/calculateAge";
import { useNavigate } from "react-router-dom";

const checkBannedStatus = (profile) => {
  if (profile?.is_banned) {
    throw new Error("Account suspended");
  }
};

const BannedUserMessage = ({ profile }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <span className="text-red-500 text-2xl">⚠️</span>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto px-4">
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
            <section className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <span className="text-2xl">📊</span>
                </div>
                <h2 className="text-xl font-bold ml-3 text-indigo-800">
                  Learning Analytics
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Learning Streak</p>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {analytics.learningStreak} days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">This Week</p>
                    <span className="text-2xl">📈</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">
                    {analytics.weeklyProgress} topics
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Progress</p>
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {Math.round(analytics.completionRate)}%
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <span className="text-2xl">👤</span>
                </div>
                <h2 className="text-xl font-bold ml-3 text-indigo-800">
                  Personal Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-indigo-800 mb-3">
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
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-indigo-800 mb-3">
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
                      <span className="font-medium text-indigo-700">
                        {profile.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-indigo-700">
                        {profile.location || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-indigo-800 mb-3">
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium text-indigo-700">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Login</span>
                      <span className="font-medium text-indigo-700">
                        {new Date(user.last_sign_in_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-indigo-800 mb-3">
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

            <section className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <span className="text-2xl">🕒</span>
                </div>
                <h3 className="text-xl font-bold ml-3 text-indigo-800">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {activity.content?.content_type === "video"
                          ? "🎥"
                          : activity.content?.content_type === "quiz"
                          ? "📝"
                          : activity.content?.content_type === "image"
                          ? "🖼️"
                          : activity.content?.content_type === "document"
                          ? "📄"
                          : "📚"}
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.content?.title || "Deleted Content"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            activity.last_interacted_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {activity.time_spent_minutes} min
                      </span>
                      {activity.is_completed && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {analytics.recentActivity.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
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
            <h3 className="text-xl font-bold text-indigo-800">
              Your Learning Progress
            </h3>
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h4 className="font-semibold text-lg mb-4 text-indigo-700">
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
                      className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {content?.title || "Unknown Content"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            progress.last_interacted_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          {progress.time_spent_minutes} min
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          +{progress.points_earned} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h4 className="font-semibold text-lg mb-4 text-indigo-700">
                Quiz Attempts
              </h4>
              <div className="space-y-4">
                {quizAttempts.map((attempt, index) => {
                  // Find corresponding quiz
                  const quiz = quizzes.find((q) => q.id === attempt.quiz_id);

                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">
                          {quiz?.title || "Unknown Quiz"}
                        </h5>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            attempt.is_completed
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {attempt.is_completed ? "Completed" : "In Progress"}
                        </span>
                      </div>

                      <div className="mt-3 flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          {new Date(attempt.attempt_time).toLocaleString()}
                        </span>
                        <span className="font-bold">
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
              </div>
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-800">
              Available Content
            </h3>

            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-3xl shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-2xl">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h4 className="text-xl font-bold ml-3 text-indigo-800">
                    {topic.title}
                  </h4>
                </div>
                <p className="text-gray-600 mb-6">{topic.description}</p>

                {/* Filter subtopics for this topic */}
                <div className="space-y-4">
                  {subtopics
                    .filter((st) => st.topic_id === topic.id)
                    .map((subtopic) => {
                      // Find contents for this subtopic
                      const subtopicContents = contents.filter(
                        (c) => c.subtopic_id === subtopic.id
                      );

                      return (
                        <div
                          key={subtopic.id}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-indigo-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium">{subtopic.title}</h5>
                              <p className="text-sm text-gray-500">
                                {subtopicContents.length} content items
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {subtopicContents.map((content) => (
                                <span
                                  key={content.id}
                                  className={`px-3 py-1 rounded-full text-xs ${
                                    content.content_type === "text"
                                      ? "bg-blue-100 text-blue-700"
                                      : content.content_type === "quiz"
                                      ? "bg-purple-100 text-purple-700"
                                      : content.content_type === "image"
                                      ? "bg-green-100 text-green-700"
                                      : content.content_type === "video"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {content.content_type
                                    .charAt(0)
                                    .toUpperCase() +
                                    content.content_type.slice(1)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        );

      case "quizzes":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-800">
              Available Quizzes
            </h3>

            {quizzes.map((quiz) => {
              // Find user's best attempt for this quiz
              const attempts = quizAttempts.filter(
                (a) => a.quiz_id === quiz.id
              );
              const bestAttempt = attempts.reduce(
                (best, current) =>
                  current.score > (best?.score || 0) ? current : best,
                null
              );

              const handleQuizStart = () => {
                try {
                  checkBannedStatus(profile);
                  navigate(`/quiz/${quiz.id}`);
                } catch (error) {
                  // Optional: Show a toast message or alert
                  return;
                }
              };

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-3xl shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-2xl">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-xl font-bold text-indigo-800">
                        {quiz.title}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {quiz.difficulty} Level
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{quiz.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center">
                      <span className="text-xl mr-2">⏱️</span>
                      <div>
                        <p className="text-xs text-gray-500">Time Limit</p>
                        <p className="font-medium">
                          {Math.floor(quiz.time_limit_seconds / 60)} minutes
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center">
                      <span className="text-xl mr-2">📝</span>
                      <div>
                        <p className="text-xs text-gray-500">Questions</p>
                        <p className="font-medium">
                          {quiz.questions_count} questions
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center">
                      <span className="text-xl mr-2">🎯</span>
                      <div>
                        <p className="text-xs text-gray-500">Total Marks</p>
                        <p className="font-medium">{quiz.total_marks} points</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center">
                      <span className="text-xl mr-2">🏆</span>
                      <div>
                        <p className="text-xs text-gray-500">Your Best Score</p>
                        <p className="font-medium">
                          {bestAttempt ? (
                            <span
                              className={
                                bestAttempt.score >= 70
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }
                            >
                              {bestAttempt.total_score}/{quiz.total_marks} (
                              {bestAttempt.score}%)
                            </span>
                          ) : (
                            "Not attempted"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleQuizStart}
                      disabled={profile?.is_banned}
                      className={`
                        flex-1 py-3 rounded-xl font-medium
                        ${
                          profile?.is_banned
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-purple-500 text-white hover:bg-purple-600"
                        } transition-colors
                      `}
                    >
                      {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
                    </button>
                    {bestAttempt && (
                      <button
                        onClick={() =>
                          navigate(`/quiz-results/${bestAttempt.id}`)
                        }
                        className="flex-1 bg-indigo-100 text-indigo-700 py-3 rounded-xl font-medium hover:bg-indigo-200 transition-colors"
                      >
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-2 border-b border-indigo-100">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            👋 Hello, {profile.first_name}!
          </h1>
          <p className="text-indigo-400 mt-1 font-medium">
            Your personal health journey dashboard
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex overflow-x-auto">
        {["overview", "progress", "content", "quizzes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={profile?.is_banned}
            className={`
              px-4 py-2 rounded-xl font-medium flex-1 transition-colors
              ${profile?.is_banned ? "opacity-50 cursor-not-allowed" : ""}
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "text-gray-600 hover:bg-indigo-50"
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
        <button
          className={`
            w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg 
            flex items-center justify-center gap-2
            ${
              profile?.is_banned
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-purple-700"
            } transition-all
          `}
          disabled={profile?.is_banned}
        >
          <span className="text-xl">🚀</span> Explore Topics
        </button>

        <button
          className={`
            w-full sm:w-auto px-8 py-4 rounded-2xl font-medium 
            flex items-center justify-center gap-2
            ${
              profile?.is_banned
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-md"
            } transition-all
          `}
          disabled={profile?.is_banned}
        >
          View Quiz Results <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
