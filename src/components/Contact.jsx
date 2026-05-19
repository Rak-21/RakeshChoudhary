import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Lock, Mail, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { saveMessage, incrementVisitorCount } from '../store/dataStore';

export default function Contact() {
    const [focusedField, setFocusedField] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visitorCount, setVisitorCount] = useState(104);

    useEffect(() => {
        let mounted = true;
        const initVisitor = async () => {
            const count = await incrementVisitorCount();
            if (mounted) {
                setVisitorCount(count);
            }
        };
        initVisitor();
        return () => { mounted = false; };
    }, []);

    // EmailJS credentials
    const EMAILJS_SERVICE_ID = 'service_a74zx08';
    const EMAILJS_TEMPLATE_ID = 'template_hq84qoh';
    const EMAILJS_PUBLIC_KEY = 'hUA91NFLbCdZOLbp2';

    const YOUR_PHONE_NUMBER = "919905233179";

    const handleEmail = async () => {
        if (!formData.name || !formData.email || !formData.message) {
            alert("Please fill in all fields before sending.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Save to Firebase (non-blocking)
            try {
                await saveMessage({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                });
            } catch (fbError) {
                console.warn("Firebase save warning (non-fatal):", fbError);
            }

            // 2. Send via EmailJS
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                },
                EMAILJS_PUBLIC_KEY
            );

            alert("Message sent successfully! I'll get back to you soon.");
            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            console.error("EmailJS error:", error);
            alert(`Failed to send message: ${error?.text || error?.message || 'Unknown error'}. Please email directly at rrakesh.cho@outlook.com`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsApp = () => {
        if (!formData.name || !formData.message) {
            alert("Please provide your name and message to connect via WhatsApp.");
            return;
        }
        const text = encodeURIComponent(`Hi Rakesh! I am ${formData.name}. ${formData.email ? `My email is ${formData.email}. ` : ''}\n\n${formData.message}`);
        window.open(`https://wa.me/${YOUR_PHONE_NUMBER}?text=${text}`, '_blank');
    };

    return (
        <section id="contact" className="relative min-h-[90vh] flex flex-col items-center justify-center py-24 w-full overflow-hidden">
            {/* Background Neural Network Pattern base */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+Cjxwb2x5Z29uIHBvaW50cz0iMjAsMCA0MCwyMCAyMCw0MCAwLDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwZWE1ZTkzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-10 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10 flex flex-col items-center">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#00f2fe] filter drop-shadow-[0_0_15px_var(--accent-glow)]">
                        Transformation Starts with Conversation
                    </h2>
                    <p className="text-textMuted text-lg max-w-xl mx-auto font-medium leading-relaxed">
                        Great transformation begins with clear thinking, shared vision, and the willingness to challenge conventional approaches.
                    </p>
                </motion.div>

                <motion.form
                    className="w-full max-w-2xl bg-surface backdrop-blur-xl border border-borderBase p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Subtle animated background glow tied to focus */}
                    <div
                        className={`absolute inset-0 bg-accent/5 transition-opacity duration-500 ${focusedField ? 'opacity-100' : 'opacity-0'} blur-2xl pointer-events-none`}
                    />

                    <div className="relative z-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div className="relative group pt-2">
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full bg-transparent border-b-2 border-borderBase px-4 py-3 text-textMain outline-none transition-colors duration-300 focus:border-accent"
                                />
                                <label
                                    htmlFor="name"
                                    className={`absolute left-4 transition-all duration-300 font-medium cursor-text pointer-events-none ${focusedField === 'name' || formData.name ? '-top-3 text-xs text-accent text-glow' : 'top-5 text-textMuted text-base'}`}
                                >
                                    Your Name
                                </label>
                            </div>

                            {/* Email Field */}
                            <div className="relative group pt-2">
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full bg-transparent border-b-2 px-4 py-3 text-textMain outline-none transition-colors duration-300 ${formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && focusedField !== 'email' ? 'border-red-500 focus:border-red-500' : 'border-borderBase focus:border-accent'}`}
                                />
                                <label
                                    htmlFor="email"
                                    className={`absolute left-4 transition-all duration-300 font-medium cursor-text pointer-events-none ${focusedField === 'email' || formData.email ? `-top-3 text-xs ${formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && focusedField !== 'email' ? 'text-red-500' : 'text-accent text-glow'}` : 'top-5 text-textMuted text-base'}`}
                                >
                                    Your Email
                                </label>
                                {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && focusedField !== 'email' && (
                                    <span className="absolute -bottom-5 left-4 text-xs text-red-500 font-medium animate-pulse">
                                        Please enter a valid email address
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Message Field */}
                        <div className="relative group pt-4">
                            <textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows="4"
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b-2 border-borderBase px-4 py-3 text-textMain outline-none transition-colors duration-300 focus:border-accent resize-none mt-2"
                            />
                            <label
                                htmlFor="message"
                                className={`absolute left-4 transition-all duration-300 font-medium cursor-text pointer-events-none ${focusedField === 'message' || formData.message ? '-top-1 text-xs text-accent text-glow' : 'top-7 text-textMuted text-base'}`}
                            >
                                Your Message
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4">
                            <motion.button
                                onClick={handleEmail}
                                disabled={isSubmitting}
                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                className={`flex-1 bg-[#0284c7] text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(2,132,199,0.4)] hover:shadow-[0_0_25px_rgba(2,132,199,0.6)] transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                type="button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span>Transmitting...</span>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <span>Send via Email</span>
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>

                            <motion.button
                                onClick={handleWhatsApp}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(37,211,102,0.4)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] transition-all duration-300"
                                type="button"
                            >
                                <span>WhatsApp Me</span>
                                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            </motion.button>
                        </div>
                    </div>
                </motion.form>

                {/* Contact Info Row */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <a
                        href="mailto:rrakesh.cho@outlook.com"
                        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors group"
                    >
                        <span className="p-1.5 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                            <Mail className="w-3.5 h-3.5 text-accent" />
                        </span>
                        <span className="text-sm font-medium tracking-wide" style={{ textShadow: '0 0 12px var(--accent-glow)' }}>
                            rrakesh.cho@outlook.com
                        </span>
                    </a>

                    <span className="hidden sm:block text-borderBase select-none">||</span>

                    <a
                        href="tel:+919905233179"
                        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors group"
                    >
                        <span className="p-1.5 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-accent" />
                        </span>
                        <span className="text-sm font-medium tracking-wide" style={{ textShadow: '0 0 12px var(--accent-glow)' }}>
                            +91-9905233179
                        </span>
                    </a>
                </motion.div>
            </div>

            {/* Footer minimal info and Dashboard Trigger */}
            <div className="absolute bottom-6 w-full px-6 flex flex-col md:flex-row items-center justify-between text-textMuted text-xs tracking-widest font-mono">
                <div>&copy; {new Date().getFullYear()} RAKESH CHOUDHARY. ENGINEER THE FUTURE.</div>

                {/* Live Visitor Count */}
                <div className="mt-4 md:mt-0 flex items-center gap-2 text-accent font-semibold tracking-wider" style={{ textShadow: '0 0 10px var(--accent-glow)' }}>
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ boxShadow: '0 0 8px var(--accent-glow)' }}></span>
                    <span>VISITORS: {visitorCount}</span>
                </div>

                {/* Private Dashboard Access */}
                <a
                    href="/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 md:mt-0 flex items-center gap-2 hover:text-accent font-medium transition-colors duration-300 group"
                >
                    <Lock className="w-3 h-3 group-hover:drop-shadow-[0_0_5px_var(--accent-glow)]" />
                    <span>PRIVATE DASHBOARD</span>
                </a>
            </div>
        </section>
    );
}
