import { useState, useEffect, useRef } from 'react';

const sections = [
    { id: 'home', label: 'INTRO // Lv-01' },
    { id: 'journey', label: 'JOURNEY // Lv-02' },
    { id: 'impact', label: 'IMPACT // Lv-03' },
    { id: 'recognition', label: 'RECOGNITION // Lv-04' },
    { id: 'contact', label: 'CONTACT // Lv-05' }
];

export default function DepthGauge() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollDepthVH, setScrollDepthVH] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [sectionPositions, setSectionPositions] = useState([]);
    const trackRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            const progress = height > 0 ? (winScroll / height) * 100 : 0;
            setScrollProgress(progress);

            const vh = window.innerHeight;
            const depthInVH = vh > 0 ? Math.round((winScroll / vh) * 100) : 0;
            setScrollDepthVH(depthInVH);

            // Calculate relative scroll positions for each section
            if (height > 0) {
                const positions = sections.map(sec => {
                    const el = document.getElementById(sec.id);
                    if (!el) return 0;
                    const rect = el.getBoundingClientRect();
                    const absoluteTop = winScroll + rect.top;
                    return Math.max(0, Math.min(100, (absoluteTop / height) * 100));
                });
                setSectionPositions(positions);
            }

            let current = 0;
            let minDistance = Infinity;

            sections.forEach((sec, idx) => {
                const el = document.getElementById(sec.id);
                if (sec.id === 'home' && !el) {
                    const distance = Math.abs(0 - winScroll);
                    if (distance < minDistance) {
                        minDistance = distance;
                        current = idx;
                    }
                    return;
                }
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const elCenter = rect.top + rect.height / 2;
                    const viewCenter = window.innerHeight / 2;
                    const distance = Math.abs(elCenter - viewCenter);

                    if (distance < minDistance) {
                        minDistance = distance;
                        current = idx;
                    }
                }
            });
            setActiveIndex(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        // Initial check on mount
        setTimeout(handleScroll, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const handlePointerDown = (e) => {
        e.preventDefault();

        const handlePointerMove = (moveEvent) => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const y = Math.max(0, Math.min(moveEvent.clientY - rect.top, rect.height));
            const percentage = y / rect.height;

            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            window.scrollTo({
                top: percentage * height,
                behavior: 'auto'
            });
        };

        const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        handlePointerMove(e);
    };

    const activeSection = sections[activeIndex] || sections[0];

    const scrollToSection = (id) => {
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed right-0 top-0 bottom-0 h-full w-12 md:w-20 border-l border-borderBase z-50 flex flex-col items-center justify-between py-12 bg-surface backdrop-blur-md">

            <div className="font-mono text-accent text-[10px] md:text-xs font-bold [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest whitespace-nowrap overflow-hidden">
                {activeSection.label}
            </div>

            {/* Draggable Track Container */}
            <div
                ref={trackRef}
                className="relative flex-1 w-full flex flex-col items-center justify-center my-8 py-4 cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown}
            >
                {/* Visible Track Line */}
                <div className="absolute top-0 bottom-0 w-[1px] bg-black/20 dark:bg-white/20 pointer-events-none left-1/2 -translate-x-1/2"></div>

                {/* Highlight line mapping from top to the active node */}
                <div
                    className="absolute top-0 w-[2px] bg-accent pointer-events-none left-1/2 -translate-x-1/2 transition-none"
                    style={{ height: `${scrollProgress}%` }}
                ></div>

                {/* Moving Indicator */}
                <div
                    className="w-3 h-3 md:w-4 md:h-4 bg-accent absolute rounded-full shadow-[0_0_15px_var(--accent-glow)] z-20 pointer-events-none left-1/2 transition-none"
                    style={{ top: `${scrollProgress}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className="absolute inset-0 bg-white/40 rounded-full animate-ping pointer-events-none"></div>
                </div>

                {/* Interactive Dots Container */}
                <div className="absolute inset-0 pointer-events-none">
                    {sections.map((sec, idx) => {
                        const pos = sectionPositions[idx] !== undefined ? sectionPositions[idx] : (idx / Math.max(1, sections.length - 1)) * 100;
                        const isPast = scrollProgress >= pos - 2;
                        return (
                            <button
                                key={sec.id}
                                onClick={(e) => { e.stopPropagation(); scrollToSection(sec.id); }}
                                style={{ top: `${pos}%`, transform: 'translate(-50%, -50%)' }}
                                className={`absolute left-1/2 z-10 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 pointer-events-auto ${activeIndex === idx
                                        ? 'bg-transparent scale-150'
                                        : (isPast ? 'bg-accent/80' : 'bg-black/30 dark:bg-white/30 hover:bg-accent hover:scale-125')
                                    }`}
                                aria-label={`Scroll to ${sec.label}`}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col items-center">
                <span className="font-mono text-[8px] md:text-[10px] text-textMuted mb-1 uppercase">Depth</span>
                <span className="font-mono text-xs md:text-sm font-bold text-accent">{scrollDepthVH}vh</span>
            </div>
        </nav>
    );
}
