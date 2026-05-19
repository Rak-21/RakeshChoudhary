import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DepthGauge from './components/DepthGauge';
import Hero from './components/Hero';
import Journey from './components/Journey';
import Impact from './components/Impact';
import Recognition from './components/Recognition';
import Blogs from './components/Blogs';
import QuizSection from './components/QuizSection';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';

function Portfolio() {
  return (
    <div className="relative min-h-screen text-textMain font-body selection:bg-accent/30 selection:text-accent" style={{ overflowX: 'clip' }}>
      <Navbar />
      <DepthGauge />

      <main className="relative z-10 flex flex-col items-center w-full pr-12 md:pr-20">
        <Hero />
        <Journey />
        <Impact />
        <Recognition />
        <Blogs />
        <QuizSection />
        <Contact />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  );
}

export default App;
