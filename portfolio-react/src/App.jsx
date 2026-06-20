import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { NAME } from "./constants";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import JourneyPage from "./pages/JourneyPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import "./App.css";

export default function App() {
  useEffect(() => {
    document.title = `${NAME} — React Portfolio`;
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="journey" element={<JourneyPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}
