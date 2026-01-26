import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  publishableKey ? (
    <ClerkProvider publishableKey={publishableKey}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  ) : (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
);
