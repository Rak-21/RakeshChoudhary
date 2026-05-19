import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';

import { getBlogs } from '../store/dataStore';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const data = await getBlogs();
            setBlogs(data);
        };
        fetchBlogs();
    }, []);
    return (
        <section id="blogs" className="hidden relative min-h-screen flex flex-col items-center justify-center py-24 w-full overflow-hidden">
            {/* Background glowing elements */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] z-0 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        className="text-left max-w-2xl"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium tracking-wide shadow-[0_0_15px_var(--accent-glow)] mb-6">
                            <BookOpen className="w-4 h-4" />
                            <span>Thoughts & Perspectives</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-6">
                            Insights from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Frontlines.</span>
                        </h2>
                        <p className="text-textMuted text-lg leading-relaxed">
                            Exploring the intersection of heavy industry, strategic digital transformation, and the future of work.
                        </p>
                    </motion.div>

                    <motion.a
                        href="#"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 group px-6 py-3 rounded-full border border-borderBase hover:border-accent text-textMain hover:text-accent transition-all duration-300"
                    >
                        <span className="font-semibold tracking-wide">View all articles</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.a>
                </div>

                {/* Stacking Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.article
                            key={blog.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative flex flex-col bg-surface/30 backdrop-blur-md border border-borderBase rounded-2xl overflow-hidden hover:border-accent/50 transition-colors duration-500"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent opacity-80" />

                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-accent/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <div className="relative p-6 flex-1 flex flex-col justify-between -mt-10 bg-gradient-to-b from-transparent to-surface">
                                <div>
                                    <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-accent mb-4">
                                        <span>{blog.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-accent/50"></span>
                                        <span>{blog.readTime}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading text-textMain leading-tight mb-6 group-hover:text-accent transition-colors duration-300">
                                        <a href={blog.link} className="absolute inset-0 z-10" aria-label={`Read ${blog.title}`}></a>
                                        {blog.title}
                                    </h3>
                                </div>
                                <div className="flex items-center text-sm font-semibold text-textMuted group-hover:text-accent transition-colors mt-auto">
                                    <span>Read Article</span>
                                    <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
