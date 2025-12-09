import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./Components/Nav";
import Footer from "./Components/Footer";
import { ProtectedRoute, PublicRoute } from "./Components/ProtectedRoute";

// Lazy load components
const Home = lazy(() => import("./Components/Home"));
const Features = lazy(() => import("./Components/Features"));
const About = lazy(() => import("./Components/About"));
const Plans = lazy(() => import("./Components/Plans"));
const Extra = lazy(() => import("./Components/Extra"));
const Banner = lazy(() => import("./Components/Banner"));
const Blog = lazy(() => import("./Components/Blog"));
const Contact = lazy(() => import("./Components/ContactUs"));
const Signin = lazy(() => import("./Components/Signin"));
const Book = lazy(() => import("./Components/Book"));
const Hotel = lazy(() => import("./Components/Hotel"));
const Support = lazy(() => import("./Components/Support"));
const Login = lazy(() => import("./Components/Login"));

// Scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

// Page wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// Combined home page
function Text() {
  return (
    <>
      <section id="home">
        <Home />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="plans">
        <Plans />
      </section>
      <section id="extra">
        <Extra />
      </section>
      <section id="banner">
        <Banner />
      </section>
      <section id="blogs">
        <Blog />
      </section>
    </>
  );
}

// Layout
function MainLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}

// 🌊 Liquid Loader
const LiquidLoader = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 overflow-hidden z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Blobs */}
      <motion.div
        className="absolute w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-40"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 30, -30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-cyan-300 rounded-full blur-3xl opacity-50"
        animate={{
          x: [30, -40, 40, -30],
          y: [20, -30, 30, -20],
          scale: [1.1, 0.8, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-50"
        animate={{
          x: [-40, 40, -40, 0],
          y: [40, -20, 30, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
        }}
      />

      {/* Center Logo */}
      <motion.h1
        className="relative text-white text-5xl font-extrabold tracking-wide drop-shadow-xl"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1.05, 1],
          opacity: 1,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        ✈️ AeroBooking
      </motion.h1>

      {/* Progress Fill Effect */}
      <motion.div
        className="absolute bottom-24 w-56 h-1.5 bg-white/30 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

// Root App
function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LiquidLoader />;

  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Main Landing Page */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <PageWrapper>
                    <Text />
                  </PageWrapper>
                </MainLayout>
              }
            />

            {/* Login */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <MainLayout>
                    <PageWrapper>
                      <Login />
                    </PageWrapper>
                  </MainLayout>
                </PublicRoute>
              }
            />

            {/* Signup */}
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <MainLayout>
                    <PageWrapper>
                      <Signin />
                    </PageWrapper>
                  </MainLayout>
                </PublicRoute>
              }
            />

            {/* Bookings */}
            <Route
              path="/book"
              element={
                <MainLayout>
                  <PageWrapper>
                    <Book />
                  </PageWrapper>
                </MainLayout>
              }
            />

            {/* Hotel */}
            <Route
              path="/hotel"
              element={
                <MainLayout>
                  <PageWrapper>
                    <Hotel />
                  </PageWrapper>
                </MainLayout>
              }
            />

            {/* Contact */}
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <PageWrapper>
                    <Contact />
                  </PageWrapper>
                </MainLayout>
              }
            />

            {/* Support */}
            <Route
              path="/support"
              element={
                <MainLayout>
                  <PageWrapper>
                    <Support />
                  </PageWrapper>
                </MainLayout>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}

export default App;
