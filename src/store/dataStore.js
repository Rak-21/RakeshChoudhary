// Firebase integrated data interface
import { db, storage } from './firebase';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- STORAGE LAYER (Canvas Compression + Base64 for Firestore) ---
// Bypasses Firebase Storage CORS & Auth restrictions by compressing the image 
// and converting it to a lightweight Base64 string stored directly in Firestore.
export const uploadImageToStorage = async (file) => {
    if (!file) return null;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG at 70% quality (results in ~50KB string, well within Firestore 1MB limit)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

// --- AUTHENTICATION ---
// Retaining simple auth for dashboard access currently
export const authenticateUser = async (username, password) => {
    if (username === 'rakesh21' && password === 'Jarvis21') {
        localStorage.setItem('isAuthenticated', 'true');
        return true;
    }
    return false;
};

export const logoutUser = () => {
    localStorage.removeItem('isAuthenticated');
};

export const checkAuth = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
};

// --- DATA LAYER (BLOGS) ---
export const getBlogs = async () => {
    const q = query(collection(db, 'blogs'), orderBy('id', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
};

export const saveBlog = async (blogData) => {
    const id = blogData.id || Date.now();
    const docRef = doc(db, 'blogs', id.toString());
    const dataToSave = { ...blogData, id }; // ensure ID is saved as field
    await setDoc(docRef, dataToSave);
    return dataToSave;
};

export const deleteBlog = async (id) => {
    await deleteDoc(doc(db, 'blogs', id.toString()));
};

// --- DATA LAYER (MESSAGES) ---
export const saveMessage = async (messageData) => {
    const id = Date.now();
    const docRef = doc(db, 'messages', id.toString());
    const dataToSave = {
        ...messageData,
        id,
        timestamp: new Date().toISOString(),
        read: false,
    };
    await setDoc(docRef, dataToSave);
    return dataToSave;
};

export const getMessages = async () => {
    const q = query(collection(db, 'messages'), orderBy('id', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ ...d.data(), docId: d.id }));
};

export const markMessageRead = async (id) => {
    const docRef = doc(db, 'messages', id.toString());
    await setDoc(docRef, { read: true }, { merge: true });
};

export const deleteMessage = async (id) => {
    await deleteDoc(doc(db, 'messages', id.toString()));
};

// --- DATA LAYER (TESTIMONIES) ---
export const getTestimonies = async () => {
    const q = query(collection(db, 'testimonies'), orderBy('id', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
};

export const saveTestimony = async (testimony) => {
    const id = testimony.id || Date.now();
    const docRef = doc(db, 'testimonies', id.toString());
    const dataToSave = {
        ...testimony,
        id,
        approved: testimony.approved !== undefined ? testimony.approved : false
    };
    await setDoc(docRef, dataToSave);
    return dataToSave;
};

export const approveTestimony = async (id) => {
    const docRef = doc(db, 'testimonies', id.toString());
    await setDoc(docRef, { approved: true }, { merge: true });
};

export const unapproveTestimony = async (id) => {
    const docRef = doc(db, 'testimonies', id.toString());
    await setDoc(docRef, { approved: false }, { merge: true });
};

export const deleteTestimony = async (id) => {
    await deleteDoc(doc(db, 'testimonies', id.toString()));
};

// --- DATA LAYER (RECOGNITIONS) ---
export const getRecognitions = async () => {
    const q = query(collection(db, 'recognitions'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
    return docs.sort((a, b) => {
        const seqA = typeof a.sequence === 'number' ? a.sequence : 999;
        const seqB = typeof b.sequence === 'number' ? b.sequence : 999;
        if (seqA !== seqB) return seqA - seqB;
        return a.id - b.id;
    });
};

export const saveRecognition = async (recData) => {
    const id = recData.id || Date.now();
    const docRef = doc(db, 'recognitions', id.toString());
    const dataToSave = { ...recData, id };
    await setDoc(docRef, dataToSave);
    return dataToSave;
};

export const deleteRecognition = async (id) => {
    await deleteDoc(doc(db, 'recognitions', id.toString()));
};

// --- DATA LAYER (CERTIFICATES) ---
export const getCertificates = async () => {
    const q = query(collection(db, 'certificates'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
    return docs.sort((a, b) => {
        const seqA = typeof a.sequence === 'number' ? a.sequence : 999;
        const seqB = typeof b.sequence === 'number' ? b.sequence : 999;
        if (seqA !== seqB) return seqA - seqB;
        return a.id - b.id;
    });
};

export const saveCertificate = async (certData) => {
    const id = certData.id || Date.now();
    const docRef = doc(db, 'certificates', id.toString());
    const dataToSave = { ...certData, id };
    await setDoc(docRef, dataToSave);
    return dataToSave;
};

export const deleteCertificate = async (id) => {
    await deleteDoc(doc(db, 'certificates', id.toString()));
};

// --- DATA LAYER (QUIZ QUESTIONS) ---
export const getQuestions = async () => {
    const q = query(collection(db, 'quiz_questions'), orderBy('id', 'asc')); // Order quiz questions ascending
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
};

export const saveQuestion = async (questionData) => {
    const id = questionData.id || Date.now();
    const docRef = doc(db, 'quiz_questions', id.toString());
    // Default question structure: { id, questionText, options: [], correctOptionIndex: 0, marks: 10 }
    const dataToSave = { ...questionData, id, marks: 10 };
    await setDoc(docRef, dataToSave);
    return dataToSave;
};

export const deleteQuestion = async (id) => {
    await deleteDoc(doc(db, 'quiz_questions', id.toString()));
};

// --- MIGRATION UTILITY ---
// Call this once to move any lingering localStorage data to Firebase.
export const migrateLocalToFirebase = async () => {
    console.log("Starting Firebase Migration...");
    // 1. Migrate Blogs
    const localBlogs = JSON.parse(localStorage.getItem('rk_blogs') || '[]');
    for (const blog of localBlogs) {
        await saveBlog(blog);
    }
    console.log(`Migrated ${localBlogs.length} blogs.`);

    // 2. Migrate Testimonies
    const localTestimonies = JSON.parse(localStorage.getItem('rk_testimonies') || '[]');
    for (const testy of localTestimonies) {
        await saveTestimony(testy);
    }
    console.log(`Migrated ${localTestimonies.length} testimonies.`);

    // 3. Migrate Recognitions
    const localRecognitions = JSON.parse(localStorage.getItem('rk_recognitions') || '[]');
    // Fallback if local storage is empty, inject defaults so they don't lose the UI images
    if (localRecognitions.length === 0) {
        const defaultRecognitions = [
            { id: 1, sequence: 1, image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800", title: "Innovator of the Year", caption: "Recognized for driving breakthrough digital initiatives and automation across enterprise mining operations.", date: "December 2023" },
            { id: 2, sequence: 2, image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", title: "Digital Transformation Leadership", caption: "Represented JSW Odisha at CII, receiving recognition for digital transformation excellence.", date: "August 2022" },
            { id: 3, sequence: 3, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", title: "Best Tech Integration", caption: "Awarded for seamless deployment of IoT and fleet management systems resulting in significant cost savings.", date: "January 2024" },
            { id: 4, sequence: 4, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", title: "Sustainability in Tech Excellence", caption: "Commended for implementing eco-friendly workflow automation and reducing paper footprint across plants.", date: "March 2021" }
        ];
        for (const rec of defaultRecognitions) {
            await saveRecognition(rec);
        }
        console.log("Migrated default Recognitions");
    } else {
        for (const rec of localRecognitions) {
            await saveRecognition(rec);
        }
        console.log(`Migrated ${localRecognitions.length} recognitions.`);
    }

    // Clear local storage keys to prevent re-migration mapping issues (optional)
    localStorage.removeItem('rk_blogs');
    localStorage.removeItem('rk_testimonies');
    localStorage.removeItem('rk_recognitions');

    console.log("Migration Complete!");
    return true;
};

// --- ANALYTICS LAYER (VISITOR COUNT) ---
export const incrementVisitorCount = async () => {
    try {
        const docRef = doc(db, 'analytics', 'visitor_count');
        const snapshot = await getDoc(docRef);
        let currentCount = 104; // User requested starting at 104

        if (snapshot.exists()) {
            const data = snapshot.data();
            currentCount = (data.count || 104) + 1;
        } else {
            // First time initialization, start at 104 + 1 = 105
            currentCount = 105;
        }

        await setDoc(docRef, { count: currentCount }, { merge: true });
        return currentCount;
    } catch (error) {
        console.warn("Visitor count increment error (non-fatal):", error);
        return 104; // Fallback to starting count
    }
};

export const getVisitorCount = async () => {
    try {
        const docRef = doc(db, 'analytics', 'visitor_count');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return snapshot.data().count || 104;
        }
        return 104;
    } catch (error) {
        console.warn("Visitor count fetch error (non-fatal):", error);
        return 104;
    }
};

// --- RESUME LAYER ---
// Stores PDF as a base64 data URL directly in Firestore (same pattern as images).
// This bypasses Firebase Storage auth rules entirely.
export const saveResume = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async (event) => {
            try {
                const base64Data = event.target.result; // "data:application/pdf;base64,..."

                const docRef = doc(db, 'settings', 'resume');
                const metadata = {
                    dataUrl: base64Data,
                    fileName: file.name,
                    uploadedAt: new Date().toISOString(),
                    size: file.size,
                };
                await setDoc(docRef, metadata);
                resolve(metadata);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
    });
};

export const getResume = async () => {
    try {
        const docRef = doc(db, 'settings', 'resume');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) return snapshot.data();
        return null;
    } catch (error) {
        console.warn("Resume fetch error:", error);
        return null;
    }
};

// Utility: Convert base64 dataUrl → Blob URL and open in new tab.
// Browsers block data: URLs in target="_blank" anchors, but Blob URLs work fine.
export const openResumeInNewTab = (dataUrl) => {
    if (!dataUrl) return;
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1]; // e.g. "application/pdf"
    const byteChars = atob(base64);
    const byteNums = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([byteNums], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
};
