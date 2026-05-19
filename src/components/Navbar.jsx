import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { getResume, openResumeInNewTab } from '../store/dataStore';

const navItems = ['Home', 'Journey', 'Impact', 'Recognition', 'Contact', 'Resume'];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [resumeUrl, setResumeUrl] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Intersection Observer for active section tracking
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
        );

        // Observe all page sections
        navItems.forEach((item) => {
            if (item !== 'Resume') {
                const el = document.getElementById(item.toLowerCase());
                if (el) observer.observe(el);
            }
        });

        // Fetch live resume URL from Firebase
        getResume().then(data => {
            if (data?.dataUrl) setResumeUrl(data.dataUrl);
        }).catch(() => {});

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <>
            <div className="fixed top-4 left-4 md:left-[calc(50%-40px)] md:-translate-x-1/2 z-50">
                <motion.div
                    className={`flex items-center px-2 py-2 transition-all duration-500 rounded-full ${scrolled ? 'glass scale-95' : 'bg-transparent shadow-none scale-100'
                        }`}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 ml-1 mr-2 rounded-full hover:bg-surface transition-colors flex items-center justify-center text-textMain hover:text-accent"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 sm:gap-2 px-4">
                        {navItems.map((item, index) => {
                            const isResume = item === 'Resume';
                            const href = isResume ? '#' : `#${item.toLowerCase()}`;
                            const isActive = activeSection === item.toLowerCase();
                            return (
                                <a
                                    key={item}
                                    href={href}
                                    target={isResume ? undefined : undefined}
                                    rel={isResume ? 'noopener noreferrer' : undefined}
                                    onClick={isResume ? (e) => { e.preventDefault(); resumeUrl ? openResumeInNewTab(resumeUrl) : alert('Resume not available yet.'); } : undefined}
                                    className={`relative px-3 py-2 text-sm transition-colors hover:text-accent group ${isActive ? 'text-accent font-bold' : 'text-textMain font-medium'}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {item}
                                    {/* Active Underline */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="active-nav-indicator"
                                            className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_8px_var(--accent-glow)]"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                    {/* Hover Underline */}
                                    <AnimatePresence>
                                        {hoveredIndex === index && !isActive && (
                                            <motion.span
                                                className="absolute bottom-0 left-0 w-full h-[2px] bg-accentGlow"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </a>
                            );
                        })}
                    </nav>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="ml-auto md:ml-2 p-2 rounded-full hover:bg-surface transition-colors flex items-center justify-center text-textMain dark:text-textMuted hover:text-accent group"
                        aria-label="Toggle Theme"
                    >
                        <motion.div
                            animate={{ rotate: isDark ? 180 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {isDark ? (
                                <Moon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_var(--accent-glow)]" />
                            ) : (
                                <Sun className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_var(--accent-glow)]" />
                            )}
                        </motion.div>
                    </button>
                </motion.div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-20 left-4 z-40 w-48 py-2 rounded-xl glass border border-borderBase flex flex-col items-start px-2 md:hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    >
                        {navItems.map((item) => {
                            const isResume = item === 'Resume';
                            const href = isResume ? '#' : `#${item.toLowerCase()}`;
                            const isActive = activeSection === item.toLowerCase();
                            return (
                                <a
                                    key={item}
                                    href={href}
                                    onClick={isResume ? (e) => { e.preventDefault(); resumeUrl ? openResumeInNewTab(resumeUrl) : alert('Resume not available yet.'); setIsMenuOpen(false); } : () => setIsMenuOpen(false)}
                                    className={`w-full py-3 px-4 text-sm transition-all rounded-lg text-left ${isActive ? 'text-accent font-bold bg-surface/50 border-l-4 border-accent' : 'text-textMain font-medium hover:text-accent hover:bg-surface'}`}
                                >
                                    {item}
                                </a>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
