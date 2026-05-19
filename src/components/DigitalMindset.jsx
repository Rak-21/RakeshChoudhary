import { motion } from 'framer-motion';
import { Database, TrendingUp, Cpu, Workflow, BarChart3, Settings } from 'lucide-react';

const skills = [
    { name: 'Digital Strategy', icon: <TrendingUp size={24} />, delay: 0 },
    { name: 'Automation', icon: <Settings size={24} />, delay: 0.1 },
    { name: 'AI & Data Thinking', icon: <Database size={24} />, delay: 0.2 },
    { name: 'System Architecture', icon: <Cpu size={24} />, delay: 0.3 },
    { name: 'Process Intelligence', icon: <Workflow size={24} />, delay: 0.4 },
    { name: 'Tech Integration', icon: <BarChart3 size={24} />, delay: 0.5 },
];

export default function DigitalMindset() {
    return (
        <section className="relative min-h-screen py-32 overflow-hidden w-full">


            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-glow">
                        Obsessed with Digital. <span className="text-accent">Driven by AI.</span>
                    </h2>
                </motion.div>

                {/* Skill Clusters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.name}
                            className="relative group bg-surface/50 backdrop-blur-sm border border-borderBase p-8 rounded-2xl cursor-default overflow-hidden"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: skill.delay }}
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* Background Glow on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md" />

                            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <div className="p-4 bg-accent/10 text-accent rounded-full border border-accent/20 group-hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300 group-hover:scale-110">
                                    {skill.icon}
                                </div>
                                <h3 className="text-xl font-bold tracking-wide">{skill.name}</h3>
                                <div className="w-10 h-1 bg-accent/30 rounded-full group-hover:w-full transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
