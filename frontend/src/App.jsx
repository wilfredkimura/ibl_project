import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import Members from "./components/Members.jsx";
import Leaders from "./components/Leaders.jsx";
import Blog from "./components/Blog.jsx";
import Events from "./components/Events.jsx";
import Gallery from "./components/Gallery.jsx";
import GalleryAlbums from "./components/GalleryAlbums.jsx";
import GalleryAlbum from "./components/GalleryAlbum.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";

const clerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const SignedInWrapper = clerkEnabled
  ? SignedIn
  : ({ children }) => <>{children}</>;

const SignedOutWrapper = clerkEnabled
  ? SignedOut
  : ({ children }) => null;

const RedirectToSignInWrapper = clerkEnabled
  ? RedirectToSignIn
  : () => null;

const SignInWrapper = clerkEnabled
  ? SignIn
  : () => <Login />;

const SignUpWrapper = clerkEnabled
  ? SignUp
  : () => <Register />;

function ClerkGuard({ children, adminOnly = false }) {
  return (
    <>
      <SignedInWrapper>{children}</SignedInWrapper>
      <SignedOutWrapper>
        <RedirectToSignInWrapper />
      </SignedOutWrapper>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaders" element={<Leaders />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<GalleryAlbums />} />
            <Route path="/gallery/album/:id" element={<GalleryAlbum />} />
            <Route path="/gallery/ungrouped" element={<GalleryAlbum ungrouped />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-in/*" element={<SignInWrapper routing="path" path="/sign-in" />} />
            <Route path="/sign-up/*" element={<SignUpWrapper routing="path" path="/sign-up" />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ClerkGuard>
                  <Profile />
                </ClerkGuard>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ClerkGuard>
                  <Profile />
                </ClerkGuard>
              }
            />
            <Route
              path="/members"
              element={
                <ClerkGuard>
                  <Members />
                </ClerkGuard>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
