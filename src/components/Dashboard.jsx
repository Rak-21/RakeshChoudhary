import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkAuth, logoutUser, getBlogs, saveBlog, deleteBlog, getTestimonies, approveTestimony, unapproveTestimony, deleteTestimony, saveTestimony, getRecognitions, saveRecognition, deleteRecognition, getQuestions, saveQuestion, deleteQuestion, getCertificates, saveCertificate, deleteCertificate, authenticateUser, migrateLocalToFirebase, uploadImageToStorage, getMessages, markMessageRead, deleteMessage, saveResume, getResume, openResumeInNewTab } from '../store/dataStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, Award, Star, Plus, Trash2, CheckCircle, Clock, Lock, Loader2, ArrowRight, Sun, Moon, Palette, Edit3, EyeOff, HelpCircle, MessageSquareQuote, FileBadge, Mail, MailOpen, Inbox, FileUp, ExternalLink, FileCheck2 } from 'lucide-react';

export default function Dashboard() {

    const [isInitializing, setIsInitializing] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('blogs');
    const navigate = useNavigate();

    // Image Upload State
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleImageUpload = async (e, folder, callback) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const url = await uploadImageToStorage(file, folder);
            if (url) {
                callback(url);
            }
        } catch (error) {
            console.error("Image upload error:", error);
            alert("Failed to upload image. Please check your connection/permissions and try again.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Login State for Dashboard
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Data State
    const [blogs, setBlogs] = useState([]);
    const [testimonies, setTestimonies] = useState([]);
    const [recognitions, setRecognitions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [messages, setMessages] = useState([]);
    const [expandedMessageId, setExpandedMessageId] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [isUploadingResume, setIsUploadingResume] = useState(false);

    // Blog Editor State
    const contentTextareaRef = useRef(null);
    const [isAddingBlog, setIsAddingBlog] = useState(false);
    const [newBlog, setNewBlog] = useState({
        title: '',
        excerpt: '',
        content: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        image: '',
        readTime: '',
        link: '#'
    });

    // Recognition Editor State
    const [isAddingRecognition, setIsAddingRecognition] = useState(false);
    const [newRecognition, setNewRecognition] = useState({
        sequence: 1,
        title: '',
        caption: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        image: ''
    });

    // Quiz Editor State
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        title: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0
    });

    // Testimony Editor State
    const [isEditingTestimony, setIsEditingTestimony] = useState(false);
    const [editTestimonyData, setEditTestimonyData] = useState(null);

    // Certificate Editor State
    const [isAddingCertificate, setIsAddingCertificate] = useState(false);
    const [newCertificate, setNewCertificate] = useState({
        sequence: 1,
        title: '',
        provider: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        image: ''
    });

    // Theme State
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    // Editor Formatting Helpers
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorOptions = ['#0ea5e9', '#f97316', '#22c55e', '#ef4444', '#a855f7', '#fbbf24', '#ffffff'];

    const insertFormatting = (prefix, suffix = '') => {
        const textarea = contentTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = newBlog.content;
        const selectedText = currentText.substring(start, end);

        // If styling with HTML span (for colors) and no text is selected, add placeholder text
        let wrappedText = `${prefix}${selectedText || (suffix ? 'text' : '')}${suffix}`;

        const newText = currentText.substring(0, start) + wrappedText + currentText.substring(end);

        setNewBlog({ ...newBlog, content: newText });

        // Refocus and restore cursor position after React re-renders
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || (suffix ? 4 : 0)));
        }, 0);
    };

    const applyFormatting = (tool) => {
        switch (tool) {
            case 'B': insertFormatting('**', '**'); break;
            case 'I': insertFormatting('*', '*'); break;
            case 'U': insertFormatting('<u>', '</u>'); break;
            case 'H1': insertFormatting('# ', ''); break;
            case 'H2': insertFormatting('## ', ''); break;
            case 'H3': insertFormatting('### ', ''); break;
            case 'Link': insertFormatting('[', '](https://)'); break;
            case 'Quote': insertFormatting('> ', ''); break;
            case 'Code': insertFormatting('`', '`'); break;
            default: break;
        }
    };

    const applyColor = (colorHex) => {
        insertFormatting(`<span style="color: ${colorHex}">`, '</span>');
        setShowColorPicker(false);
    };

    useEffect(() => {
        const auth = checkAuth();
        if (auth) {
            setIsAuthenticated(true);

            const initDb = async () => {
                // If local storage keys still exist, fire the one-time migration to Firestore
                if (localStorage.getItem('rk_blogs') || localStorage.getItem('rk_testimonies') || localStorage.getItem('rk_recognitions')) {
                    await migrateLocalToFirebase();
                }
                await loadData();
            };

            initDb();
        }
        setIsInitializing(false);
    }, []);

    const loadData = async () => {
        const loadedBlogs = await getBlogs();
        setBlogs(loadedBlogs);

        const loadedTestimonies = await getTestimonies();
        setTestimonies(loadedTestimonies);

        const loadedRecognitions = await getRecognitions();
        setRecognitions(loadedRecognitions);

        const loadedQuestions = await getQuestions();
        setQuestions(loadedQuestions);

        const loadedCertificates = await getCertificates();
        setCertificates(loadedCertificates);

        const loadedMessages = await getMessages();
        setMessages(loadedMessages);

        const loadedResume = await getResume();
        setResumeData(loadedResume);
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file only.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be under 10 MB.');
            return;
        }
        setIsUploadingResume(true);
        try {
            const saved = await saveResume(file);
            setResumeData(saved);
            alert('Resume uploaded successfully!');
        } catch (error) {
            console.error('Resume upload error:', error);
            alert('Upload failed. Please check Firebase Storage rules and try again.');
        } finally {
            setIsUploadingResume(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    // --- BLOG ACTIONS ---
    const handleAddBlog = async (e) => {
        e.preventDefault();
        await saveBlog(newBlog);
        setIsAddingBlog(false);
        setNewBlog({
            title: '',
            excerpt: '',
            content: '',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            image: '',
            readTime: '',
            link: '#'
        });
        loadData();
    };

    const handleEditBlog = (blogToEdit) => {
        setNewBlog(blogToEdit);
        setIsAddingBlog(true);
    };

    const handleDeleteBlog = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            await deleteBlog(id);
            loadData();
        }
    };

    // --- TESTIMONY ACTIONS ---
    const handleApproveTestimony = async (id) => {
        await approveTestimony(id);
        loadData();
    };

    const handleUnapproveTestimony = async (id) => {
        await unapproveTestimony(id);
        loadData();
    };

    const handleDeleteTestimony = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimony?')) {
            await deleteTestimony(id);
            loadData();
        }
    };

    const handleEditTestimonyClick = (testimony) => {
        setEditTestimonyData(testimony);
        setIsEditingTestimony(true);
    };

    const handleEditTestimonySubmit = async (e) => {
        e.preventDefault();
        await saveTestimony(editTestimonyData);
        setIsEditingTestimony(false);
        setEditTestimonyData(null);
        loadData();
    };

    // --- RECOGNITION ACTIONS ---
    const handleAddRecognition = async (e) => {
        e.preventDefault();
        await saveRecognition(newRecognition);
        setIsAddingRecognition(false);
        setNewRecognition({
            sequence: recognitions.length + 2, // Next available sequence
            title: '',
            caption: '',
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            image: ''
        });
        loadData();
    };

    const handleEditRecognition = (rec) => {
        setNewRecognition(rec);
        setIsAddingRecognition(true);
    };

    const handleDeleteRecognition = async (id) => {
        if (window.confirm('Are you sure you want to delete this recognition?')) {
            await deleteRecognition(id);
            setRecognitions(recognitions.filter(r => r.docId !== id && r.id !== id));
        }
    };

    // --- CERTIFICATE ACTIONS ---
    const handleAddCertificate = async (e) => {
        e.preventDefault();
        await saveCertificate(newCertificate);
        setIsAddingCertificate(false);
        setNewCertificate({
            sequence: certificates.length + 1,
            title: '',
            provider: '',
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            image: ''
        });
        loadData();
    };

    const handleEditCertificate = (cert) => {
        setNewCertificate(cert);
        setIsAddingCertificate(true);
    };

    const handleDeleteCertificate = async (id) => {
        if (window.confirm('Are you sure you want to delete this certificate?')) {
            await deleteCertificate(id);
            loadData();
        }
    };

    // --- QUIZ ACTIONS ---
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (newQuestion.options.some(opt => !opt.trim())) {
            alert('All 4 options must be filled.');
            return;
        }
        await saveQuestion(newQuestion);
        setIsAddingQuestion(false);
        setNewQuestion({ title: '', options: ['', '', '', ''], correctOptionIndex: 0 });
        const refreshed = await getQuestions();
        setQuestions(refreshed);
    };

    const handleEditQuestion = (question) => {
        setNewQuestion(question);
        setIsAddingQuestion(true);
    };

    const handleDeleteQuestion = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            await deleteQuestion(id);
            setQuestions(questions.filter(q => q.docId !== id && q.id !== id));
        }
    };

    // --- MESSAGE ACTIONS ---
    const handleMarkRead = async (msg) => {
        if (!msg.read) {
            await markMessageRead(msg.id);
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
        }
        setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id);
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            await deleteMessage(id);
            setMessages(prev => prev.filter(m => m.id !== id));
        }
    };

    // --- RENDER HELPERS ---
    const handleDashboardLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulated delay
            const isValid = await authenticateUser(username, password);
            if (isValid) {
                setIsAuthenticated(true);
                loadData();
            } else {
                setLoginError('Invalid credentials. Access Denied.');
                setPassword('');
            }
        } catch (error) {
            console.error(error);
            setLoginError('System error. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (isInitializing) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {

        return (
            <div className="fixed inset-0 min-h-screen w-full bg-background text-textMain flex flex-col items-center justify-center font-body p-4 z-[99999] overflow-y-auto">
                <div className="absolute inset-0 bg-background/95 backdrop-blur-xl z-0" />

                {/* Decorative background elements consistent with the site theme */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full max-w-md bg-surface/90 backdrop-blur-2xl border border-borderBase p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 my-auto"
                >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-6 right-6 text-textMuted hover:text-accent transition-colors z-20 text-sm font-medium"
                    >
                        Return Home
                    </button>

                    <div className="mb-8 relative z-20 flex flex-col items-center text-center mt-6">
                        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-6 shadow-[0_0_15px_var(--accent-glow)]">
                            <Lock className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-3xl font-black font-heading tracking-tight mb-2">
                            Restricted <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Access.</span>
                        </h3>
                        <p className="text-textMuted text-sm">Enter security credentials to access the CMS Portal.</p>
                    </div>

                    <form onSubmit={handleDashboardLogin} className="space-y-6 relative z-20">
                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-sm text-center font-medium"
                            >
                                {loginError}
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
                            disabled={isLoggingIn || !username || !password}
                            whileHover={{ scale: (isLoggingIn || !username || !password) ? 1 : 1.02 }}
                            whileTap={{ scale: (isLoggingIn || !username || !password) ? 1 : 0.98 }}
                            className={`w-full bg-accent text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 group transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.4)] ${isLoggingIn || !username || !password ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]'}`}
                        >
                            {isLoggingIn ? (
                                <><span>Authenticating...</span><Loader2 className="w-5 h-5 animate-spin" /></>
                            ) : (
                                <><span>Authorize</span><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-textMain font-body selection:bg-accent/30 selection:text-accent flex">

            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-borderBase bg-surface/50 backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b border-borderBase">
                    <h2 className="text-xl font-black font-heading tracking-tight flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-accent" />
                        CMS Portal
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'blogs' ? 'bg-accent/10 border border-accent/30 text-accent shadow-[0_0_15px_var(--accent-glow)]' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}
                    >
                        <FileText className="w-5 h-5" />
                        Manage Blogs
                    </button>
                    <button
                        onClick={() => setActiveTab('testimonies')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'testimonies' ? 'bg-accent/10 border border-accent/30 text-accent shadow-[0_0_15px_var(--accent-glow)]' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}
                    >
                        <Award className="w-5 h-5" />
                        Testimonies
                        {testimonies.filter(t => !t.approved).length > 0 && (
                            <span className="ml-auto bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                                {testimonies.filter(t => !t.approved).length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('recognitions')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'recognitions' ? 'bg-accent/10 border border-accent/30 text-accent shadow-[0_0_15px_var(--accent-glow)]' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}
                    >
                        <Star className="w-5 h-5" />
                        Recognitions
                    </button>
                    <button
                        onClick={() => setActiveTab('certificates')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'certificates' ? 'bg-accent/10 border border-accent/30 text-accent shadow-[0_0_15px_var(--accent-glow)]' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}
                    >
                        <FileBadge className="w-5 h-5" />
                        Certificates
                    </button>
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'quiz' ? 'bg-accent/10 border border-accent/30 text-accent shadow-[0_0_15px_var(--accent-glow)]' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}
                    >
                        <HelpCircle className="w-5 h-5" />
                        Configure Quiz
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'messages' ? 'bg-accent/10 border border-accent/30 text-accent shadow-[0_0_15px_var(--accent-glow)]' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}
                    >
                        <Inbox className="w-5 h-5" />
                        Messages
                        {messages.filter(m => !m.read).length > 0 && (
                            <span className="ml-auto bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                                {messages.filter(m => !m.read).length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'resume' ? 'bg-accent/10 border border-accent/30 text-accent shadow-[0_0_15px_var(--accent-glow)]' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}
                    >
                        <FileUp className="w-5 h-5" />
                        Resume
                        {resumeData && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                        )}
                    </button>
                </nav>

                <div className="p-4 border-t border-borderBase">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors font-medium border border-transparent hover:border-red-500/30"
                    >
                        <LogOut className="w-5 h-5" />
                        Secure Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Subtle background glow */}
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] z-0 pointer-events-none" />

                <header className="px-8 py-6 border-b border-borderBase/50 relative z-10 bg-background/50 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex justify-between items-center">
                    <h1 className="text-3xl font-black font-heading tracking-tight capitalize">
                        {activeTab.replace('-', ' ')}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full border border-borderBase bg-surface hover:bg-surface/80 transition-colors flex items-center justify-center text-textMuted hover:text-accent group shadow-sm hover:shadow-[0_0_10px_var(--accent-glow)]"
                            aria-label="Toggle Theme"
                        >
                            <motion.div animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.5 }}>
                                {isDark ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-orange-400" />}
                            </motion.div>
                        </button>

                        {activeTab === 'blogs' && (
                            <button
                                onClick={() => {
                                    setNewBlog({
                                        title: '',
                                        excerpt: '',
                                        content: '',
                                        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                                        image: '',
                                        readTime: '',
                                        link: '#'
                                    });
                                    setIsAddingBlog(true);
                                }}
                                className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_var(--accent-glow)] transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                New Blog
                            </button>
                        )}

                        {activeTab === 'recognitions' && (
                            <button
                                onClick={() => {
                                    setNewRecognition({ sequence: recognitions.length + 1, title: '', caption: '', date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), image: '' });
                                    setIsAddingRecognition(true);
                                }}
                                className="bg-accent text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-[0_0_15px_var(--accent-glow)] transition-shadow"
                            >
                                <Plus className="w-5 h-5" />
                                Add Recognition
                            </button>
                        )}

                        {activeTab === 'quiz' && (
                            <button
                                onClick={() => {
                                    setNewQuestion({ title: '', options: ['', '', '', ''], correctOptionIndex: 0 });
                                    setIsAddingQuestion(true);
                                }}
                                className="bg-accent text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-[0_0_15px_var(--accent-glow)] transition-shadow"
                            >
                                <Plus className="w-5 h-5" />
                                Add Question
                            </button>
                        )}

                        {activeTab === 'certificates' && (
                            <button
                                onClick={() => {
                                    setNewCertificate({ sequence: certificates.length + 1, title: '', provider: '', date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), image: '' });
                                    setIsAddingCertificate(true);
                                }}
                                className="bg-accent text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-[0_0_15px_var(--accent-glow)] transition-shadow"
                            >
                                <Plus className="w-5 h-5" />
                                Add Certificate
                            </button>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'blogs' && (
                            <motion.div
                                key="blogs"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-5xl mx-auto"
                            >
                                {/* List of Blogs */}
                                <div className="grid grid-cols-1 gap-4">
                                    {blogs.map(blog => (
                                        <div key={blog.id} className="bg-surface/50 backdrop-blur-sm border border-borderBase p-4 rounded-xl flex items-center justify-between group hover:border-accent/50 transition-all duration-300">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg group-hover:text-accent transition-colors">{blog.title}</h4>
                                                    <div className="text-textMuted text-sm font-mono flex gap-3 mt-1">
                                                        <span>{blog.date}</span>
                                                        <span>•</span>
                                                        <span>{blog.readTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditBlog(blog)}
                                                    className="p-3 text-accent/70 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                                    title="Edit Blog"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBlog(blog.id)}
                                                    className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Blog"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {blogs.length === 0 && <p className="text-textMuted text-center py-8">No blogs published yet.</p>}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'testimonies' && (
                            <motion.div
                                key="testimonies"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-5xl mx-auto"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {testimonies.map(testimony => (
                                        <div key={testimony.id} className={`bg-surface/50 backdrop-blur-sm border p-6 rounded-2xl relative transition-all duration-300 ${testimony.approved ? 'border-borderBase opacity-75 grayscale-[50%]' : 'border-accent/50 shadow-[0_0_30px_rgba(14,165,233,0.1)] hover:shadow-[0_0_40px_rgba(14,165,233,0.2)]'}`}>
                                            {!testimony.approved && (
                                                <div className="absolute top-4 right-4 flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider bg-accent/10 px-3 py-1.5 rounded-full">
                                                    <Clock className="w-3 h-3" /> Pending
                                                </div>
                                            )}
                                            {testimony.approved && (
                                                <div className="absolute top-4 right-4 flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-wider bg-green-500/10 px-3 py-1.5 rounded-full">
                                                    <CheckCircle className="w-3 h-3" /> Live
                                                </div>
                                            )}

                                            <h4 className="font-bold text-xl text-textMain mt-2">{testimony.name}</h4>
                                            <p className="text-accent text-sm font-mono mb-1">{testimony.relation} • {testimony.company}</p>
                                            {testimony.position && <p className="text-textMuted text-xs mb-4">{testimony.position}</p>}
                                            <p className="text-textMain/80 italic border-l-2 border-borderBase pl-4 mb-6 leading-relaxed">&quot;{testimony.comment}&quot;</p>

                                            <div className="flex items-center gap-2 pt-4 border-t border-borderBase/50">
                                                {!testimony.approved ? (
                                                    <button
                                                        onClick={() => handleApproveTestimony(testimony.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:border-green-500 hover:text-white px-2 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Approve
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnapproveTestimony(testimony.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white px-2 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm"
                                                    >
                                                        <EyeOff className="w-4 h-4" /> Unapprove
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEditTestimonyClick(testimony)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:border-accent hover:text-white px-2 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm"
                                                >
                                                    <Edit3 className="w-4 h-4" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTestimony(testimony.id)}
                                                    className="flex-[0.5] flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white px-2 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {testimonies.length === 0 && <p className="text-textMuted text-center py-8 col-span-2">No testimonies submitted yet.</p>}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'recognitions' && (
                            <motion.div
                                key="recognitions"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-5xl mx-auto"
                            >
                                {/* List of Recognitions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recognitions.map(rec => (
                                        <div key={rec.id} className="bg-surface/50 backdrop-blur-sm border border-borderBase p-4 rounded-xl flex items-center justify-between group hover:border-accent/50 transition-all duration-300">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                                    <img src={rec.image} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg group-hover:text-accent transition-colors flex items-center gap-2">
                                                        <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-md border border-accent/20">Seq: {rec.sequence || '-'}</span>
                                                        {rec.title}
                                                    </h4>
                                                    <div className="text-textMuted text-sm font-mono flex gap-3 mt-1">
                                                        <span>{rec.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditRecognition(rec)}
                                                    className="p-3 text-accent/70 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                                    title="Edit Recognition"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRecognition(rec.id)}
                                                    className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Recognition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {recognitions.length === 0 && <p className="text-textMuted text-center py-8 col-span-2">No recognitions added yet.</p>}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'quiz' && (
                            <motion.div
                                key="quiz"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-5xl mx-auto"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {questions.map((q, index) => (
                                        <div key={q.id} className="bg-surface/50 backdrop-blur-sm border border-borderBase p-6 rounded-xl relative group hover:border-accent/50 transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-bold text-lg text-textMain flex-1 pr-4">Q{index + 1}. {q.title}</h4>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditQuestion(q)} className="p-2 text-accent/70 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {q.options.map((opt, i) => (
                                                    <div key={i} className={`px-3 py-2 rounded border text-sm flex items-center gap-2 ${q.correctOptionIndex === i ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-background/50 border-borderBase text-textMuted'}`}>
                                                        <span className="font-mono text-xs opacity-50">{['A', 'B', 'C', 'D'][i]}</span>
                                                        {opt}
                                                        {q.correctOptionIndex === i && <CheckCircle className="w-4 h-4 ml-auto" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-borderBase/50 text-xs text-textMuted font-mono text-right flex justify-between items-center">
                                                <span>Difficulty: Standard</span>
                                                <span className="bg-accent/20 text-accent px-2 py-1 rounded-md">{q.marks || 10} Points</span>
                                            </div>
                                        </div>
                                    ))}
                                    {questions.length === 0 && <p className="text-textMuted text-center py-8 col-span-2">No quiz questions configured yet.</p>}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'certificates' && (
                            <motion.div
                                key="certificates"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-5xl mx-auto"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {certificates.map((cert) => (
                                        <div key={cert.id} className="bg-surface/50 backdrop-blur-sm border border-borderBase p-4 rounded-xl relative group hover:border-accent/50 transition-all duration-300 flex flex-col">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="text-textMuted text-xs font-mono font-bold bg-background/50 px-2 py-1 rounded">SEQ: {cert.sequence}</div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditCertificate(cert)} className="p-1.5 text-accent/70 hover:text-accent hover:bg-accent/10 rounded-md transition-colors"><Edit3 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteCertificate(cert.id)} className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            {cert.image && (
                                                <div className="w-full h-32 bg-background/30 rounded-lg overflow-hidden mb-4 border border-borderBase/50 flex items-center justify-center">
                                                    <img src={cert.image} alt={cert.title} className="max-w-full max-h-full object-contain" />
                                                </div>
                                            )}
                                            <h4 className="font-bold text-textMain line-clamp-1">{cert.title}</h4>
                                            <p className="text-textMuted text-sm line-clamp-1 mt-1">{cert.provider}</p>
                                            <div className="mt-auto pt-3 border-t border-borderBase/30 text-xs text-textMuted">
                                                {cert.date}
                                            </div>
                                        </div>
                                    ))}
                                    {certificates.length === 0 && <p className="text-textMuted text-center py-8 col-span-full">No certificates added yet.</p>}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'messages' && (
                            <motion.div
                                key="messages"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4 max-w-5xl mx-auto"
                            >
                                {/* Stats Bar */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-surface/50 border border-borderBase rounded-xl p-4 text-center">
                                        <div className="text-3xl font-black text-textMain">{messages.length}</div>
                                        <div className="text-textMuted text-xs uppercase tracking-wider mt-1">Total</div>
                                    </div>
                                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-black text-accent">{messages.filter(m => !m.read).length}</div>
                                        <div className="text-textMuted text-xs uppercase tracking-wider mt-1">Unread</div>
                                    </div>
                                    <div className="bg-surface/50 border border-borderBase rounded-xl p-4 text-center">
                                        <div className="text-3xl font-black text-textMain">{messages.filter(m => m.read).length}</div>
                                        <div className="text-textMuted text-xs uppercase tracking-wider mt-1">Read</div>
                                    </div>
                                </div>

                                {/* Message List */}
                                <div className="space-y-3">
                                    {messages.map(msg => {
                                        const isExpanded = expandedMessageId === msg.id;
                                        const date = new Date(msg.timestamp);
                                        const formatted = date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`bg-surface/50 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 group ${!msg.read ? 'border-accent/40 shadow-[0_0_20px_rgba(14,165,233,0.08)]' : 'border-borderBase'}`}
                                            >
                                                {/* Message Header — click to expand/collapse */}
                                                <div
                                                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-accent/5 transition-colors"
                                                    onClick={() => handleMarkRead(msg)}
                                                >
                                                    {/* Read Indicator */}
                                                    <div className="shrink-0">
                                                        {msg.read
                                                            ? <MailOpen className="w-5 h-5 text-textMuted" />
                                                            : <Mail className="w-5 h-5 text-accent" />
                                                        }
                                                    </div>

                                                    {/* Sender Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`font-bold text-base ${!msg.read ? 'text-textMain' : 'text-textMuted'}`}>
                                                                {msg.name}
                                                            </span>
                                                            {!msg.read && (
                                                                <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
                                                            )}
                                                        </div>
                                                        <div className="text-textMuted text-xs font-mono mt-0.5 truncate">{msg.email}</div>
                                                    </div>

                                                    {/* Preview / Date */}
                                                    <div className="hidden md:block text-textMuted text-sm truncate max-w-xs opacity-70">
                                                        {isExpanded ? '' : msg.message.substring(0, 60) + (msg.message.length > 60 ? '…' : '')}
                                                    </div>

                                                    <div className="shrink-0 text-right">
                                                        <div className="text-textMuted text-xs font-mono">{formatted}</div>
                                                    </div>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                                                        className="shrink-0 p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Delete Message"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Expanded Message Body */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.25 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-5 pb-5 pt-2 border-t border-borderBase/50">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className="text-xs text-textMuted font-mono uppercase tracking-wider">From:</span>
                                                                    <a href={`mailto:${msg.email}`} className="text-accent text-sm font-medium hover:underline">{msg.email}</a>
                                                                </div>
                                                                <p className="text-textMain/90 leading-relaxed whitespace-pre-wrap bg-background/40 rounded-lg p-4 border border-borderBase/50 text-sm">
                                                                    {msg.message}
                                                                </p>
                                                                <div className="flex gap-3 mt-4">
                                                                    <a
                                                                        href={`mailto:${msg.email}?subject=Re: Your message on Portfolio`}
                                                                        className="flex items-center gap-2 bg-accent text-white text-sm font-bold px-4 py-2 rounded-lg hover:shadow-[0_0_15px_var(--accent-glow)] transition-all"
                                                                    >
                                                                        <Mail className="w-4 h-4" />
                                                                        Reply via Email
                                                                    </a>
                                                                    <button
                                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                                        className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                    {messages.length === 0 && (
                                        <div className="text-center py-20 text-textMuted">
                                            <Inbox className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                            <p className="font-medium">No messages received yet.</p>
                                            <p className="text-sm mt-1 opacity-70">Messages submitted through your Contact section will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'resume' && (
                            <motion.div
                                key="resume"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-2xl mx-auto space-y-6"
                            >
                                {/* Current Resume Status */}
                                <div className={`rounded-2xl border p-6 ${resumeData ? 'border-green-500/30 bg-green-500/5' : 'border-borderBase bg-surface/50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <FileCheck2 className={`w-6 h-6 ${resumeData ? 'text-green-400' : 'text-textMuted'}`} />
                                        <h3 className="text-lg font-bold text-textMain">Current Resume</h3>
                                        {resumeData && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Active</span>}
                                    </div>
                                    {resumeData ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-textMuted">
                                                <FileText className="w-4 h-4 shrink-0" />
                                                <span className="truncate font-mono">{resumeData.fileName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-textMuted">
                                                <Clock className="w-4 h-4 shrink-0" />
                                                <span>Uploaded: {new Date(resumeData.uploadedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-textMuted">
                                                <span className="text-xs">Size:</span>
                                                <span>{(resumeData.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <button
                                                onClick={() => openResumeInNewTab(resumeData.dataUrl)}
                                                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/20 transition-colors cursor-pointer"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Preview Resume
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-textMuted text-sm">No resume uploaded yet. Upload your PDF below to make it available on the portfolio.</p>
                                    )}
                                </div>

                                {/* Upload Panel */}
                                <div className="rounded-2xl border border-borderBase bg-surface/50 p-6">
                                    <h3 className="text-lg font-bold text-textMain mb-1">{resumeData ? 'Replace Resume' : 'Upload Resume'}</h3>
                                    <p className="text-textMuted text-sm mb-5">Upload a PDF file (max 10 MB). This will instantly update the Resume link on the navbar and the Download Resume button on the homepage.</p>

                                    <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                                        isUploadingResume
                                            ? 'border-accent/50 bg-accent/5 cursor-not-allowed'
                                            : 'border-borderBase hover:border-accent/50 hover:bg-accent/5'
                                    }`}>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={handleResumeUpload}
                                            disabled={isUploadingResume}
                                        />
                                        {isUploadingResume ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="w-10 h-10 text-accent animate-spin" />
                                                <p className="text-accent font-medium text-sm">Uploading to Firebase...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-textMuted">
                                                <FileUp className="w-10 h-10" />
                                                <p className="font-medium text-sm">Click to select PDF or drag & drop</p>
                                                <p className="text-xs opacity-60">PDF only · Max 10 MB</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Advanced Blog Editor Overlay */}
            <AnimatePresence>
                {isAddingBlog && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12">
                        {/* Editor Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingBlog(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />

                        {/* Editor Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl h-full max-h-[90vh] bg-surface/95 backdrop-blur-2xl border border-borderBase rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
                        >
                            {/* Editor Header */}
                            <div className="flex items-center justify-between px-8 py-5 border-b border-borderBase bg-background/50">
                                <h3 className="text-2xl font-black font-heading tracking-tight flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-accent" />
                                    {newBlog.id ? (
                                        <>Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Article.</span></>
                                    ) : (
                                        <>Draft New <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Article.</span></>
                                    )}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsAddingBlog(false)}
                                        className="text-textMuted hover:text-red-500 font-bold transition-colors px-4 py-2 rounded-lg"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        onClick={handleAddBlog}
                                        disabled={!newBlog.title || !newBlog.content}
                                        className={`flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg font-bold transition-all ${!newBlog.title || !newBlog.content ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_15px_var(--accent-glow)]'}`}
                                    >
                                        <Award className="w-4 h-4" />
                                        {newBlog.id ? 'Save Updates' : 'Publish'}
                                    </button>
                                </div>
                            </div>

                            {/* Editor Body */}
                            <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
                                {/* Left Column: Write Content */}
                                <div className="flex-1 space-y-6 flex flex-col min-h-full">
                                    <input
                                        type="text"
                                        placeholder="Article Title..."
                                        value={newBlog.title}
                                        onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-borderBase px-2 py-4 text-3xl font-heading font-bold text-textMain outline-none transition-colors focus:border-accent placeholder-textMuted/50"
                                        required
                                    />

                                    <textarea
                                        placeholder="Write an excerpt or brief summary..."
                                        value={newBlog.excerpt}
                                        onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                                        rows="2"
                                        className="w-full bg-background/50 border border-borderBase rounded-xl px-4 py-3 text-textMuted outline-none transition-colors focus:border-accent resize-none text-sm font-medium"
                                    />

                                    <div className="flex-1 flex flex-col rounded-xl border border-borderBase overflow-hidden bg-background/30 focus-within:border-accent transition-colors">
                                        <div className="flex items-center gap-2 p-2 border-b border-borderBase bg-surface/50 relative">
                                            {/* Text Decorators */}
                                            {['B', 'I', 'U', 'H1', 'H2', 'H3', 'Link', 'Quote', 'Code'].map(tool => (
                                                <button
                                                    key={tool}
                                                    type="button"
                                                    onClick={() => applyFormatting(tool)}
                                                    className="px-3 py-1.5 rounded text-xs font-bold text-textMuted hover:bg-background hover:text-textMain hover:shadow-[0_0_10px_var(--accent-glow)] transition-all"
                                                >
                                                    {tool}
                                                </button>
                                            ))}

                                            <div className="w-[1px] h-6 bg-borderBase mx-2"></div>

                                            {/* Color Picker Toggle */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                                    className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all ${showColorPicker ? 'bg-accent/20 text-accent' : 'text-textMuted hover:bg-background hover:text-textMain'}`}
                                                >
                                                    <Palette className="w-3.5 h-3.5" />
                                                    Color
                                                </button>

                                                {/* Color Dropdown */}
                                                <AnimatePresence>
                                                    {showColorPicker && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute top-full left-0 mt-2 bg-surface/90 backdrop-blur-xl border border-borderBase p-3 rounded-xl shadow-2xl flex gap-2 z-50"
                                                        >
                                                            {colorOptions.map(color => (
                                                                <button
                                                                    key={color}
                                                                    type="button"
                                                                    onClick={() => applyColor(color)}
                                                                    className="w-6 h-6 rounded-full border border-borderBase/50 hover:scale-110 transition-transform shadow-inner"
                                                                    style={{ backgroundColor: color }}
                                                                    title={color}
                                                                />
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <textarea
                                            ref={contentTextareaRef}
                                            placeholder="Start writing your article content here... (Markdown & Basic HTML supported)"
                                            value={newBlog.content}
                                            onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                                            className="flex-1 w-full bg-transparent p-4 text-textMain outline-none resize-none min-h-[300px]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Metadata & Settings */}
                                <div className="w-full md:w-80 space-y-6 shrink-0">
                                    <div className="bg-background/50 border border-borderBase rounded-xl p-5 space-y-4">
                                        <h4 className="font-bold font-heading text-sm text-textMuted uppercase tracking-wider mb-2">Metadata</h4>
                                        <div>
                                            <label className="text-xs font-bold text-textMuted block mb-1">Cover Image</label>
                                            <div className="space-y-2">
                                                <label className={`w-full flex items-center justify-center gap-2 border border-dashed border-borderBase hover:border-accent rounded-lg p-3 cursor-pointer bg-surface hover:bg-accent/5 transition-all ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    {isUploadingImage ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 text-accent animate-spin" />
                                                            <span className="text-xs font-medium text-textMuted">Uploading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="w-4 h-4 text-accent" />
                                                            <span className="text-xs font-medium text-textMain">Upload Cover Image</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, 'blogs', (url) => setNewBlog({ ...newBlog, image: url }))}
                                                        disabled={isUploadingImage}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Or paste URL: https://..."
                                                    value={newBlog.image}
                                                    onChange={e => setNewBlog({ ...newBlog, image: e.target.value })}
                                                    className="w-full bg-surface border border-borderBase rounded-lg px-3 py-2 text-xs text-textMain outline-none focus:border-accent"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Preview */}
                                        {newBlog.image && (
                                            <div className="w-full h-32 rounded-lg bg-borderBase overflow-hidden relative">
                                                <img src={newBlog.image} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-bold text-textMuted block mb-1">Estimated Read Time</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 5 min read"
                                                value={newBlog.readTime}
                                                onChange={e => setNewBlog({ ...newBlog, readTime: e.target.value })}
                                                className="w-full bg-surface border border-borderBase rounded-lg px-3 py-2 text-sm text-textMain outline-none focus:border-accent"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-textMuted block mb-1">External Link (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="https://medium.com/..."
                                                value={newBlog.link}
                                                onChange={e => setNewBlog({ ...newBlog, link: e.target.value })}
                                                className="w-full bg-surface border border-borderBase rounded-lg px-3 py-2 text-sm text-textMain outline-none focus:border-accent"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
                                        <h4 className="font-bold font-heading text-sm text-accent uppercase tracking-wider mb-2">{newBlog.id ? 'Update Settings' : 'Publish Settings'}</h4>
                                        <p className="text-xs text-textMuted mb-4">The article will be {newBlog.id ? 'updated' : 'published'} immediately upon clicking {newBlog.id ? 'Save Updates' : 'Publish'}.</p>
                                        <div className="text-xs font-mono text-textMain/70 bg-background/50 px-3 py-2 rounded-lg border border-borderBase">
                                            Date: {newBlog.date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add / Edit Recognition Overlay */}
            <AnimatePresence>
                {isAddingRecognition && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingRecognition(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-surface/95 backdrop-blur-2xl border border-borderBase rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b border-borderBase bg-background/50">
                                <h3 className="text-xl font-black font-heading tracking-tight flex items-center gap-2">
                                    <Star className="w-5 h-5 text-accent" />
                                    {newRecognition.id ? 'Edit' : 'New'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Recognition.</span>
                                </h3>
                                <button
                                    onClick={() => setIsAddingRecognition(false)}
                                    className="text-textMuted hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5 opacity-0" /> {/* Spacer */}
                                    <span className="font-bold">Discard</span>
                                </button>
                            </div>

                            <form onSubmit={handleAddRecognition} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-xs font-bold text-textMuted block mb-1">Sequence Order</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 1"
                                            value={newRecognition.sequence}
                                            onChange={e => setNewRecognition({ ...newRecognition, sequence: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="text-xs font-bold text-textMuted block mb-1">Recognition Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Innovator of the Year"
                                            value={newRecognition.title}
                                            onChange={e => setNewRecognition({ ...newRecognition, title: e.target.value })}
                                            className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Recognition Caption</label>
                                    <textarea
                                        placeholder="Brief description or caption for this recognition..."
                                        value={newRecognition.caption}
                                        onChange={e => setNewRecognition({ ...newRecognition, caption: e.target.value })}
                                        rows="2"
                                        className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent resize-none text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Date Display</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. December 2023"
                                        value={newRecognition.date}
                                        onChange={e => setNewRecognition({ ...newRecognition, date: e.target.value })}
                                        className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Recognition Image</label>
                                    <div className="space-y-3">
                                        <label className={`w-full flex items-center justify-center gap-2 border border-dashed border-borderBase hover:border-accent rounded-xl p-4 cursor-pointer bg-background/50 hover:bg-accent/5 transition-all ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {isUploadingImage ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                                                    <span className="text-sm font-medium text-textMuted">Processing & Optimizing Image...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-5 h-5 text-accent" />
                                                    <span className="text-sm font-medium text-textMain">Upload from Device</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'recognitions', (url) => setNewRecognition({ ...newRecognition, image: url }))}
                                                disabled={isUploadingImage}
                                                className="hidden"
                                            />
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-textMuted shrink-0">Or paste URL:</span>
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                value={newRecognition.image}
                                                onChange={e => setNewRecognition({ ...newRecognition, image: e.target.value })}
                                                className="flex-1 bg-background border border-borderBase rounded-xl px-4 py-2.5 text-sm text-textMain outline-none transition-colors focus:border-accent placeholder-textMuted"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {newRecognition.image && (
                                    <div className="w-full h-40 rounded-xl bg-borderBase overflow-hidden relative mt-2">
                                        <img src={newRecognition.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingRecognition(false)}
                                        className="px-4 py-2 rounded-lg font-bold text-textMuted hover:bg-surface transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newRecognition.title || !newRecognition.image}
                                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${!newRecognition.title || !newRecognition.image ? 'bg-surface text-textMuted cursor-not-allowed' : 'bg-accent text-white hover:shadow-[0_0_15px_var(--accent-glow)]'}`}
                                    >
                                        <Award className="w-4 h-4" />
                                        {newRecognition.id ? 'Save Updates' : 'Add Recognition'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add / Edit Certificate Overlay */}
            <AnimatePresence>
                {isAddingCertificate && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingCertificate(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-surface/95 backdrop-blur-2xl border border-borderBase rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b border-borderBase bg-background/50">
                                <h3 className="text-xl font-black font-heading tracking-tight flex items-center gap-2">
                                    <FileBadge className="w-5 h-5 text-accent" />
                                    {newCertificate.id ? 'Edit' : 'New'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fff] dark:to-[#020617] text-glow">Certificate.</span>
                                </h3>
                                <button
                                    onClick={() => setIsAddingCertificate(false)}
                                    className="text-textMuted hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5 opacity-0" />
                                    <span className="font-bold">Discard</span>
                                </button>
                            </div>

                            <form onSubmit={handleAddCertificate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-xs font-bold text-textMuted block mb-1">Sequence</label>
                                        <input
                                            type="number"
                                            placeholder="1"
                                            value={newCertificate.sequence}
                                            onChange={e => setNewCertificate({ ...newCertificate, sequence: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="text-xs font-bold text-textMuted block mb-1">Certificate Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. AWS Certified Solutions Architect"
                                            value={newCertificate.title}
                                            onChange={e => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                            className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Provider / Organization</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Amazon Web Services"
                                        value={newCertificate.provider}
                                        onChange={e => setNewCertificate({ ...newCertificate, provider: e.target.value })}
                                        className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Date Issued</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. August 2023"
                                        value={newCertificate.date}
                                        onChange={e => setNewCertificate({ ...newCertificate, date: e.target.value })}
                                        className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none transition-colors focus:border-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Certificate Image</label>
                                    <div className="space-y-3">
                                        <label className={`w-full flex items-center justify-center gap-2 border border-dashed border-borderBase hover:border-accent rounded-xl p-4 cursor-pointer bg-background/50 hover:bg-accent/5 transition-all ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {isUploadingImage ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                                                    <span className="text-sm font-medium text-textMuted">Optimizing Image...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-5 h-5 text-accent" />
                                                    <span className="text-sm font-medium text-textMain">Upload from Device</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'certificates', (url) => setNewCertificate({ ...newCertificate, image: url }))}
                                                disabled={isUploadingImage}
                                                className="hidden"
                                            />
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-textMuted shrink-0">Or paste URL:</span>
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                value={newCertificate.image}
                                                onChange={e => setNewCertificate({ ...newCertificate, image: e.target.value })}
                                                className="flex-1 bg-background border border-borderBase rounded-xl px-4 py-2.5 text-sm text-textMain outline-none transition-colors focus:border-accent placeholder-textMuted"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {newCertificate.image && (
                                    <div className="w-full h-40 rounded-xl bg-borderBase overflow-hidden relative mt-2 flex items-center justify-center">
                                        <img src={newCertificate.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCertificate(false)}
                                        className="px-4 py-2 rounded-lg font-bold text-textMuted hover:bg-surface transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newCertificate.title || !newCertificate.image || !newCertificate.provider}
                                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${(!newCertificate.title || !newCertificate.image || !newCertificate.provider) ? 'bg-surface text-textMuted cursor-not-allowed' : 'bg-accent text-white hover:shadow-[0_0_15px_var(--accent-glow)]'}`}
                                    >
                                        <FileBadge className="w-4 h-4" />
                                        {newCertificate.id ? 'Save Updates' : 'Add Certificate'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quiz Editor Overlay */}
            <AnimatePresence>
                {isAddingQuestion && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingQuestion(false)} className="absolute inset-0 bg-background/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-surface/90 backdrop-blur-xl border border-borderBase p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3">
                                <HelpCircle className="w-6 h-6 text-accent" />
                                {newQuestion.id ? 'Edit Question' : 'Configure New Question'}
                            </h3>
                            <form onSubmit={handleAddQuestion} className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Question Text</label>
                                    <input type="text" placeholder="e.g. What is the biggest hurdle in digital transformation?" value={newQuestion.title} onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })} className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent" required />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-textMuted block">Options (Select the correct answer to assign 10 Marks)</label>
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-4">
                                            <input type="radio" name="correctOption" checked={newQuestion.correctOptionIndex === i} onChange={() => setNewQuestion({ ...newQuestion, correctOptionIndex: i })} className="w-5 h-5 accent-accent cursor-pointer" />
                                            <input type="text" placeholder={`Option ${['A', 'B', 'C', 'D'][i]}`} value={newQuestion.options[i]} onChange={e => {
                                                const newOpts = [...newQuestion.options];
                                                newOpts[i] = e.target.value;
                                                setNewQuestion({ ...newQuestion, options: newOpts });
                                            }} className={`flex-1 bg-background border rounded-xl px-4 py-3 outline-none transition-colors ${newQuestion.correctOptionIndex === i ? 'border-accent/50 bg-accent/5' : 'border-borderBase focus:border-accent'}`} required />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-borderBase">
                                    <button type="button" onClick={() => setIsAddingQuestion(false)} className="px-6 py-2 rounded-lg font-medium text-textMuted hover:text-textMain transition-colors">Cancel</button>
                                    <button type="submit" disabled={!newQuestion.title || newQuestion.options.some(opt => !opt.trim())} className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${(!newQuestion.title || newQuestion.options.some(opt => !opt.trim())) ? 'bg-surface text-textMuted cursor-not-allowed' : 'bg-accent text-white hover:shadow-[0_0_15px_var(--accent-glow)]'}`}>
                                        <CheckCircle className="w-4 h-4" /> Save Question
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isEditingTestimony && editTestimonyData && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingTestimony(false)} className="absolute inset-0 bg-background/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-surface/90 backdrop-blur-xl border border-borderBase p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3">
                                <MessageSquareQuote className="w-6 h-6 text-accent" />
                                Edit Testimony
                            </h3>
                            <form onSubmit={handleEditTestimonySubmit} className="space-y-4">
                                <div className="mb-2">
                                    <label className="text-xs font-bold text-textMuted block mb-2">Testifier Image (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-surface border border-borderBase overflow-hidden flex items-center justify-center shrink-0">
                                            {editTestimonyData.image ? (
                                                <img src={editTestimonyData.image} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <MessageSquareQuote className="w-6 h-6 text-textMuted/50" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="testimony-image-upload"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, 'testimonies', (url) => setEditTestimonyData({ ...editTestimonyData, image: url }))}
                                            />
                                            <label
                                                htmlFor="testimony-image-upload"
                                                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-surface border border-borderBase rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                                {editTestimonyData.image ? 'Change Image' : 'Upload Image'}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Name</label>
                                    <input type="text" value={editTestimonyData.name} onChange={e => setEditTestimonyData({ ...editTestimonyData, name: e.target.value })} className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Company / Organization</label>
                                    <input type="text" value={editTestimonyData.company} onChange={e => setEditTestimonyData({ ...editTestimonyData, company: e.target.value })} className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Relationship</label>
                                    <input type="text" value={editTestimonyData.relation} onChange={e => setEditTestimonyData({ ...editTestimonyData, relation: e.target.value })} className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Position at the Time</label>
                                    <input type="text" value={editTestimonyData.position || ''} onChange={e => setEditTestimonyData({ ...editTestimonyData, position: e.target.value })} className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Display Sequence (e.g. 1, 2, 3)</label>
                                    <input type="number" value={editTestimonyData.sequence || ''} onChange={e => setEditTestimonyData({ ...editTestimonyData, sequence: parseInt(e.target.value, 10) || '' })} className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent" />
                                </div>
                                <div className="border border-borderBase p-4 rounded-xl space-y-3 bg-surface/50">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-textMuted">Show Source field on Recognition page?</label>
                                        <input type="checkbox" checked={editTestimonyData.showSource || false} onChange={e => setEditTestimonyData({ ...editTestimonyData, showSource: e.target.checked })} className="w-4 h-4 accent-accent cursor-pointer" />
                                    </div>
                                    <div className={`transition-all duration-300 ${editTestimonyData.showSource ? 'opacity-100 h-auto' : 'opacity-50 pointer-events-none'}`}>
                                        <label className="text-xs font-bold text-textMuted block mb-1">Source (e.g. LinkedIn, Email)</label>
                                        <input type="text" value={editTestimonyData.source || ''} onChange={e => setEditTestimonyData({ ...editTestimonyData, source: e.target.value })} className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent" disabled={!editTestimonyData.showSource} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted block mb-1">Testimony Comment</label>
                                    <textarea value={editTestimonyData.comment} onChange={e => setEditTestimonyData({ ...editTestimonyData, comment: e.target.value })} rows="4" className="w-full bg-background border border-borderBase rounded-xl px-4 py-3 text-textMain outline-none focus:border-accent resize-none" required />
                                </div>
                                <div className="flex justify-end gap-4 pt-4 mt-2 border-t border-borderBase">
                                    <button type="button" onClick={() => setIsEditingTestimony(false)} className="px-6 py-2 rounded-lg font-medium text-textMuted hover:text-textMain transition-colors">Cancel</button>
                                    <button type="submit" className="bg-accent text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-[0_0_15px_var(--accent-glow)] transition-all">
                                        <CheckCircle className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
