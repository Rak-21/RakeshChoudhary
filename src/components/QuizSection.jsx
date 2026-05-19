import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizSection() {
    return (
        <section id="quiz-cta" className="hidden relative py-24 w-full flex flex-col items-center justify-center overflow-hidden">


            <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="bg-surface/30 backdrop-blur-xl border border-borderBase p-12 rounded-3xl relative group overflow-hidden"
                >
                    {/* Glowing highlight ring around the card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                    <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_var(--accent-glow)] group-hover:scale-110 transition-transform duration-500 relative z-10">
                        <Target className="w-10 h-10 text-accent" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-6 relative z-10">
                        Think You Know My <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#0f172a] text-glow">Digital World?</span>
                    </h2>

                    <p className="text-lg text-textMuted mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
                        Test your knowledge on digital transformation, legacy mining systems, and future tech. Take the ultimate quiz and see how well you align with the Conscious Chronicle vision!
                    </p>

                    <Link
                        to="/quiz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex relative z-20 items-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all duration-300 group/btn hover:-translate-y-1"
                    >
                        Take The Ultimate Quiz
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
