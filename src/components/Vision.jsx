import { motion } from 'framer-motion';

export default function Vision() {
    return (
        <section id="impact" className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden w-full">
            {/* Background Soft Moving Lines */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-[spin_60s_linear_infinite]" />

                {/* Soft glowing gradient core */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-accent/20 rounded-full blur-[150px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="container mx-auto px-6 z-10 max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-6xl font-black font-heading tracking-tight leading-tight mb-8">
                        The Next Layer is <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#00f2fe] to-accent text-glow">Intelligence.</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-textMuted font-light leading-relaxed max-w-3xl mx-auto mb-16">
                        My ambition is to shape the infrastructure of Industry 4.0. Transforming raw operations through <strong className="text-textMain font-semibold">AI Systems</strong>, building resilient <strong className="text-textMain font-semibold">Digital Infrastructure</strong>, and harnessing <strong className="text-textMain font-semibold">Emerging Tech</strong> to create autonomous, highly optimized industrial ecosystems.
                    </p>
                </motion.div>

                {/* Future metrics / abstracts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
                    {['AI Systems', 'Emerging Tech', 'Industry 4.0'].map((item, index) => (
                        <motion.div
                            key={item}
                            className="glass p-8 rounded-2xl border border-borderBase hover:border-accent/50 transition-colors group relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.2 + (index * 0.2) }}
                        >
                            <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                            <div className="relative z-10">
                                <span className="text-accent text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity absolute -top-4 -right-2">0{index + 1}</span>
                                <h3 className="text-xl font-bold font-heading mt-4 group-hover:text-accent transition-colors">{item}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
