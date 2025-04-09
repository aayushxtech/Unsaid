import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";
import { supabase } from "../../../../supabaseClient";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";

const QuizzesList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [topicsMap, setTopicsMap] = useState({});

  useEffect(() => {
    fetchQuizzes();
    fetchTopics();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setQuizzes(data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError("Failed to load quizzes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase.from("topics").select("id, title");

      if (error) throw error;

      // Create a map of topic IDs to names for quick lookup
      const map = {};
      if (data) {
        data.forEach((topic) => {
          map[topic.id] = topic.title;
        });
      }
      setTopicsMap(map);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      setDeleteLoading(true);

      // First, get all questions for this quiz
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("id")
        .eq("quiz_id", id);

      if (questionsError) throw questionsError;

      // If there are questions, delete their options first
      if (questions && questions.length > 0) {
        const questionIds = questions.map((q) => q.id);

        // Delete all options for these questions
        const { error: optionsError } = await supabase
          .from("options")
          .delete()
          .in("question_id", questionIds);

        if (optionsError) throw optionsError;

        // Delete the questions
        const { error: deleteQuestionsError } = await supabase
          .from("questions")
          .delete()
          .eq("quiz_id", id);

        if (deleteQuestionsError) throw deleteQuestionsError;
      }

      // Delete the quiz itself
      const { error: deleteQuizError } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", id);

      if (deleteQuizError) throw deleteQuizError;

      // Update local state
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz: " + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter quizzes based on search term and filter selection
  const filteredQuizzes = quizzes.filter((quiz) => {
    // Apply search filter
    const matchesSearch =
      quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topicsMap[quiz.topic_id]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Apply category filter
    if (filter === "all") return matchesSearch;
    if (filter === "easy") return matchesSearch && quiz.difficulty === "Easy";
    if (filter === "medium")
      return matchesSearch && quiz.difficulty === "Medium";
    if (filter === "hard") return matchesSearch && quiz.difficulty === "Hard";

    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="quizzes" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Quizzes
                </h1>
                <Link
                  to="/admin/quizzes/create"
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Add New Quiz
                </Link>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="md:flex-1">
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={fetchQuizzes}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                  {error}
                </div>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No quizzes found.</p>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search or{" "}
                    <Link
                      to="/admin/quizzes/create"
                      className="text-indigo-600 hover:underline"
                    >
                      create a new quiz
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quiz
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Topic
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Difficulty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time (min)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredQuizzes.map((quiz) => (
                        <tr key={quiz.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">
                                {quiz.title}
                              </div>
                              {quiz.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {quiz.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {topicsMap[quiz.topic_id] || "Unknown Topic"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                quiz.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800"
                                  : quiz.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {quiz.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {quiz.time_limit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/admin/quizzes/view/${quiz.id}`}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="View Quiz"
                              >
                                <FiEye />
                              </Link>
                              <Link
                                to={`/admin/quizzes/edit/${quiz.id}`}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Edit Quiz"
                              >
                                <FiEdit />
                              </Link>
                              <button
                                onClick={() => setConfirmDelete(quiz)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete Quiz"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Quiz Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the quiz "{confirmDelete.title}"?
              This action cannot be undone.
            </p>
            <p className="text-sm text-red-600 mb-4">
              This will also delete all questions and answers associated with
              this quiz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuiz(confirmDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-75"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesList;
