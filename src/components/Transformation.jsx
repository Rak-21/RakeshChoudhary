import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const timelineSteps = [
    {
        phase: 'Mining Operations',
        period: 'The Foundation',
        desc: 'Led ground-level operational mechanics and navigated the complexity of massive-scale extraction and safety.',
        align: 'left'
    },
    {
        phase: 'Project Management',
        period: 'The Bridge',
        desc: 'Coordinated execution, aligning engineering realities with strategic timelines and resource constraints.',
        align: 'right'
    },
    {
        phase: 'Digital Transformation',
        period: 'The Evolution',
        desc: 'Driving process optimization, system architecture, and intelligent technology adoption at scale.',
        align: 'left'
    }
];

export default function Transformation() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });

    // Parallax background subtly moving up
    const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    return (
        <section id="projects" ref={containerRef} className="relative min-h-[120vh] w-full flex flex-col items-center justify-center py-32 overflow-hidden">
            {/* Background Parallax Layer */}
            <motion.div
                className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--surface)_0%,_transparent_80%)] opacity-30 pointer-events-none"
                style={{ y: yBg }}
            />

            <div className="container mx-auto px-6 z-10 max-w-5xl">
                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                        From Extraction to <span className="text-accent text-glow">Innovation.</span>
                    </h2>
                    <p className="text-textMuted text-lg max-w-2xl mx-auto">
                        A continuous progression from mastering the physical core to architecting the digital frontier.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative wrap overflow-hidden p-10 h-full">
                    {/* Vertical line through the middle (Timeline specific) */}
                    <div className="absolute border-opacity-20 border-accent h-full border-l-2 left-1/2 -translate-x-1/2 hidden md:block" />

                    {timelineSteps.map((step, index) => (
                        <div key={step.phase} className={`mb-16 md:mb-8 flex justify-between items-center w-full ${step.align === 'left' ? 'md:flex-row-reverse left-timeline' : 'md:flex-row right-timeline'}`}>

                            <div className="hidden md:block w-5/12" />

                            <div className="z-20 flex items-center order-1 bg-accent shadow-[0_0_20px_var(--accent-glow)] w-6 h-6 rounded-full absolute left-4 md:left-1/2 md:-translate-x-1/2">
                                <motion.div
                                    className="w-full h-full rounded-full bg-white opacity-40"
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                                />
                            </div>

                            <motion.div
                                className="order-1 glass rounded-xl shadow-xl w-full md:w-5/12 px-8 py-8 ml-10 md:ml-0 relative group hover:border-accent/50 transition-colors"
                                initial={{ opacity: 0, x: step.align === 'left' ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex flex-col gap-2">
                                    <span className="text-accent text-sm font-mono tracking-widest uppercase">{step.period}</span>
                                    <h3 className="font-bold text-2xl group-hover:text-glow transition-all">{step.phase}</h3>
                                    <p className="text-textMuted mt-2">{step.desc}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
