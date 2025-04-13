import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

//Temporary
import Game1 from "./games/Game1";
import Game2 from "./games/Game2";
import Game3 from "./games/Game3";
import Game5 from "./games/Game5";

import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Safety from "./pages/Safety";
import FAQs from "./pages/FAQs";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Posts from "./pages/Posts";
import Ask from "./pages/Ask";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Games from "./pages/Games";

import Admin from "./pages/admin/Admin";
// Admin Content Imports
import Content from "./pages/admin/pages/content/Content";
import ContentAdd from "./pages/admin/pages/content/ContentAdd";
import ContentView from "./pages/admin/pages/content/ContentView";
import TopicAdd from "./pages/admin/pages/content/TopicAdd";
import TopicView from "./pages/admin/pages/content/TopicView";
import SubTopicAdd from "./pages/admin/pages/content/SubTopicAdd";
import SubTopicView from "./pages/admin/pages/content/SubTopicView";

// Parental Control Imports
import ParentalControl from "./pages/ParentalControl";

// Admin Quiz Imports
import Quizzes from "./pages/admin/pages/quiz/Quizzes";
import QuizAdd from "./pages/admin/pages/quiz/QuizAdd";
import QuizEdit from "./pages/admin/pages/quiz/QuizEdit";
// Admin Post Imports
import PostsAdmin from "./pages/admin/pages/posts/Posts";
import PostsView from "./pages/admin/pages/posts/PostsView";
import UsersBan from "./pages/admin/pages/posts/UsersBan";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PostsDelete from "./pages/admin/pages/posts/PostsDelete";
import ErrorBoundary from "./components/ErrorBoundary";
import QuizPage from "./pages/QuizPage";
import AdminRoute from "./components/AdminRoute";
import Game4 from "./games/Game4";

const PrivateRoute = ({ children }) => {
  const { user, loading, sessionChecked } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (sessionChecked && !user && !loading && !redirecting) {
      setRedirecting(true);
      navigate("/login", {
        state: { from: window.location.pathname },
        replace: true,
      });
    }
  }, [user, loading, sessionChecked, navigate, redirecting]);

  if (loading || !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ErrorBoundary>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/faqs" element={<FAQs />} />

            {/* auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* private routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/modules"
              element={
                <PrivateRoute>
                  <Modules />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <PrivateRoute>
                  <Posts />
                </PrivateRoute>
              }
            />
            <Route
              path="/ask"
              element={
                <PrivateRoute>
                  <Ask />
                </PrivateRoute>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <PrivateRoute>
                  <QuizPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/games"
              element={
                <PrivateRoute>
                  <Games />
                </PrivateRoute>
              }
            />

            {/* admin route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            {/* admin content routes */}
            <Route
              path="/admin/content"
              element={
                <AdminRoute>
                  <Content />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content/contents/add"
              element={
                <AdminRoute>
                  <ContentAdd />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content/topics/add"
              element={
                <AdminRoute>
                  <TopicAdd />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content/topics/view"
              element={
                <AdminRoute>
                  <TopicView />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content/subtopics/add"
              element={
                <AdminRoute>
                  <SubTopicAdd />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content/subtopics/view"
              element={
                <AdminRoute>
                  <SubTopicView />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content/contents/view"
              element={
                <AdminRoute>
                  <ContentView />
                </AdminRoute>
              }
            />

            {/* admin quiz routes */}
            <Route
              path="/admin/quizzes"
              element={
                <AdminRoute>
                  <Quizzes />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes/create"
              element={
                <AdminRoute>
                  <QuizAdd />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes/edit"
              element={
                <AdminRoute>
                  <QuizEdit />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes/edit/:id"
              element={
                <AdminRoute>
                  <QuizEdit />
                </AdminRoute>
              }
            />
            {/* admin posts routes */}
            <Route
              path="/admin/posts"
              element={
                <AdminRoute>
                  <PostsAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts/view"
              element={
                <AdminRoute>
                  <PostsView />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts/delete"
              element={
                <AdminRoute>
                  <PostsDelete />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/posts/users/ban"
              element={
                <AdminRoute>
                  <UsersBan />
                </AdminRoute>
              }
            />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />

            {/* Temporary Game Route */}
            <Route
              path="/games/game1"
              element={
                <PrivateRoute>
                  <Game1 />
                </PrivateRoute>
              }
            />
            <Route
              path="/games/game2"
              element={
                <PrivateRoute>
                  <Game2 />
                </PrivateRoute>
              }
            />
            <Route
              path="/games/game3"
              element={
                <PrivateRoute>
                  <Game3 />
                </PrivateRoute>
              }
            />
            <Route
              path="/games/game4"
              element={
                <PrivateRoute>
                  <Game4 />
                </PrivateRoute>
              }
            />
            <Route
              path="/games/game5"
              element={
                <PrivateRoute>
                  <Game5 />
                </PrivateRoute>
              }
            />

            {/* parental control routes */}
            <Route
              path="/parental-control"
              element={
                <PrivateRoute>
                  <ParentalControl />
                </PrivateRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
};

export default App;
