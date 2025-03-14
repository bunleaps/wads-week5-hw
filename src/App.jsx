import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoList from "./components/todos/TodoList.jsx";
import Navbar from "./components/Navbar.jsx";
import { useState, useEffect } from "react";
import Account from "./components/Account";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileVersion, setProfileVersion] = useState(0); // profile version for nav update

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleProfileUpdate = () => {
    setProfileVersion((prev) => prev + 1); // Force re-render of Navbar
  };

  return (
    <Router>
      <div>
        <Navbar user={user} key={profileVersion} />
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/todos" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/todos" />}
          />
          <Route
            path="/todos"
            element={user ? <TodoList /> : <Navigate to="/login" />}
          />
          <Route
            path="/account"
            element={
              user ? (
                <Account onProfileUpdate={handleProfileUpdate} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/todos" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
