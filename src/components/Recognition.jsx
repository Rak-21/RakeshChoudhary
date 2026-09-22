import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award, X, Send, Loader2, ArrowUpRight, MessageSquareQuote, FileBadge } from 'lucide-react';
import { getTestimonies, saveTestimony, getRecognitions, getCertificates } from '../store/dataStore';

export default function Recognition() {
    // Testimony Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ name: '', company: '', relation: '', position: '', comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [approvedTestimonies, setApprovedTestimonies] = useState([]);
    const [recognitions, setRecognitions] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [currentTestimonyPage, setCurrentTestimonyPage] = useState(0);

    // Certificates Slider State
    const [activeCertIndex, setActiveCertIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);

    useEffect(() => {
        if (certificates.length === 0 || isHovered) return;
        const interval = setInterval(() => {
            setActiveCertIndex((prev) => (prev + 1) % certificates.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [certificates.length, isHovered]);

    const nextCert = () => setActiveCertIndex((prev) => (prev + 1) % certificates.length);
    const prevCert = () => setActiveCertIndex((prev) => (prev - 1 + certificates.length) % certificates.length);

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setIsHovered(true); // pause auto-play while dragging
    };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
    };
    const handleMouseUp = (e) => {
        if (!isDragging) return;
        const delta = e.clientX - dragStartX;
        if (Math.abs(delta) > 40) {
            // drag LEFT (delta < 0) → the right-side cert should come to center → prevCert
            // drag RIGHT (delta > 0) → the left-side cert should come to center → nextCert
            if (delta < 0) prevCert();
            else nextCert();
        }
        setIsDragging(false);
        setIsHovered(false);
    };
    const handleMouseLeaveSlider = () => {
        if (isDragging) {
            setIsDragging(false);
        }
        setIsHovered(false);
    };

    useEffect(() => {
        const loadData = async () => {
            const tData = await getTestimonies();
            const approved = tData.filter(t => t.approved);
            // Sort by sequence (items without sequence go to the end)
            approved.sort((a, b) => {
                const seqA = typeof a.sequence === 'number' ? a.sequence : 999999;
                const seqB = typeof b.sequence === 'number' ? b.sequence : 999999;
                return seqA - seqB;
            });
            setApprovedTestimonies(approved);
            const rData = await getRecognitions();
            setRecognitions(rData);
            const cData = await getCertificates();
            setCertificates(cData);
        };
        loadData();
    }, []);

    const handleTestimonySubmit = async (e) => {
        e.preventDefault();
        if (!modalData.name || !modalData.company || !modalData.relation || !modalData.position || !modalData.comment) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to Firebase Database FIRST
            await saveTestimony({
                name: modalData.name,
                company: modalData.company,
                relation: modalData.relation,
                position: modalData.position,
                comment: modalData.comment
            });

            // Fire and forget email notification
            fetch(`https://formsubmit.co/ajax/rrakesh.cho@gmail.com`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: modalData.name,
                    email: "No Email Provided (Testimony)",
                    message: `COMPANY: ${modalData.company}\nRELATIONSHIP: ${modalData.relation}\nPOSITION: ${modalData.position}\n\nTESTIMONY:\n${modalData.comment}`,
                    _subject: `New Testimony from ${modalData.name}`,
                    _template: "table"
                })
            }).catch(e => console.log("Email notification suppressed", e));

            alert("Testimony submitted successfully! It is pending review.");
            setModalData({ name: '', company: '', relation: '', position: '', comment: '' });
            setIsModalOpen(false);
        } catch (error) {
            alert("Error saving testimony. Please check your internet connection and try again.");
            console.error("Testimony Save Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Current index tracks the LEFT page.
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward
    const [isMobile, setIsMobile] = useState(false);

    // Determines how many pages we show per view
    const itemsPerPage = isMobile ? 1 : 2;
    const totalPages = Math.ceil(recognitions.length / itemsPerPage);
    const currentViewIndex = Math.floor(currentPage / itemsPerPage);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextPage = () => {
        if (currentPage + itemsPerPage < recognitions.length) {
            setDirection(1);
            setCurrentPage((prev) => prev + itemsPerPage);
        }
    };

    const prevPage = () => {
        if (currentPage - itemsPerPage >= 0) {
            setDirection(-1);
            setCurrentPage((prev) => prev - itemsPerPage);
        }
    };

    const duration = 0.8;
    const ease = [0.22, 1, 0.36, 1]; // Quick snap for realism

    // Left Page always pivots from the right edge (origin-right)
    const leftVariants = {
        enter: (dir) => ({
            rotateY: dir > 0 ? 180 : 0, // Next: start folded over right; Prev: start flat
            zIndex: dir > 0 ? 10 : 0,
            opacity: 1
        }),
        center: {
            rotateY: 0,
            zIndex: 5,
            opacity: 1,
            transition: { duration, ease }
        },
        exit: (dir) => ({
            rotateY: dir < 0 ? 180 : 0, // Prev: fold over to right; Next: stay flat
            zIndex: dir < 0 ? 10 : 0,
            opacity: dir > 0 ? 0.99 : 1, // trigger animation to prevent instant unmount
            transition: { duration, ease }
        })
    };

    // Right Page always pivots from the left edge (origin-left)
    const rightVariants = {
        enter: (dir) => ({
            rotateY: dir < 0 ? -180 : 0, // Prev: start folded over left; Next: start flat
            zIndex: dir < 0 ? 10 : 0,
            opacity: 1
        }),
        center: {
            rotateY: 0,
            zIndex: 5,
            opacity: 1,
            transition: { duration, ease }
        },
        exit: (dir) => ({
            rotateY: dir > 0 ? -180 : 0, // Next: fold over to left; Prev: stay flat
            zIndex: dir > 0 ? 10 : 0,
            opacity: dir < 0 ? 0.99 : 1, // trigger animation to prevent instant unmount
            transition: { duration, ease }
        })
    };

    return (
        <section id="recognition" className="relative min-h-[90vh] flex flex-col items-center justify-center py-24 w-full overflow-hidden">
            {/* Background elements removed as requested */}

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium tracking-wide shadow-[0_0_15px_var(--accent-glow)] mb-4">
                        <Award className="w-4 h-4" />
                        <span>Milestones & Acclaim</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4">
                        Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#0284c7] dark:to-white text-glow">Recognition.</span>
                    </h2>
                    <p className="text-textMuted text-lg max-w-xl mx-auto">
                        A chronicle of achievements, awards, and milestones acknowledged by the industry.
                    </p>
                </motion.div>

                {/* The Book Container */}
                <div className="relative w-full max-w-5xl mx-auto" style={{ perspective: "2500px" }}>
                    <div className="relative h-[600px] sm:h-[500px] w-full flex bg-surface/50 backdrop-blur-xl border border-borderBase shadow-2xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                        {/* Book Base Background (static) */}
                        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
                            <div className="h-full border-r border-borderBase/50 bg-gradient-to-r from-transparent to-black/5" />
                            <div className="hidden md:block h-full bg-gradient-to-l from-transparent to-black/5" />
                        </div>

                        {/* Left Page Side */}
                        <div className={`w-full ${isMobile ? '' : 'md:w-1/2'} h-full relative z-10`} style={{ transformStyle: 'preserve-3d' }}>
                            <AnimatePresence initial={false} custom={direction}>
                                {recognitions[currentPage] && (
                                    <motion.div
                                        key={`left-${currentPage}`}
                                        custom={direction}
                                        variants={leftVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0 origin-right border-r border-borderBase/50 bg-surface flex flex-col shadow-[inset_-10px_0_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_-10px_0_20px_rgba(0,0,0,0.5)] bg-gradient-to-r from-surface to-surface/95"
                                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                                    >
                                        <div className="h-1/2 w-full overflow-hidden relative group p-6 pb-2">
                                            <div className="w-full h-full rounded-xl overflow-hidden relative border border-borderBase/50">
                                                <img
                                                    src={recognitions[currentPage].image}
                                                    alt={recognitions[currentPage].title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-accent/20 mix-blend-overlay"></div>
                                            </div>
                                        </div>
                                        <div className="h-1/2 px-8 pt-6 pb-6 flex flex-col justify-start overflow-y-auto custom-scrollbar">
                                            {recognitions[currentPage].link ? (
                                                <a href={recognitions[currentPage].link} target="_blank" rel="noopener noreferrer" className="text-accent font-bold text-lg font-heading mb-2 text-center hover:underline inline-flex items-center justify-center gap-1 mx-auto w-full">
                                                    {recognitions[currentPage].title}
                                                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                                                </a>
                                            ) : (
                                                <h4 className="text-accent font-bold text-lg font-heading mb-2 text-center">{recognitions[currentPage].title}</h4>
                                            )}
                                            <div className="flex-1 flex flex-col justify-center mb-4">
                                                <p className="text-textMuted text-sm leading-relaxed text-center">{recognitions[currentPage].caption || "Recognized for driving breakthrough digital initiatives and operational excellence."}</p>
                                            </div>
                                            <p className="text-textMuted italic text-xs font-mono tracking-wide text-left">{recognitions[currentPage].date}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Page Side */}
                        {!isMobile && (
                            <div className="w-1/2 h-full relative z-10" style={{ transformStyle: 'preserve-3d' }}>
                                <AnimatePresence initial={false} custom={direction}>
                                    {recognitions[currentPage + 1] && (
                                        <motion.div
                                            key={`right-${currentPage + 1}`}
                                            custom={direction}
                                            variants={rightVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="absolute inset-0 origin-left flex flex-col bg-surface shadow-[inset_10px_0_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)] bg-gradient-to-l from-surface to-surface/95"
                                            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                                        >
                                            <div className="h-1/2 w-full overflow-hidden relative group p-6 pb-2">
                                                <div className="w-full h-full rounded-xl overflow-hidden relative border border-borderBase/50">
                                                    <img
                                                        src={recognitions[currentPage + 1].image}
                                                        alt={recognitions[currentPage + 1].title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-accent/20 mix-blend-overlay"></div>
                                                </div>
                                            </div>
                                            <div className="h-1/2 px-8 pt-6 pb-6 flex flex-col justify-start overflow-y-auto custom-scrollbar">
                                                {recognitions[currentPage + 1].link ? (
                                                    <a href={recognitions[currentPage + 1].link} target="_blank" rel="noopener noreferrer" className="text-accent font-bold text-lg font-heading mb-2 text-center hover:underline inline-flex items-center justify-center gap-1 mx-auto w-full">
                                                        {recognitions[currentPage + 1].title}
                                                        <ArrowUpRight className="w-4 h-4 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <h4 className="text-accent font-bold text-lg font-heading mb-2 text-center">{recognitions[currentPage + 1].title}</h4>
                                                )}
                                                <div className="flex-1 flex flex-col justify-center mb-4">
                                                    <p className="text-textMuted text-sm leading-relaxed text-center">{recognitions[currentPage + 1].caption || "Recognized for driving breakthrough digital initiatives and operational excellence."}</p>
                                                </div>
                                                <p className="text-textMuted italic text-xs font-mono tracking-wide text-left">{recognitions[currentPage + 1].date}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Middle Book Crease Binding (Visible only on Desktop) */}
                        {!isMobile && (
                            <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-borderBase/20 to-transparent pointer-events-none z-20 flex justify-center items-center">
                                <div className="w-[1px] h-full bg-borderBase/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Animated Navigation Controls */}
                <div className="flex items-center justify-center gap-8 mt-12">
                    <motion.button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-4 rounded-full border ${currentPage === 0 ? 'border-borderBase/50 text-textMuted/50 cursor-not-allowed opacity-50' : 'border-accent text-accent hover:bg-accent hover:text-background shadow-[0_0_15px_var(--accent-glow)] animate-pulse-border'} transition-all`}
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <div className="text-textMuted font-medium font-mono tracking-widest">
                        PAGE {currentViewIndex + 1} / {totalPages}
                    </div>

                    <motion.button
                        onClick={nextPage}
                        disabled={currentPage + itemsPerPage >= recognitions.length}
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-4 rounded-full border ${currentPage + itemsPerPage >= recognitions.length ? 'border-borderBase/50 text-textMuted/50 cursor-not-allowed opacity-50' : 'border-accent text-accent hover:bg-accent hover:text-background shadow-[0_0_15px_var(--accent-glow)] animate-pulse-border'} transition-all`}
                        aria-label="Next Page"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Approved Testimonies Grid */}
                {approvedTestimonies.length > 0 && (
                    <div className="mt-24 w-full">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-black font-heading tracking-tight mb-4 flex items-center justify-center gap-3">
                                <MessageSquareQuote className="w-6 h-6 text-accent" />
                                Words from <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#0284c7] dark:to-white text-glow">Collaborators.</span>
                            </h3>
                        </div>
                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {approvedTestimonies.slice(currentTestimonyPage * 2, (currentTestimonyPage * 2) + 2).map((testimony, index) => (
                                    <motion.div
                                        key={testimony.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="bg-surface/30 backdrop-blur-md border border-borderBase p-8 rounded-2xl relative group hover:border-accent/50 transition-colors duration-300 flex flex-col"
                                    >
                                        <MessageSquareQuote className="absolute top-6 right-6 w-8 h-8 text-accent/20 group-hover:text-accent/40 transition-colors" />
                                        
                                        {/* Recommender Details - Swapped to top */}
                                        <div className="flex items-start gap-4 mb-6 border-b border-borderBase/50 pb-6 pr-10">
                                            {testimony.image && (
                                                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-borderBase/50">
                                                    <img src={testimony.image} alt={testimony.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-textMain text-lg">{testimony.name}</h4>
                                                <p className="text-textMain font-bold text-sm font-mono mt-1 mb-1">{testimony.company} • {testimony.relation}</p>
                                                {testimony.position && <p className="text-textMuted text-xs mt-1">{testimony.position}</p>}
                                            </div>
                                        </div>

                                        {/* Testimony Comment - Swapped to bottom */}
                                        <div className="flex flex-col flex-1">
                                            <p className="text-textMuted leading-relaxed relative z-10 italic flex-1 text-sm md:text-base">&quot;{testimony.comment}&quot;</p>
                                            
                                            {testimony.showSource && testimony.source && (
                                                <div className="mt-2">
                                                    <span className="text-textMuted text-[10px] uppercase tracking-widest font-bold">
                                                        SOURCE: {testimony.source}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {approvedTestimonies.length > 2 && (
                                <div className="flex items-center justify-center gap-8 mt-12">
                                    <motion.button
                                        onClick={() => setCurrentTestimonyPage(Math.max(0, currentTestimonyPage - 1))}
                                        disabled={currentTestimonyPage === 0}
                                        whileHover={{ scale: 1.1, x: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-4 rounded-full border ${currentTestimonyPage === 0 ? 'border-borderBase/50 text-textMuted/50 cursor-not-allowed opacity-50' : 'border-accent text-accent hover:bg-accent/10 shadow-[0_0_15px_var(--accent-glow)]'} transition-all`}
                                        aria-label="Previous Testimonies"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </motion.button>

                                    <div className="text-textMuted font-medium font-mono tracking-widest text-sm">
                                        {(currentTestimonyPage * 2) + 1} - {Math.min((currentTestimonyPage + 1) * 2, approvedTestimonies.length)} OF {approvedTestimonies.length}
                                    </div>

                                    <motion.button
                                        onClick={() => setCurrentTestimonyPage(Math.min(Math.ceil(approvedTestimonies.length / 2) - 1, currentTestimonyPage + 1))}
                                        disabled={(currentTestimonyPage + 1) * 2 >= approvedTestimonies.length}
                                        whileHover={{ scale: 1.1, x: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-4 rounded-full border ${(currentTestimonyPage + 1) * 2 >= approvedTestimonies.length ? 'border-borderBase/50 text-textMuted/50 cursor-not-allowed opacity-50' : 'border-accent text-accent hover:bg-accent/10 shadow-[0_0_15px_var(--accent-glow)]'} transition-all`}
                                        aria-label="Next Testimonies"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Testimony Trigger Link */}
                <div className="mt-16 text-center relative z-20">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 group text-accent font-bold tracking-wide hover:opacity-80 transition-opacity duration-300"
                    >
                        <span>Collaborated with Rakesh? Share your endorsement.</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>

                {/* Skills Certificates Slider */}
                {certificates.length > 0 && (
                    <div className="mt-20 w-full text-center relative z-20">
                        <h3 className="text-3xl font-black font-heading tracking-tight mb-6 flex items-center justify-center gap-3">
                            <FileBadge className="w-6 h-6 text-accent" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#0284c7] dark:to-white text-glow">Certificates.</span>
                        </h3>

                        {/* Outer wrapper: arrows sit outside slider, flex row */}
                        <div className="flex items-center justify-center gap-4">
                            {/* Left Arrow — outside slides */}
                            <button
                                onClick={prevCert}
                                className="flex-shrink-0 w-9 h-9 rounded-full border border-accent text-accent shadow-[0_0_12px_var(--accent-glow)] hover:bg-accent hover:text-background transition-all duration-300 flex items-center justify-center z-20"
                                aria-label="Previous Certificate"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div
                                className="cascade-slider_container flex-1"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={handleMouseLeaveSlider}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
                            >
                                <div className="cascade-slider_slides">
                                    {certificates.map((cert, index) => {
                                        const len = certificates.length;
                                        let positionClass = '';

                                        if (index === activeCertIndex) positionClass = 'now';
                                        else if (index === (activeCertIndex + 1) % len) positionClass = 'next';
                                        else if (index === (activeCertIndex - 1 + len) % len) positionClass = 'prev';
                                        else if (len >= 5 && index === (activeCertIndex + 2) % len) positionClass = 'next2';
                                        else if (len >= 5 && index === (activeCertIndex - 2 + len) % len) positionClass = 'prev2';

                                        return (
                                            <div
                                                key={cert.id}
                                                className={`cascade-slider_item ${positionClass}`}
                                                onClick={() => index !== activeCertIndex && setActiveCertIndex(index)}
                                                style={{ cursor: index !== activeCertIndex ? 'pointer' : 'default' }}
                                            >
                                                <div className="bg-surface/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-borderBase/50 group flex flex-col items-center">
                                                    <img
                                                        src={cert.image}
                                                        alt={cert.title}
                                                        draggable={false}
                                                        className="w-full h-auto rounded-xl shadow-inner group-hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300 object-contain"
                                                    />
                                                    {/* Title tooltip (visible on hover OR when active) */}
                                                    <div className={`mt-4 transition-opacity duration-300 absolute -bottom-12 whitespace-nowrap bg-background/90 px-4 py-2 rounded-lg border border-borderBase/50 shadow-lg z-50 ${index === activeCertIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <p className="font-bold text-sm text-textMain">{cert.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Dot nav */}
                                <div className="cascade-slider_nav">
                                    {certificates.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveCertIndex(index)}
                                            className={`cascade-slider_dot ${index === activeCertIndex ? 'cur bg-accent shadow-[0_0_10px_var(--accent-glow)]' : 'border border-black/30 dark:border-white/30 bg-black/5 dark:bg-white/5 hover:border-accent hover:bg-accent/20'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right Arrow — outside slides */}
                            <button
                                onClick={nextCert}
                                className="flex-shrink-0 w-9 h-9 rounded-full border border-accent text-accent shadow-[0_0_12px_var(--accent-glow)] hover:bg-accent hover:text-background transition-all duration-300 flex items-center justify-center z-20"
                                aria-label="Next Certificate"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Testimony Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-surface/90 backdrop-blur-xl border border-borderBase p-8 rounded-3xl shadow-2xl overflow-hidden z-10"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-textMuted hover:text-accent transition-colors z-20"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-8 relative z-20">
                                <h3 className="text-3xl font-black font-heading tracking-tight mb-2">
                                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Testimony.</span>
                                </h3>
                                <p className="text-textMuted">Share your experience of working together.</p>
                            </div>

                            <form onSubmit={handleTestimonySubmit} className="space-y-6 relative z-20">
                                {/* Subtle focus glow */}
                                <div className={`absolute inset-0 bg-accent/5 transition-opacity duration-500 ${focusedField ? 'opacity-100' : 'opacity-0'} blur-2xl pointer-events-none -z-10`} />

                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="modal-name"
                                        value={modalData.name}
                                        onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Your Name"
                                        className="w-full bg-transparent border-b-2 border-borderBase px-4 py-3 text-textMain outline-none transition-colors duration-300 focus:border-accent peer placeholder-transparent"
                                    />
                                    <label htmlFor="modal-name" className="absolute left-4 top-3 text-textMuted transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent peer-focus:text-glow peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs font-medium cursor-text">
                                        Your Name
                                    </label>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="modal-company"
                                        value={modalData.company}
                                        onChange={(e) => setModalData({ ...modalData, company: e.target.value })}
                                        onFocus={() => setFocusedField('company')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Company / Organization"
                                        className="w-full bg-transparent border-b-2 border-borderBase px-4 py-3 text-textMain outline-none transition-colors duration-300 focus:border-accent peer placeholder-transparent"
                                    />
                                    <label htmlFor="modal-company" className="absolute left-4 top-3 text-textMuted transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent peer-focus:text-glow peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs font-medium cursor-text">
                                        Company / Organization
                                    </label>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="modal-relation"
                                        value={modalData.relation}
                                        onChange={(e) => setModalData({ ...modalData, relation: e.target.value })}
                                        onFocus={() => setFocusedField('relation')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Relationship (e.g. Client, Colleague)"
                                        className="w-full bg-transparent border-b-2 border-borderBase px-4 py-3 text-textMain outline-none transition-colors duration-300 focus:border-accent peer placeholder-transparent"
                                    />
                                    <label htmlFor="modal-relation" className="absolute left-4 top-3 text-textMuted transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent peer-focus:text-glow peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs font-medium cursor-text">
                                        Relationship (e.g. Client, Colleague)
                                    </label>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="modal-position"
                                        value={modalData.position}
                                        onChange={(e) => setModalData({ ...modalData, position: e.target.value })}
                                        onFocus={() => setFocusedField('position')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Position at the Time"
                                        className="w-full bg-transparent border-b-2 border-borderBase px-4 py-3 text-textMain outline-none transition-colors duration-300 focus:border-accent peer placeholder-transparent"
                                    />
                                    <label htmlFor="modal-position" className="absolute left-4 top-3 text-textMuted transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent peer-focus:text-glow peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs font-medium cursor-text">
                                        Position at the Time
                                    </label>
                                </div>

                                <div className="relative group pt-4">
                                    <textarea
                                        id="modal-comment"
                                        value={modalData.comment}
                                        onChange={(e) => setModalData({ ...modalData, comment: e.target.value })}
                                        onFocus={() => setFocusedField('comment')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Your Testimony"
                                        rows="4"
                                        className="w-full bg-transparent border-b-2 border-borderBase px-4 py-3 text-textMain outline-none transition-colors duration-300 focus:border-accent peer placeholder-transparent resize-none"
                                    />
                                    <label htmlFor="modal-comment" className="absolute left-4 top-7 text-textMuted transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent peer-focus:text-glow peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs font-medium cursor-text">
                                        Your Testimony
                                    </label>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    className={`w-full bg-surface border border-borderBase text-textMain py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 group transition-all duration-300 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:border-accent hover:text-accent'}`}
                                >
                                    {isSubmitting ? (
                                        <><span>Submitting...</span><Loader2 className="w-5 h-5 animate-spin" /></>
                                    ) : (
                                        <><span>Submit Testimony</span><Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
