import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollLine() {
    const { scrollYProgress } = useScroll();

    // The line represents 'Drilling Deeper into Layers of Growth'
    // Starts short, grows full length, changes color/glow as it descends.
    const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);

    return (
        <div className="absolute top-0 bottom-0 left-4 md:left-12 w-[2px] z-0 pointer-events-none flex flex-col items-center">
            {/* Background track line */}
            <div className="absolute top-0 bottom-0 w-full bg-borderBase/30"></div>

            {/* Active driller line */}
            <motion.div
                className="absolute top-0 w-full bg-accent shadow-[0_0_15px_var(--accent)] rounded-full"
                style={{ height, opacity }}
            />

            {/* The Drill Head / Node at the bottom of the active line */}
            <motion.div
                className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_20px_var(--accent),0_0_40px_rgba(255,255,255,0.8)] -ml-[5px]"
                style={{ top: height, opacity }}
            />
        </div>
    );
}
