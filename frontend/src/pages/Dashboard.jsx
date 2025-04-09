import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import getAgeGroup from "../lib/ageGroup";
import calculateAge from "../lib/calculateAge";
import { useNavigate } from "react-router-dom";

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
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* User Info */}
            <section className="bg-white rounded-3xl shadow-lg p-6 transform transition-all hover:scale-105 border border-indigo-50">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <span className="text-2xl">👤</span>
                </div>
                <h2 className="text-xl font-bold ml-3 text-indigo-800">
                  Your Profile
                </h2>
              </div>

              <div className="flex items-center mb-6">
                <img
                  src={profile.avatar_url}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border-4 border-indigo-100"
                />
                <div className="ml-4">
                  <p className="font-bold text-lg">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pl-2">
                <p className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-indigo-700">
                    {profile.email}
                  </span>
                </p>
                <p className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Date of Birth</span>
                  <span className="font-medium text-indigo-700">
                    {new Date(profile.date_of_birth).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Age</span>
                  <span className="font-medium text-indigo-700">
                    {userAge} years
                  </span>
                </p>
                <p className="flex justify-between pb-2">
                  <span className="text-gray-500">Age Group</span>
                  <span className="font-medium text-indigo-700">
                    {userAgeGroup}
                  </span>
                </p>
              </div>
            </section>

            {/* Progress Summary */}
            <section className="bg-white rounded-3xl shadow-lg p-6 transform transition-all hover:scale-105 border border-indigo-50">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <span className="text-2xl">📊</span>
                </div>
                <h2 className="text-xl font-bold ml-3 text-indigo-800">
                  Progress Summary
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-gray-500 text-sm">Content Viewed</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {contentProgress.filter((p) => p.is_viewed).length}/
                    {contents.length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-gray-500 text-sm">Quiz Score</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {quizAttempts[0]?.total_score || 0}/
                    {quizzes[0]?.total_marks || 100}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-gray-500 text-sm">Time Spent</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {contentProgress.reduce(
                      (total, curr) => total + curr.time_spent_minutes,
                      0
                    )}{" "}
                    min
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-1">Overall Progress</p>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full"
                    style={{
                      width: `${
                        (contentProgress.filter((p) => p.is_viewed).length /
                          contents.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Recent Content */}
            <section className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-bold text-xl ml-3 text-indigo-800">
                  Recent Content
                </h3>
              </div>

              <div className="space-y-3">
                {contents.map((content, index) => {
                  // Find related subtopic
                  const subtopic = subtopics.find(
                    (s) => s.id === content.subtitle_id
                  );
                  // Find user progress for this content
                  const progress = contentProgress.find(
                    (p) => p.content_id === content.id
                  );

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <div className="flex space-x-3 text-sm text-gray-500 mt-1">
                          <span>{subtopic?.title || "Unknown Subtopic"}</span>
                          <span
                            className={`${
                              content.content_type === "article"
                                ? "text-blue-600"
                                : content.content_type === "quiz"
                                ? "text-purple-600"
                                : "text-green-600"
                            }`}
                          >
                            {content.content_type.charAt(0).toUpperCase() +
                              content.content_type.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {progress?.is_viewed && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            Viewed
                          </span>
                        )}
                        <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                          {progress?.is_viewed ? "Review" : "Start"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        );

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
                      // Find content for this subtopic
                      const subtopicContent = contents.find(
                        (c) => c.subtitle_id === subtopic.id
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
                                {subtopicContent?.title || ""}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  subtopic.content_type === "article"
                                    ? "bg-blue-100 text-blue-700"
                                    : subtopic.content_type === "quiz"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {subtopic.content_type.charAt(0).toUpperCase() +
                                  subtopic.content_type.slice(1)}
                              </span>
                              <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-full text-sm">
                                →
                              </button>
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
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                      className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors"
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

        <div className="flex items-center space-x-2">
          <button className="bg-indigo-100 p-2 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
            <span className="text-xl">🔔</span>
          </button>
          <button className="bg-indigo-100 p-2 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl font-medium flex-1 transition-colors ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "text-gray-600 hover:bg-indigo-50"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`px-4 py-2 rounded-xl font-medium flex-1 transition-colors ${
            activeTab === "progress"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "text-gray-600 hover:bg-indigo-50"
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 rounded-xl font-medium flex-1 transition-colors ${
            activeTab === "content"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "text-gray-600 hover:bg-indigo-50"
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`px-4 py-2 rounded-xl font-medium flex-1 transition-colors ${
            activeTab === "quizzes"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "text-gray-600 hover:bg-indigo-50"
          }`}
        >
          Quizzes
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
        <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg flex items-center justify-center gap-2">
          <span className="text-xl">🚀</span> Explore Topics
        </button>

        <button className="w-full sm:w-auto bg-white text-indigo-600 border-2 border-indigo-100 px-8 py-4 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all font-medium flex items-center justify-center gap-2">
          View Quiz Results <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
