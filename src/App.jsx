import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import initializeNotifications from "../notifications";
import Navbar from "./components/NavBar";
import { FiltersProvider } from "./context/FiltersContext";
import { useAuth } from "./context/Login";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog/Blog";
import Community from "./pages/Community/Community";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import RecoverPassword from "./pages/RecoverPassword";
import Home from "./pages/Home";
import HomeApp from "./pages/HomeApp/HomeApp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import UserDetails from "./pages/UserDetails/UserDetails";
import UserManager from "./pages/UserManager/UserManager";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#654ea3",
    },
  },
  typography: {
    fontFamily: ["Source Code Pro"].join(","),
  },
});

function PrivateRoute({ element }) {
  const auth = useAuth();

  return auth.loading ? null : auth.user ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
}

function UserDetailsWrapper() {
  const { userId } = useParams();
  const auth = useAuth();

  return auth.loading ? null : auth.user ? (
    <UserDetails userId={userId} />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  const [newNotifications, setNewNotifications] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      initializeNotifications(user, () => setNewNotifications(true));
    }
  }, [user]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <FiltersProvider>
            <CssBaseline />
            <Navbar
              newNotifications={newNotifications}
              onNotificationsRefresh={() => setNewNotifications(false)}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<RecoverPassword />}
              />
              <Route
                path="/profile"
                element={<PrivateRoute element={<Profile />} />}
              />
              <Route
                path="/editProfile"
                element={<PrivateRoute element={<EditProfile />} />}
              />
              <Route
                path="/home"
                element={<PrivateRoute element={<HomeApp />} />}
              />
              <Route path="/user/:userId" element={<UserDetailsWrapper />} />
              <Route
                path="/community"
                element={<PrivateRoute element={<Community />} />}
              />
              <Route path="/blog" element={<Blog />} />
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/userManager" element={<UserManager />} />
            </Routes>
          </FiltersProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
