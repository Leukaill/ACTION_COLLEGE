
/**
 * @fileoverview A service for fetching campus data. In a real app, this would connect to a database or external APIs.
 * For this demo, it fetches pre-defined data, some of which can be stored in Firestore for persistence.
 */

// --- TYPE DEFINITIONS ---

export interface Module {
    name: string;
    code: string;
    credits: number;
    quiz?: number | null;
    attendance: number;
    cat: number;
    finalExam?: number | null;
    total?: number;
    grade: string;
}

export interface Semester {
    name: string;
    status: string;
    gpa: string;
    modules: Module[];
}

export interface Faculty {
    id: string;
    name: string;
    dean: string;
    contact: string;
}

export interface AcademicData {
    currentSemester: string;
    semesters: Semester[];
    faculties: Faculty[];
}

export interface PaymentTransaction {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: "Completed" | "Pending" | "Failed";
}

export interface InsuranceInfo {
    company: string;
    policyNumber: string;
    registrationDate: string; // ISO date string
    expiryDate: string; // ISO date string
}

export interface MedicalInfo {
    bloodType: string;
    allergies: string;
    chronicConditions: string;
    medications: string;
}

export interface UserProfile {
    uid: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    studentId: string;
    phone: string;
    academicYear: string;
    faculty: string;
    department: string;
    createdAt: Date;
    payment: {
        totalFees: number;
        paid: number;
        history: PaymentTransaction[];
    };
    insurance?: InsuranceInfo;
    medicalInfo?: MedicalInfo;
}


export interface LibraryBook {
    id: string;
    title: string;
    author: string;
    available: boolean;
}

export interface StudyRoom {
    id: string;
    name: string;
    capacity: number;
    available: boolean;
}

export interface StudyGroup {
    id: string;
    courseName: string;
    courseCode: string;
    groupName: string;
    description: string;
    members: number;
    capacity: number;
    meetTime: string;
    meetLocation: string;
}


// --- UTILITIES FOR MOCK DATA GENERATION ---

const COURSES = [
    { name: "Data Structures & Algorithms", code: "CS305", credits: 4 },
    { name: "Complex Analysis", code: "MATH203", credits: 3 },
    { name: "History of Gabon", code: "HIST101", credits: 3 },
    { name: "African Literature", code: "ENG220", credits: 3 },
    { name: "Microeconomics", code: "ECO201", credits: 3 },
    { name: "Modern Physics", code: "PHY210", credits: 4 },
    { name: "Intro to Python", code: "CS201", credits: 3 },
    { name: "General Physics I", code: "PHY201", credits: 4 },
    { name: "Written Expression", code: "FRN102", credits: 3 },
    { name: "Linear Algebra", code: "MATH202", credits: 4 },
    { name: "General Chemistry", code: "CHEM101", credits: 4 },
    { name: "Intro to Sociology", code: "SOC101", credits: 3 },
    { name: "Introduction to Computer Science", code: "CS101", credits: 3 },
    { name: "Analysis I", code: "MATH101", credits: 4 },
    { name: "Intro to Psychology", code: "PSY100", credits: 3 },
    { name: "Academic Writing", code: "ENG101", credits: 3 },
    { name: "Introduction to Biology", code: "BIO101", credits: 4 },
    { name: "Art History", code: "ART100", credits: 3 },
    { name: "Physical Education", code: "PED100", credits: 2 },
    { name: "Company Internship", code: "INTERN101", credits: 3 },
    { name: "Public Speaking", code: "COMM205", credits: 3 },
    { name: "Creative Writing Workshop", code: "ENG210", credits: 3 },
];

const pickRandom = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const generateGrade = () => {
    const total = Math.floor(Math.random() * 31) + 70; // 70-100
    let grade = "";
    if (total >= 93) grade = "A";
    else if (total >= 90) grade = "A-";
    else if (total >= 87) grade = "B+";
    else if (total >= 83) grade = "B";
    else if (total >= 80) grade = "B-";
    else if (total >= 77) grade = "C+";
    else if (total >= 73) grade = "C";
    else grade = "C-";

    return {
        quiz: Math.min(100, total + Math.floor(Math.random() * 5)),
        attendance: Math.floor(Math.random() * 11) + 90, // 90-100
        cat: Math.min(100, total + Math.floor(Math.random() * 10) - 5),
        finalExam: Math.floor(Math.random() * 21) + 75, // 75-95
        total,
        grade,
    };
};

const generateMockAcademicData = (): AcademicData => {
    const semesters = [
        { name: "First Semester (Sep-Dec 2023)", status: "Completed", gpa: "3.50", courses: pickRandom(COURSES, 7) },
        { name: "Second Semester (Jan-May 2024)", status: "Completed", gpa: "3.70", courses: pickRandom(COURSES, 6) },
        { name: "Summer Class (Jun-Aug 2024)", status: "Completed", gpa: "4.00", courses: pickRandom(COURSES, 3) },
        { name: "First Semester (Sep-Dec 2024)", status: "In Progress", gpa: "3.82", courses: pickRandom(COURSES, 6) },
    ];

    const processedSemesters = semesters.map(s => ({
        ...s,
        modules: s.courses.map(course => {
            const grades = generateGrade();
            return {
                ...course,
                ...grades,
                finalExam: s.status === "Completed" ? grades.finalExam : null,
            };
        })
    }));

    return {
        currentSemester: "First Semester (Sep-Dec 2024)",
        semesters: processedSemesters,
        faculties: [
            { id: "fdse", name: "Faculty of Law and Economic Sciences (FDSE)", dean: "Dr. Jean Dupont", contact: "fdse@ac.edu.ga" },
            { id: "flsh", name: "Faculty of Letters and Human Sciences (FLSH)", dean: "Dr. Marie Dubois", contact: "flsh@ac.edu.ga" },
            { id: "fmss", name: "Faculty of Medicine and Health Sciences (FMSS)", dean: "Prof. Pierre Ibinga", contact: "fmss@ac.edu.ga" },
        ]
    };
};


// --- EXPORTED FUNCTIONS ---

// --- DEMO/OFFLINE FUNCTIONS ---
const LOCAL_STORAGE_PROFILES_KEY = 'user_profiles_demo';
const LOCAL_STORAGE_ACADEMIC_KEY = 'academic_data_demo';

// Helper to get all stored user profiles from localStorage
const getStoredProfiles = (): { [uid: string]: UserProfile } => {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
    return data ? JSON.parse(data) : {};
};

// Helper to save all user profiles to localStorage
const saveStoredProfiles = (profiles: { [uid: string]: UserProfile }) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
};


// Function for the registration page to save a new user profile
export async function saveUserProfileForDemo(profile: UserProfile): Promise<void> {
    const profiles = getStoredProfiles();
    
    // Check if email is already taken
    const emailExists = Object.values(profiles).some(p => p.email === profile.email);
    if (emailExists) {
        throw new Error("A user with this email address already exists.");
    }
    
    profiles[profile.uid] = profile;
    saveStoredProfiles(profiles);
}

// Function for the login page to find a user by email
export async function getUserProfileByEmailForDemo(email: string): Promise<UserProfile | null> {
    const profiles = getStoredProfiles();
    return Object.values(profiles).find(p => p.email === email) || null;
}

export async function getCampusEvents() {
    return Promise.resolve([
        { name: 'First Session Exams', date: '2024-07-15', time: '9:00 AM', location: 'Central Amphitheatres' },
        { name: 'Course Registration Deadline', date: '2024-07-22', time: '11:59 PM', location: 'Online' },
        { name: 'Independence Day Celebration', date: '2024-08-17', time: '6:00 PM', location: 'Rectorate Esplanade' },
        { name: 'Career Fair', date: '2024-09-05', time: '10:00 AM', location: 'Campus Gymnasium' },
        { name: 'ac Hackathon Kick-off', date: '2024-09-20', time: '5:00 PM', location: 'Digital Hub' },
    ]);
}

export async function getCampusLocations() {
    return Promise.resolve([
        { name: 'University Library (BU)', category: 'Academic', status: 'Open', details: 'Closes at 8 PM', capacity: '45% full', icon: 'University', color: 'text-blue-500', bgColor: 'bg-blue-100' },
        { name: 'University Restaurant (RU)', category: 'Dining', status: 'Serving Lunch', details: 'Daily special, Grills', capacity: '70% full', icon: 'Utensils', color: 'text-orange-500', bgColor: 'bg-orange-100' },
        { name: 'Digital Hub', category: 'Academic', status: 'Open', details: 'Free Wi-Fi & workstations', capacity: '60% full', icon: 'Wifi', color: 'text-purple-500', bgColor: 'bg-purple-100' },
        { name: 'Rectorate', category: 'Administration', status: 'Open', details: 'Administrative services', capacity: 'Busy', icon: 'Building', color: 'text-green-500', bgColor: 'bg-green-100' },
        { name: 'Gymnasium', category: 'Recreation', status: 'Open', details: 'Closes at 9 PM', capacity: 'Low', icon: 'Dumbbell', color: 'text-red-500', bgColor: 'bg-red-100' },
        { name: 'Amphitheater A', category: 'Academic', status: 'Closed', details: 'Opens at 8 AM tomorrow', capacity: 'N/A', icon: 'Lightbulb', color: 'text-gray-500', bgColor: 'bg-gray-100' },
    ]);
}

/**
 * Fetches the user's profile from localStorage for the demo.
 * @param userId The UID of the user to fetch the profile for.
 * @returns {Promise<UserProfile | null>} The user's profile data or null if not found.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;
    const profiles = getStoredProfiles();
    return profiles[userId] || null;
}

/**
 * Updates the user's profile in localStorage for the demo.
 * @param userId The UID of the user to update.
 * @param updatedProfile The partial or full user profile data to update.
 * @returns {Promise<UserProfile>} The updated user profile.
 */
export async function updateUserProfile(userId: string, updatedProfile: Partial<UserProfile>): Promise<UserProfile> {
    const profiles = getStoredProfiles();
    const user = profiles[userId];
    if (!user) {
        throw new Error("User not found for update.");
    }
    const newProfile = { ...user, ...updatedProfile };
    profiles[userId] = newProfile;
    saveStoredProfiles(profiles);
    return newProfile;
}

/**
 * Fetches academic data for a given user from localStorage for the demo.
 * If the user has no data, it generates mock data,
 * stores it for future use, and returns it.
 * @param userId The UID of the user to fetch data for.
 * @returns {Promise<AcademicData>} The academic data for the user.
 */
export async function getAcademicDataForUser(userId: string): Promise<AcademicData> {
    if (!userId) {
        throw new Error("User ID is required to fetch academic data.");
    }
    
    if (typeof window === 'undefined') {
        // Return a default structure for server-side rendering
        return generateMockAcademicData();
    }

    const allAcademicData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACADEMIC_KEY) || '{}');
    let userAcademicData = allAcademicData[userId];

    if (userAcademicData) {
        return userAcademicData;
    } else {
        const mockData = generateMockAcademicData();
        allAcademicData[userId] = mockData;
        localStorage.setItem(LOCAL_STORAGE_ACADEMIC_KEY, JSON.stringify(allAcademicData));
        return mockData;
    }
}

// --- NEW LIBRARY FUNCTIONS ---

export async function getLibraryBooks(): Promise<LibraryBook[]> {
    return Promise.resolve([
        // African Literature & History
        { id: "1", title: "Things Fall Apart", author: "Chinua Achebe", available: true },
        { id: "2", title: "The Beautiful Ones Are Not Yet Born", author: "Ayi Kwei Armah", available: false },
        { id: "3", title: "Histoire de l'Afrique Noire", author: "Joseph Ki-Zerbo", available: true },
        { id: "4", title: "L'Aventure ambiguë", author: "Cheikh Hamidou Kane", available: true },
        { id: "5", title: "Woman at Point Zero", author: "Nawal El Saadawi", available: false },
        { id: "6", title: "Le Labyrinthe de l'Inhumain", author: "Aminata Sow Fall", available: true },
        { id: "7", title: "Histoire Générale du Gabon", author: "N'koghle Gregoire", available: true },

        // Computer Science & AI
        { id: "8", title: "Introduction to Algorithms", author: "T. Cormen, C. Leiserson, R. Rivest, C. Stein", available: false },
        { id: "9", title: "Structure and Interpretation of Computer Programs", author: "Harold Abelson, Gerald Jay Sussman", available: true },
        { id: "10", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", available: true },
        { id: "11", title: "Clean Code: A Handbook of Agile Software Craftsmanship", author: "Robert C. Martin", available: false },
        { id: "12", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", available: true },

        // Law & Economics
        { id: "13", title: "Droit des obligations", author: "Alain Bénabent", available: true },
        { id: "14", title: "The Economy of Gabon", author: "Dr. Moussa Doukoure", available: true },
        { id: "15", title: "Introduction au droit de l'OHADA", author: "Joseph Issa-Sayegh", available: false },
        { id: "16", title: "Capital in the Twenty-First Century", author: "Thomas Piketty", available: true },
        
        // Medicine & Health Sciences
        { id: "17", title: "Harrison's Principles of Internal Medicine", author: "J. Larry Jameson et al.", available: true },
        { id: "18", title: "Gray's Anatomy for Students", author: "Richard L. Drake et al.", available: false },
        
        // General Academia
        { id: "19", title: "Advanced Calculus", author: "Robert C. Wrede, Murray R. Spiegel", available: true },
        { id: "20", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", available: true },
        { id: "21", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", available: true },
    ]);
}

export async function getStudyRooms(): Promise<StudyRoom[]> {
    return Promise.resolve([
        { id: "room1", name: "Individual Study Room 1", capacity: 1, available: true },
        { id: "room2", name: "Group Study Room A", capacity: 4, available: false },
        { id: "room3", name: "Group Study Room B", capacity: 6, available: true },
        { id: "room4", name: "Silent Study Zone", capacity: 20, available: true },
    ]);
}

export async function getStudyGroups(): Promise<StudyGroup[]> {
    return Promise.resolve([
      { id: "sg1", courseName: "Data Structures & Algorithms", courseCode: "CS305", groupName: "Algorithm Avengers", description: "Weekly review of lecture concepts and collaborative problem-solving for assignments.", members: 4, capacity: 6, meetTime: "Wednesdays, 4 PM", meetLocation: "Library, Group Room A" },
      { id: "sg2", courseName: "Complex Analysis", courseCode: "MATH203", groupName: "Calculus Crew", description: "Focused on tackling hard homework problems and preparing for the midterm exam.", members: 5, capacity: 8, meetTime: "Tuesdays, 6 PM", meetLocation: "Digital Hub" },
      { id: "sg3", courseName: "History of Gabon", courseCode: "HIST101", groupName: "History Buffs", description: "Group discussions on readings and exam prep. Open to all history enthusiasts!", members: 7, capacity: 10, meetTime: "Mondays, 2 PM", meetLocation: "FLSH Building, Room 102" },
      { id: "sg4", courseName: "Microeconomics", courseCode: "ECO201", groupName: "Econ Explainers", description: "Peer tutoring and concept clarification. We make supply and demand make sense.", members: 8, capacity: 8, meetTime: "Fridays, 11 AM", meetLocation: "University Restaurant (RU)" },
      { id: "sg5", courseName: "Intro to Python", courseCode: "CS201", groupName: "Python Pathfinders", description: "For beginners! We work on coding exercises and build small projects together.", members: 6, capacity: 10, meetTime: "Thursdays, 5 PM", meetLocation: "Digital Hub" },
    ]);
}
