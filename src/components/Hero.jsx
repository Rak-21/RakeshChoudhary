import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownCircle, Cpu, Linkedin, Download } from 'lucide-react';
import { getResume, openResumeInNewTab } from '../store/dataStore';

export default function Hero() {
    const [resumeUrl, setResumeUrl] = useState(null);

    useEffect(() => {
        getResume().then(data => {
            if (data?.dataUrl) setResumeUrl(data.dataUrl);
        }).catch(() => {});
    }, []);

    const containerVars = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVars = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section id="home" className="relative min-h-[100vh] flex items-center overflow-hidden w-full pt-20 bg-background">
            
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[position:right_center]"
                style={{
                    backgroundImage: "url('/hero-bg-final.jpg')"
                }}
            />

            {/* Gradients Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Vertical Gradient (Top to Bottom), masked to not cover the right side subject */}
                <div 
                    className="absolute inset-0 bg-gradient-to-b from-background from-0% via-background/50 via-30% to-transparent to-100%"
                    style={{
                        maskImage: 'linear-gradient(to right, black 30%, transparent 90%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 90%)'
                    }}
                />
                
                {/* Horizontal Gradient (Left to Right) for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-background from-[0%] via-background/70 to-transparent to-[60%]" />
            </div>

            <div className="relative z-10 w-full container mx-auto px-6">
                <div className="flex flex-col w-full lg:w-[60%] text-left">
                    {/* Text Content */}
                    <motion.div
                        variants={containerVars}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col space-y-8"
                    >
                        {/* Badge */}
                        <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/40 bg-white/40 dark:bg-black/10 text-accent text-sm font-medium tracking-wide shadow-[0_0_15px_var(--accent-glow)] w-fit backdrop-blur-sm">
                            <Cpu className="w-4 h-4" />
                            <span>Bridging Strategy, Operations & Technology</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={itemVars} className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-textMain leading-[1.1]">
                            I Drive <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent filter drop-shadow-[0_0_12px_var(--accent-glow)]">Strategy.</span><br />
                            I Deliver <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent filter drop-shadow-[0_0_12px_var(--accent-glow)]">Transformation.</span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p variants={itemVars} className="text-lg md:text-xl text-textMain/80 dark:text-textMuted leading-relaxed max-w-xl font-medium dark:font-normal">
                            Helping organizations navigate change, unlock growth, and modernize operations through strategic planning, disciplined execution, and technology-led transformation.
                        </motion.p>

                        {/* CTA and Socials */}
                        <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-start justify-start gap-6 pt-4">
                            <a href="#journey" className="w-full sm:w-auto px-10 py-4 bg-accent text-white dark:text-background font-bold rounded-xl shadow-[0_0_20px_var(--accent-glow)] hover:scale-105 hover:shadow-[0_0_30px_var(--accent-glow)] transition-all duration-300 text-center">
                                Explore My Journey
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); resumeUrl ? openResumeInNewTab(resumeUrl) : alert('Resume not uploaded yet. Please check back soon!'); }}
                                className="w-full sm:w-auto px-10 py-4 bg-transparent border border-borderBase text-textMain font-medium rounded-xl hover:border-accent hover:text-accent hover:scale-105 hover:shadow-[0_0_20px_var(--accent-glow)] hover:bg-accent/10 hover:[text-shadow:0_0_10px_var(--accent-glow)] transition-all duration-300 glass text-center cursor-pointer"
                            >
                                Download Resume
                            </a>

                            {/* LinkedIn Icon */}
                            <a
                                href="https://www.linkedin.com/in/rak2597"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 flex items-center justify-center rounded-xl bg-surface/30 backdrop-blur-md border border-white/40 dark:border-borderBase text-textMain hover:border-accent hover:text-accent hover:shadow-[0_0_20px_var(--accent-glow)] hover:bg-accent/10 transition-all duration-300 shrink-0"
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin className="w-6 h-6 transition-transform hover:scale-110" />
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-textMuted flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
            >
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                <ArrowDownCircle className="w-5 h-5 text-accent/70" />
            </motion.div>
        </section>
    );
}
