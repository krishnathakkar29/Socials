import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/auth/signup/SignupPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const {
    data: authUser,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");

        const data = await res.json();
		if(data.error) return null

        //   or you can do (!res.ok || data.error)
        if (!res.ok)
          throw new Error(
            data.error || "Something went wrong while finding user details"
          );

        console.log("auth user is : ", data);
        return data;
      } catch (error) {
        console.log("app mein me lete time error ", error);
        throw new Error(error);
      }
    },
	retry: false
  });

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="flex max-w-6xl mx-auto">
      { authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
      { authUser && <RightPanel />}
    </div>
  );
}

export default App;
