// In QuizPage.jsx:
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const timerRef = useRef(null);

  // Quiz state
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz and questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        // Fetch quiz details
        const { data: quizData, error: quizError } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", id)
          .single();

        if (quizError) throw quizError;

        setQuiz(quizData);

        // Fetch questions for this quiz
        const { data: questionsData, error: questionsError } = await supabase
          .from("quiz_questions")
          .select("id, question_text, quiz_id, marks")
          .eq("quiz_id", id)
          .order("created_at");

        if (questionsError) throw questionsError;

        if (!questionsData || questionsData.length === 0) {
          throw new Error("No questions found for this quiz");
        }

        // Fetch options for each question
        const questionsWithOptions = await Promise.all(
          questionsData.map(async (question) => {
            const { data: optionsData, error: optionsError } = await supabase
              .from("quiz_options")
              .select("id, option_text, is_correct")
              .eq("question_id", question.id)
              .order("id");

            if (optionsError) throw optionsError;

            return {
              ...question,
              options: optionsData.map((option) => ({
                id: option.id,
                text: option.option_text,
                is_correct: option.is_correct,
              })),
            };
          })
        );

        setQuestions(questionsWithOptions);

        // Set time limit from quiz data - use time_limit_seconds if available, otherwise convert time_limit to seconds
        const timeLimit =
          quizData.time_limit_seconds ||
          (quizData.time_limit ? parseInt(quizData.time_limit) * 60 : 900); // Default to 15 minutes
        setTimeRemaining(timeLimit);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  // Start timer after quiz is loaded
  useEffect(() => {
    if (quiz && !quizSubmitted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz, quizSubmitted]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex) => {
    if (quizSubmitted) return; // Prevent changes after submission

    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Calculate score and submit quiz
  const handleSubmitQuiz = async () => {
    // Stop the timer
    if (timerRef.current) clearInterval(timerRef.current);

    let correctAnswers = 0;
    let totalQuestions = questions.length;
    let totalScore = 0;
    let totalPossibleScore = 0;

    // Calculate score
    questions.forEach((question, index) => {
      const selectedOptionIndex = selectedOptions[index];
      // Add to total possible score
      const questionMarks = question.marks || 1; // Default to 1 if marks not specified
      totalPossibleScore += questionMarks;

      if (selectedOptionIndex !== undefined) {
        const selectedOption = question.options[selectedOptionIndex];
        if (selectedOption && selectedOption.is_correct) {
          correctAnswers++;
          totalScore += questionMarks;
        }
      }
    });

    const scorePercentage = Math.round((totalScore / totalPossibleScore) * 100);

    // Prepare result object
    const result = {
      totalQuestions,
      correctAnswers,
      scorePercentage,
      timeTaken:
        (quiz.time_limit_seconds || parseInt(quiz.time_limit) * 60) -
        timeRemaining,
    };

    try {
      // First create the attempt record
      const { data: attemptData, error: attemptError } = await supabase
        .from("user_quiz_attempts")
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          total_score: totalScore,
          score: scorePercentage,
          attempt_time: new Date().toISOString(),
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .select();

      if (attemptError) throw attemptError;

      const attemptId = attemptData[0].id;

      // Then save each answer
      const answerPromises = Object.entries(selectedOptions).map(
        async ([qIndex, oIndex]) => {
          const question = questions[qIndex];
          const selectedOption = question.options[oIndex];
          const isCorrect = selectedOption.is_correct;

          return supabase.from("user_quiz_answers").insert({
            attempt_id: attemptId,
            question_id: question.id,
            selected_option_id: selectedOption.id,
            is_correct: isCorrect,
            answered_at: new Date().toISOString(),
          });
        }
      );

      await Promise.all(answerPromises);
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }

    // Update UI
    setQuizSubmitted(true);
    setQuizResult(result);
  };

  // Handle quiz submission confirmation
  const confirmSubmit = () => {
    if (
      window.confirm(
        "Are you sure you want to submit your quiz? You cannot change your answers after submission."
      )
    ) {
      handleSubmitQuiz();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Quiz
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // No quiz found
  if (!quiz || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quiz Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The quiz you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Results view after submission
  if (quizSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-6 px-6 text-white">
            <h1 className="text-2xl font-bold">{quiz.title} - Results</h1>
            <p className="mt-1 opacity-90">{quiz.description}</p>
          </div>

          <div className="p-8">
            <div className="mb-8 text-center">
              <div
                className={`text-6xl font-bold mb-2 ${
                  quizResult.scorePercentage >= 70
                    ? "text-green-600"
                    : quizResult.scorePercentage >= 40
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {quizResult.scorePercentage}%
              </div>
              <p className="text-gray-600">
                You answered {quizResult.correctAnswers} out of{" "}
                {quizResult.totalQuestions} questions correctly
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Time taken: {Math.floor(quizResult.timeTaken / 60)}m{" "}
                {quizResult.timeTaken % 60}s
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-indigo-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-indigo-800 mb-2">
                  Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${quizResult.scorePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Time Efficiency
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            100 -
                            Math.min(
                              100,
                              (quizResult.timeTaken /
                                (quiz.time_limit_seconds ||
                                  parseInt(quiz.time_limit) * 60)) *
                                100
                            )
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-purple-800 mb-2">
                  Feedback
                </h3>
                <p className="text-gray-700">
                  {quizResult.scorePercentage >= 80
                    ? "Excellent work! You have a great understanding of this topic."
                    : quizResult.scorePercentage >= 60
                    ? "Good job! You have a solid grasp of the material."
                    : quizResult.scorePercentage >= 40
                    ? "You're making progress. Review the sections you struggled with."
                    : "You might need more practice with this material. Consider reviewing the content again."}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200"
              >
                Back to Dashboard
              </button>

              <button
                onClick={() => navigate(`/modules`)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Current question
  const currentQuestion = questions[currentQuestionIndex];

  // Quiz taking view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-6 px-6 flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="mt-1 opacity-90">{quiz.description}</p>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-mono font-bold ${
                timeRemaining < 60 ? "text-red-300 animate-pulse" : ""
              }`}
            >
              {formatTime(timeRemaining)}
            </div>
            <p className="text-xs text-white text-opacity-80">Time Remaining</p>
          </div>
        </div>

        <div className="p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>
                {Math.round(
                  ((currentQuestionIndex + 1) / questions.length) * 100
                )}
                % Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {currentQuestion.question_text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  onClick={() => handleOptionSelect(optionIndex)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedOptions[currentQuestionIndex] === optionIndex
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        selectedOptions[currentQuestionIndex] === optionIndex
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedOptions[currentQuestionIndex] ===
                        optionIndex && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-xl font-medium ${
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={confirmSubmit}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>

        {/* Question navigation */}
        <div className="bg-gray-50 px-8 py-4 border-t"></div>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center
                  ${
                    index === currentQuestionIndex
                      ? "bg-indigo-600 text-white"
                      : selectedOptions[index] !== undefined
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
