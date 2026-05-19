import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAhmVvI4nvkcr9LBzZAdjv4zD_WnBXimEs",
    authDomain: "the-conscious-chronicles.firebaseapp.com",
    projectId: "the-conscious-chronicles",
    storageBucket: "the-conscious-chronicles.firebasestorage.app",
    messagingSenderId: "45814651601",
    appId: "1:45814651601:web:a3e58000d08520b96c83f0",
    measurementId: "G-SH0XZKXF6P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    try {
        console.log("Checking Firebase Collections...");
        const blogs = await getDocs(collection(db, 'blogs'));
        const recs = await getDocs(collection(db, 'recognitions'));
        const tests = await getDocs(collection(db, 'testimonies'));

        console.log(`Blogs migrated: ${blogs.docs.length}`);
        console.log(`Recognitions migrated: ${recs.docs.length}`);
        console.log(`Testimonies migrated: ${tests.docs.length}`);

        if (blogs.docs.length > 0 || recs.docs.length > 0 || tests.docs.length > 0) {
            console.log("\nSuccess: Data has been migrated to Firebase!");
        } else {
            console.log("\nStatus: Database is still empty.");
        }
        process.exit(0);
    } catch (err) {
        console.error("Firebase Error:", err);
        process.exit(1);
    }
}

check();
