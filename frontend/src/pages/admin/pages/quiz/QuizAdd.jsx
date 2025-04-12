import React, { useState, useEffect } from "react";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";
import { supabase } from "../../../../supabaseClient";
import { useNavigate } from "react-router-dom";

// Question component for reusability
const QuestionForm = ({
  question,
  index,
  onQuestionChange,
  onOptionChange,
  onCorrectOptionChange,
  onRemove,
  isRemovable,
}) => {
  return (
    <div className="mb-6 p-6 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">Question {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:hover:text-red-600"
          disabled={!isRemovable}
        >
          Remove
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text <span className="text-red-500">*</span>
        </label>
        <textarea
          name="question_text"
          value={question.question_text}
          onChange={(e) => onQuestionChange(index, e)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter question text"
          rows="2"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Answer Options <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Mark one option as correct using the radio button
        </p>
      </div>

      {question.options.map((option, oIndex) => (
        <div key={oIndex} className="flex items-center mb-3">
          <input
            type="radio"
            name={`correct-option-${index}`}
            checked={option.is_correct}
            onChange={() => onCorrectOptionChange(index, oIndex)}
            className="mr-3 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={option.text}
            onChange={(e) => onOptionChange(index, oIndex, e)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`Option ${oIndex + 1}`}
            required
          />
        </div>
      ))}
    </div>
  );
};

const QuizAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    topic_id: "",
    difficulty: "Medium",
    time_limit: 15,
    questions: [
      {
        question_text: "",
        options: [
          { text: "", is_correct: true },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ],
  });

  // Fetch topics for dropdown
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setTopicsLoading(true);

        const { data, error } = await supabase
          .from("topics")
          .select("id, title")
          .eq("is_published", true)
          .order("title");

        if (error) throw error;

        const formattedTopics = data
          ? data.map((topic) => ({
              id: topic.id,
              name: topic.title,
            }))
          : [];

        setTopics(formattedTopics);

        // Set default topic if available
        if (formattedTopics.length > 0) {
          setQuiz((prev) => ({ ...prev, topic_id: formattedTopics[0].id }));
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setQuiz((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const { value } = e.target;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuiz((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quiz.questions];
    // Reset all options to false
    updatedQuestions[questionIndex].options.forEach((option, i) => {
      option.is_correct = i === optionIndex;
    });
    setQuiz((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: "",
          options: [
            { text: "", is_correct: true },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length <= 1) {
      return; // Don't remove if it's the last question
    }

    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(index, 1);
    setQuiz((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate quiz data
      if (!quiz.title.trim()) throw new Error("Quiz title is required");
      if (!quiz.topic_id) throw new Error("Please select a topic");

      // Validate each question
      for (let i = 0; i < quiz.questions.length; i++) {
        const question = quiz.questions[i];
        if (!question.question_text.trim()) {
          throw new Error(`Question ${i + 1} text is required`);
        }

        // Validate each option
        let hasCorrectOption = false;
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j];
          if (!option.text.trim()) {
            throw new Error(
              `Option ${j + 1} for Question ${i + 1} is required`
            );
          }
          if (option.is_correct) {
            hasCorrectOption = true;
          }
        }

        if (!hasCorrectOption) {
          throw new Error(
            `Question ${i + 1} must have a correct answer selected`
          );
        }
      }

      // Insert quiz into Supabase
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .insert([
          {
            title: quiz.title,
            description: quiz.description,
            topic_id: quiz.topic_id,
            difficulty: quiz.difficulty,
            time_limit: quiz.time_limit,
          },
        ])
        .select();

      if (quizError) throw quizError;

      const quizId = quizData[0].id;

      // Insert questions to quiz_questions
      for (const question of quiz.questions) {
        const { data: questionData, error: questionError } = await supabase
          .from("quiz_questions")
          .insert([
            {
              quiz_id: quizId,
              question_text: question.question_text,
            },
          ])
          .select();

        if (questionError) throw questionError;

        const questionId = questionData[0].id;

        // Insert options to quiz_options for this question
        const optionsToInsert = question.options.map((option) => ({
          question_id: questionId,
          option_text: option.text,
          is_correct: option.is_correct,
        }));

        const { error: optionsError } = await supabase
          .from("quiz_options")
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;
      }

      setSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        navigate("/admin/quizzes");
      }, 2000);
    } catch (error) {
      console.error("Error creating quiz:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="quizzes" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Create New Quiz
              </h1>

              {success ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
                  Quiz created successfully! Redirecting to quizzes page...
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                      {error}
                    </div>
                  )}

                  {/* Quiz Details Section */}
                  <div className="mb-8 p-6 border border-gray-200 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">
                      Quiz Details
                    </h2>

                    <div className="grid grid-cols-1 gap-6 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quiz Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={quiz.title}
                          onChange={handleQuizChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter quiz title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={quiz.description}
                          onChange={handleQuizChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter quiz description"
                          rows="3"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Topic <span className="text-red-500">*</span>
                          </label>
                          {topicsLoading ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400">
                              Loading topics...
                            </div>
                          ) : topics.length === 0 ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-red-50 text-red-500">
                              No published topics available
                            </div>
                          ) : (
                            <select
                              name="topic_id"
                              value={quiz.topic_id}
                              onChange={handleQuizChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            >
                              <option value="">Select a topic</option>
                              {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                  {topic.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty
                          </label>
                          <select
                            name="difficulty"
                            value={quiz.difficulty}
                            onChange={handleQuizChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time Limit (minutes)
                          </label>
                          <input
                            type="number"
                            name="time_limit"
                            value={quiz.time_limit}
                            onChange={handleQuizChange}
                            min="1"
                            max="60"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-800">
                        Questions
                      </h2>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Add Question
                      </button>
                    </div>

                    {/* Render the reusable Question components */}
                    {quiz.questions.map((question, index) => (
                      <QuestionForm
                        key={index}
                        question={question}
                        index={index}
                        onQuestionChange={handleQuestionChange}
                        onOptionChange={handleOptionChange}
                        onCorrectOptionChange={handleCorrectOptionChange}
                        onRemove={() => removeQuestion(index)}
                        isRemovable={quiz.questions.length > 1}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/quizzes")}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      disabled={loading || topicsLoading || topics.length === 0}
                    >
                      {loading ? "Creating Quiz..." : "Create Quiz"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizAdd;
