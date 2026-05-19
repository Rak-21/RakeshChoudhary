import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2, ArrowRight } from 'lucide-react';
import { authenticateUser } from '../store/dataStore';

// eslint-disable-next-line react/prop-types
export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Simulated network delay for effect
            await new Promise(resolve => setTimeout(resolve, 800));

            const isValid = await authenticateUser(username, password);

            if (isValid) {
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else {
                setError('Invalid credentials. Access Denied.');
                setPassword('');
            }
        } catch (error) {
            console.error(error);
            setError('System error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/90 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-surface/90 backdrop-blur-xl border border-borderBase p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10"
                    >
                        {/* High-tech accent glows */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[50px] pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-textMuted hover:text-accent transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-8 relative z-20 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-6 shadow-[0_0_15px_var(--accent-glow)]">
                                <Lock className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="text-3xl font-black font-heading tracking-tight mb-2">
                                Restricted <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Access.</span>
                            </h3>
                            <p className="text-textMuted text-sm">Enter security credentials to access the Private Dashboard.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 relative z-20">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-sm text-center font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="relative group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full bg-transparent border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(14,165,233,0.15)] placeholder-textMuted"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Security Key"
                                    className="w-full bg-transparent border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(14,165,233,0.15)] placeholder-textMuted"
                                    required
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading || !username || !password}
                                whileHover={{ scale: (isLoading || !username || !password) ? 1 : 1.02 }}
                                whileTap={{ scale: (isLoading || !username || !password) ? 1 : 0.98 }}
                                className={`w-full bg-accent text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 group transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.4)] ${isLoading || !username || !password ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]'}`}
                            >
                                {isLoading ? (
                                    <><span>Authenticating...</span><Loader2 className="w-5 h-5 animate-spin" /></>
                                ) : (
                                    <><span>Authorize</span><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
