import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestions } from '../store/dataStore';
import { Target, CheckCircle, ArrowRight, XCircle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

    useEffect(() => {
        const loadQuizData = async () => {
            const data = await getQuestions();
            // Shuffle the questions for randomness
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            setQuestions(shuffled);
            setIsLoading(false);
        };
        loadQuizData();
    }, []);

    const handleOptionSelect = (index) => {
        if (showAnswerFeedback) return;
        setSelectedOption(index);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        // Check Answer
        const currentQ = questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQ.correctOptionIndex;

        if (isCorrect) {
            setScore(prev => prev + (currentQ.marks || 10));
        }

        setShowAnswerFeedback(true);

        setTimeout(() => {
            setShowAnswerFeedback(false);
            setSelectedOption(null);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setIsFinished(true);
            }
        }, 1500); // Show feedback for 1.5s
    };

    const restartQuiz = () => {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        setQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setIsFinished(false);
        setShowAnswerFeedback(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-textMain flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-mono text-textMuted tracking-wider">Loading Digital Systems...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-background text-textMain flex flex-col items-center justify-center p-6 text-center">
                <Target className="w-16 h-16 text-textMuted mb-6 opacity-30" />
                <h2 className="text-2xl font-bold mb-4">Quiz Matrix Offline</h2>
                <p className="text-textMuted max-w-md">The core system currently has no questions configured. Please check back later when new challenges are uploaded.</p>
                <Link to="/" className="mt-8 px-6 py-3 bg-surface hover:bg-surface/80 rounded-xl transition-colors font-medium flex items-center gap-2">
                    <Home className="w-4 h-4" /> Return to Main Node
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative text-textMain dark:text-white font-body selection:bg-accent/30 selection:text-accent overflow-hidden flex flex-col items-center justify-center p-4">

            <main className="relative z-10 w-full max-w-2xl">

                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">
                            <Target className="w-5 h-5 text-accent" />
                        </div>
                        <h1 className="font-heading font-black tracking-wider text-xl">THE <span className="text-accent">MATRIX</span> QZ.</h1>
                    </div>
                    <Link to="/" className="group flex items-center gap-2 text-sm text-textMuted font-medium hover:text-textMain transition-colors">
                        <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Exit System
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="bg-surface/95 dark:bg-[#0f172a]/90 backdrop-blur-3xl border border-black/5 dark:border-white/20 p-8 md:p-12 rounded-[2rem] shadow-2xl relative"
                        >
                            {/* Ambient card glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-accent/20 to-transparent rounded-[2rem] z-[-1] opacity-50 blur-sm"></div>

                            {/* Progress Bar */}
                            <div className="flex justify-between items-center mb-10 text-xs font-mono font-bold tracking-widest text-textMuted">
                                <span>QUESTION {currentQuestionIndex + 1} / {questions.length}</span>

                                <div className="flex gap-1.5">
                                    {questions.map((_, idx) => (
                                        <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentQuestionIndex ? 'bg-accent shadow-[0_0_10px_var(--accent-glow)] scale-125' : idx < currentQuestionIndex ? 'bg-white/30' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold font-heading leading-tight mb-10 text-white">
                                {questions[currentQuestionIndex].title}
                            </h3>

                            <div className="space-y-4">
                                {questions[currentQuestionIndex].options.map((option, idx) => {

                                    const isCorrectOpt = showAnswerFeedback && idx === questions[currentQuestionIndex].correctOptionIndex;
                                    const isWrongOpt = showAnswerFeedback && selectedOption === idx && idx !== questions[currentQuestionIndex].correctOptionIndex;

                                    let btnStatusClass = "bg-background border-borderBase hover:border-accent hover:bg-accent/5 dark:bg-white/5 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10 dark:text-white";
                                    let icon = null;

                                    if (selectedOption === idx) {
                                        btnStatusClass = "bg-accent/10 border-accent text-accent shadow-[0_0_15px_var(--accent-glow)]";
                                    }

                                    if (showAnswerFeedback) {
                                        // Lock hover states
                                        if (isCorrectOpt) {
                                            btnStatusClass = "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                                            icon = <CheckCircle className="w-5 h-5 ml-auto text-green-500" />;
                                        } else if (isWrongOpt) {
                                            btnStatusClass = "bg-red-500/20 border-red-500 text-red-600 dark:text-red-400";
                                            icon = <XCircle className="w-5 h-5 ml-auto text-red-500" />;
                                        } else {
                                            btnStatusClass = "bg-background dark:bg-white/5 border-borderBase dark:border-white/10 opacity-50 cursor-not-allowed text-textMuted";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled={showAnswerFeedback}
                                            onClick={() => handleOptionSelect(idx)}
                                            className={`w-full text-left px-6 py-5 rounded-2xl border transition-all duration-300 font-medium flex items-center relative overflow-hidden group/opt ${btnStatusClass}`}
                                        >
                                            {/* Slight highlight on hover */}
                                            {!showAnswerFeedback && selectedOption !== idx && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/opt:translate-x-full transition-transform duration-700"></div>}

                                            <span className="font-mono text-sm opacity-50 mr-4 w-6">{['A', 'B', 'C', 'D'][idx]}</span>
                                            <span className="relative z-10 leading-snug">{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-10 flex justify-end">
                                <button
                                    onClick={handleNext}
                                    disabled={selectedOption === null || showAnswerFeedback}
                                    className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 ${selectedOption !== null && !showAnswerFeedback
                                        ? 'bg-textMain dark:bg-white text-background dark:text-black hover:bg-accent dark:hover:bg-accent shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_white] hover:shadow-[0_0_25px_var(--accent-glow)] -translate-y-1'
                                        : 'bg-surface dark:bg-white/10 text-textMuted dark:text-white/50 cursor-not-allowed border border-borderBase dark:border-white/20'
                                        }`}
                                >
                                    {currentQuestionIndex === questions.length - 1 ? 'FINISH EXAM' : 'NEXT PROTOCOL'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            className="bg-surface/95 dark:bg-[#0f172a]/90 backdrop-blur-3xl border border-black/5 dark:border-white/20 p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative text-center flex flex-col items-center"
                        >
                            {/* Ambient card glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent rounded-[2.5rem] z-[-1] opacity-50 blur-xl"></div>

                            <h2 className="text-3xl font-black font-heading mb-2">Systems Authorized.</h2>
                            <p className="text-textMuted mb-12">Performance analysis successfully evaluated.</p>

                            {/* Circular Score Indicator */}
                            <div className="relative w-48 h-48 mb-8">
                                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                    {/* Track */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth="8"
                                    />
                                    {/* Progress */}
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="url(#accent-gradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "0 283" }}
                                        animate={{ strokeDasharray: `${(score / (questions.length * 10)) * 283} 283` }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    />
                                    <defs>
                                        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#0ea5e9" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400 text-glow"
                                    >
                                        {score}
                                    </motion.span>
                                    <span className="text-xs font-mono text-textMuted tracking-widest mt-1">/ {questions.length * 10} XP</span>
                                </div>
                            </div>

                            {/* Descriptive text based on score ratio */}
                            {score / (questions.length * 10) >= 0.8 ? (
                                <p className="text-xl font-medium mb-10 text-green-400">Exceptional Neural Alignment.</p>
                            ) : score / (questions.length * 10) >= 0.5 ? (
                                <p className="text-xl font-medium mb-10 text-accent">Good effort, synchronization established.</p>
                            ) : (
                                <p className="text-xl font-medium mb-10 text-orange-400">Data integrity compromised. Try again.</p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button
                                    onClick={restartQuiz}
                                    className="flex-1 py-4 border border-white/10 hover:bg-white/5 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                                >
                                    <RotateCcw className="w-4 h-4" /> Recalibrate
                                </button>
                                <Link
                                    to="/"
                                    className="flex-1 py-4 bg-accent hover:bg-white text-white hover:text-black rounded-xl hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300 font-bold flex items-center justify-center gap-2 text-sm"
                                >
                                    <Home className="w-4 h-4" /> Main Hub
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
