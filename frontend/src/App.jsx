import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

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

import Admin from "./pages/admin/Admin";
// Admin Content Imports
import Content from "./pages/admin/pages/content/Content";
import ContentAdd from "./pages/admin/pages/content/ContentAdd";
import ContentView from "./pages/admin/pages/content/ContentView";
import TopicAdd from "./pages/admin/pages/content/TopicAdd";
import TopicView from "./pages/admin/pages/content/TopicView";
import SubTopicAdd from "./pages/admin/pages/content/SubTopicAdd";
import SubTopicView from "./pages/admin/pages/content/SubTopicView";
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

// Example of a protected route component
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

          {/* admin route */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          {/* admin content routes */}
          <Route
            path="/admin/content"
            element={
              <PrivateRoute>
                <Content />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/content/contents/add"
            element={
              <PrivateRoute>
                <ContentAdd />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/content/topics/add"
            element={
              <PrivateRoute>
                <TopicAdd />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/content/topics/view"
            element={
              <PrivateRoute>
                <TopicView />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/content/subtopics/add"
            element={
              <PrivateRoute>
                <SubTopicAdd />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/content/subtopics/view"
            element={
              <PrivateRoute>
                <SubTopicView />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/content/contents/view"
            element={
              <PrivateRoute>
                <ContentView />
              </PrivateRoute>
            }
          />

          {/* admin quiz routes */}
          <Route
            path="/admin/quizzes"
            element={
              <PrivateRoute>
                <Quizzes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/quizzes/create"
            element={
              <PrivateRoute>
                <QuizAdd />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/quizzes/edit"
            element={
              <PrivateRoute>
                <QuizEdit />
              </PrivateRoute>
            }
          />
          {/* admin posts routes */}
          <Route
            path="/admin/posts"
            element={
              <PrivateRoute>
                <PostsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/posts/view"
            element={
              <PrivateRoute>
                <PostsView />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/posts/delete"
            element={
              <PrivateRoute>
                <PostsDelete />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/posts/users/ban"
            element={
              <PrivateRoute>
                <UsersBan />
              </PrivateRoute>
            }
          />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
