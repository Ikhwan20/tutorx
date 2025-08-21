/**
 * STORAGE INTERFACE FOR TUTORX LEARNING PLATFORM
 * 
 * This file defines the data access layer for the Malaysian Form 4 Additional
 * Mathematics learning platform. It provides an abstraction over database
 * operations and includes an in-memory implementation for development.
 * 
 * Key Features:
 * - User management with gamification metrics
 * - Educational content organization (topics/lessons)
 * - Quiz and assessment system
 * - Progress tracking and analytics
 * - Achievement and reward system
 */

import {
  type User,
  type InsertUser,
  type Topic,
  type InsertTopic,
  type Lesson,
  type InsertLesson,
  type Quiz,
  type InsertQuiz,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
} from "@shared/schema";
import { randomUUID } from "crypto";

/**
 * STORAGE INTERFACE - Contract for all storage implementations
 * 
 * This interface defines all database operations needed by the application.
 * It can be implemented by different storage backends (memory, PostgreSQL, etc.)
 */
export interface IStorage {
  // ===================================================================
  // USER MANAGEMENT - Handle student accounts and gamification
  // ===================================================================
  getUser(id: string): Promise<User | undefined>;                    // Fetch user by ID
  getUserByUsername(username: string): Promise<User | undefined>;    // Login authentication
  createUser(user: InsertUser): Promise<User>;                       // Register new student
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>; // Update points/level/streak
  
  // ===================================================================
  // EDUCATIONAL CONTENT - Manage curriculum structure
  // ===================================================================
  getAllTopics(): Promise<Topic[]>;                                  // List all subject areas
  getTopic(id: string): Promise<Topic | undefined>;                  // Get specific topic details
  createTopic(topic: InsertTopic): Promise<Topic>;                   // Add new topic (admin)
  
  // ===================================================================
  // LESSON MANAGEMENT - Individual learning units
  // ===================================================================
  getLessonsByTopic(topicId: string): Promise<Lesson[]>;             // Get lessons in a topic
  getLesson(id: string): Promise<Lesson | undefined>;                // Get specific lesson content
  createLesson(lesson: InsertLesson): Promise<Lesson>;               // Add new lesson (admin)
  
  // ===================================================================
  // QUIZ SYSTEM - Assessments and knowledge testing
  // ===================================================================
  getQuizzesByTopic(topicId: string): Promise<Quiz[]>;               // Get topic-level quizzes
  getQuizzesByLesson(lessonId: string): Promise<Quiz[]>;             // Get lesson-specific quizzes
  getQuiz(id: string): Promise<Quiz | undefined>;                    // Get quiz questions and answers
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;                       // Add new quiz (admin)
  
  // ===================================================================
  // PROGRESS TRACKING - Student analytics and completion status
  // ===================================================================
  getUserProgress(userId: string): Promise<UserProgress[]>;          // Get all user progress
  getUserTopicProgress(userId: string, topicId: string): Promise<UserProgress[]>; // Topic-specific progress
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>; // Record completion
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>; // Update scores
  
  // ===================================================================
  // ACHIEVEMENT SYSTEM - Gamification rewards and motivation
  // ===================================================================
  getAllAchievements(): Promise<Achievement[]>;                      // List all possible achievements
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>; // User's unlocked achievements
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>; // Unlock achievement
}

/**
 * MEMORY STORAGE IMPLEMENTATION - In-memory data store for development
 * 
 * This class provides a fast, lightweight storage solution for development and testing.
 * All data is stored in JavaScript Maps and initialized with sample Malaysian curriculum data.
 * 
 * For production deployment, this should be replaced with a PostgreSQL implementation
 * using the same IStorage interface contract.
 */
export class MemStorage implements IStorage {
  // In-memory data stores using Maps for O(1) lookup performance
  private users: Map<string, User> = new Map();                      // Student accounts
  private topics: Map<string, Topic> = new Map();                    // Subject areas
  private lessons: Map<string, Lesson> = new Map();                  // Learning content
  private quizzes: Map<string, Quiz> = new Map();                    // Assessments
  private userProgress: Map<string, UserProgress> = new Map();       // Completion tracking
  private achievements: Map<string, Achievement> = new Map();        // Available rewards
  private userAchievements: Map<string, UserAchievement> = new Map(); // Unlocked rewards

  constructor() {
    this.initializeData(); // Load sample data for development
  }

  private initializeData() {
    // Initialize sample user
    const sampleUser: User = {
      id: "user-1",
      username: "ahmad",
      email: "ahmad@example.com",
      name: "Ahmad",
      level: 12,
      points: 1250,
      streak: 7,
      studyTimeMinutes: 165,
      createdAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Initialize topics
    const sampleTopics: Topic[] = [
      {
        id: "functions",
        title: "Functions and Graphs",
        description: "Master function notation, domain, range and graph transformations",
        difficulty: "intermediate",
        estimatedMinutes: 150,
        lessonsCount: 8,
        rating: 48,
        iconClass: "fas fa-function",
        colorClass: "blue",
        order: 1,
        isLocked: false,
      },
      {
        id: "quadratic",
        title: "Quadratic Functions",
        description: "Explore parabolas, vertex form, and solving quadratic equations",
        difficulty: "intermediate",
        estimatedMinutes: 180,
        lessonsCount: 6,
        rating: 49,
        iconClass: "fas fa-wave-square",
        colorClass: "primary",
        order: 2,
        isLocked: false,
      },
      {
        id: "logarithmic",
        title: "Logarithmic Functions",
        description: "Understanding logs, exponential growth and natural logarithms",
        difficulty: "advanced",
        estimatedMinutes: 80,
        lessonsCount: 5,
        rating: 47,
        iconClass: "fas fa-chart-line",
        colorClass: "purple",
        order: 3,
        isLocked: true,
      },
      {
        id: "coordinate",
        title: "Coordinate Geometry",
        description: "Lines, circles, and geometric transformations in 2D space",
        difficulty: "intermediate",
        estimatedMinutes: 130,
        lessonsCount: 7,
        rating: 46,
        iconClass: "fas fa-vector-square",
        colorClass: "green",
        order: 4,
        isLocked: true,
      },
    ];

    sampleTopics.forEach(topic => this.topics.set(topic.id, topic));

    // Initialize lessons for quadratic functions with real educational videos
    const sampleLessons: Lesson[] = [
      {
        id: "quadratic-1",
        topicId: "quadratic",
        title: "Introduction to Quadratic Functions",
        description: "Understanding the basic form and properties of quadratic functions",
        videoUrl: "https://www.youtube.com/embed/g7ZCp0OpA9s",
        videoDuration: 612,
        content: "A quadratic function is a function of the form f(x) = ax² + bx + c where a ≠ 0. The graph of a quadratic function is called a parabola. Key features include: vertex, axis of symmetry, y-intercept, and x-intercepts (if they exist). The coefficient 'a' determines whether the parabola opens upward (a > 0) or downward (a < 0). Understanding these basic properties is fundamental to mastering quadratic functions.",
        order: 1,
      },
      {
        id: "quadratic-2",
        topicId: "quadratic",
        title: "Graphing Parabolas and Finding Vertex",
        description: "Learn to graph quadratic functions and identify key features like vertex and intercepts",
        videoUrl: "https://www.youtube.com/embed/YNz79dKYtM8",
        videoDuration: 738,
        content: "To graph a quadratic function, we need to identify several key features: 1) The vertex - the highest or lowest point of the parabola, 2) The axis of symmetry - a vertical line passing through the vertex, 3) The y-intercept - where the graph crosses the y-axis, 4) The x-intercepts - where the graph crosses the x-axis (if they exist). The vertex can be found using the formula x = -b/2a, then substituting back to find the y-coordinate.",
        order: 2,
      },
      {
        id: "quadratic-3",
        topicId: "quadratic",
        title: "Vertex Form and Transformations",
        description: "Understanding vertex form f(x) = a(x-h)² + k and graph transformations",
        videoUrl: "https://www.youtube.com/embed/JJGWHt_KoqM",
        videoDuration: 564,
        content: "The vertex form of a quadratic function is f(x) = a(x-h)² + k, where (h,k) is the vertex of the parabola. This form makes it easy to identify transformations: h represents horizontal shift (opposite sign), k represents vertical shift, and |a| represents vertical stretch/compression. When |a| > 1, the parabola is narrower; when 0 < |a| < 1, it's wider. Understanding transformations helps in quickly sketching graphs and solving real-world problems.",
        order: 3,
      },
      {
        id: "quadratic-4",
        topicId: "quadratic",
        title: "Solving Quadratic Equations",
        description: "Methods for solving quadratic equations: factoring, completing the square, and quadratic formula",
        videoUrl: "https://www.youtube.com/embed/VOCNWpg7YcE",
        videoDuration: 678,
        content: "There are several methods to solve quadratic equations ax² + bx + c = 0: 1) Factoring - when the quadratic can be written as a product of binomials, 2) Completing the square - rewriting in the form (x-h)² = k, 3) Quadratic formula: x = (-b ± √(b²-4ac))/2a. The discriminant (b²-4ac) tells us about the nature of solutions: positive (two real solutions), zero (one repeated solution), negative (no real solutions).",
        order: 4,
      },
      {
        id: "quadratic-5",
        topicId: "quadratic",
        title: "Applications and Word Problems",
        description: "Real-world applications of quadratic functions in physics, economics, and geometry",
        videoUrl: "https://www.youtube.com/embed/Dx1J1e4-2-E",
        videoDuration: 542,
        content: "Quadratic functions appear in many real-world situations: projectile motion (height vs time), profit optimization in business, area and volume problems in geometry, and physics problems involving acceleration. When solving word problems: 1) Identify what the variable represents, 2) Set up the quadratic equation from the given information, 3) Solve using appropriate method, 4) Check if the solution makes sense in context, 5) Answer the original question with proper units.",
        order: 5,
      },
      {
        id: "quadratic-6",
        topicId: "quadratic",
        title: "Sum and Product of Roots",
        description: "Relationship between coefficients and roots of quadratic equations",
        videoUrl: "https://www.youtube.com/embed/3DArK8dJKx0",
        videoDuration: 467,
        content: "For a quadratic equation ax² + bx + c = 0 with roots α and β: Sum of roots: α + β = -b/a, Product of roots: αβ = c/a. These relationships are useful for: 1) Finding unknown coefficients when roots are given, 2) Forming new quadratic equations, 3) Solving problems involving symmetric functions of roots, 4) Checking solutions without fully solving the equation. This concept is particularly important in Malaysian Additional Mathematics syllabus.",
        order: 6,
      },
    ];

    sampleLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Initialize lessons for functions topic
    const functionsLessons: Lesson[] = [
      {
        id: "functions-1",
        topicId: "functions",
        title: "Introduction to Functions",
        description: "Understanding function notation, domain, and range",
        videoUrl: "https://www.youtube.com/embed/52tpYl2tTqk",
        videoDuration: 534,
        content: "A function is a relation where each input has exactly one output. We use function notation f(x) to represent the output when x is the input. The domain is the set of all possible inputs, and the range is the set of all possible outputs. Functions can be represented in various ways: equations, tables, graphs, and word descriptions.",
        order: 1,
      },
      {
        id: "functions-2",
        topicId: "functions",
        title: "Function Operations",
        description: "Adding, subtracting, multiplying, and dividing functions",
        videoUrl: "https://www.youtube.com/embed/EIhJ5Q0PW3w",
        videoDuration: 612,
        content: "Functions can be combined using arithmetic operations: (f+g)(x) = f(x) + g(x), (f-g)(x) = f(x) - g(x), (f·g)(x) = f(x) · g(x), (f/g)(x) = f(x)/g(x) where g(x) ≠ 0. These operations allow us to create more complex functions from simpler ones.",
        order: 2,
      },
      {
        id: "functions-3",
        topicId: "functions",
        title: "Composite Functions",
        description: "Function composition and finding (f∘g)(x)",
        videoUrl: "https://www.youtube.com/embed/UWLs0-zEVaI", 
        videoDuration: 445,
        content: "Composite functions involve applying one function to the result of another. The notation (f∘g)(x) = f(g(x)) means 'f of g of x'. To evaluate, work from inside out: first find g(x), then apply f to that result. The domain of f∘g consists of all x values where g(x) is defined and g(x) is in the domain of f.",
        order: 3,
      },
    ];

    functionsLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Initialize comprehensive quizzes
    const sampleQuizzes: Quiz[] = [
      {
        id: "quadratic-quiz-1",
        lessonId: "quadratic-3",
        topicId: "quadratic",
        title: "Vertex Form and Transformations Quiz",
        description: "Test your understanding of vertex form and graph transformations",
        questions: [
          {
            id: "q1",
            question: "What is the vertex of the parabola y = 2(x - 3)² + 5?",
            options: ["(3, 5)", "(-3, 5)", "(3, -5)", "(-3, -5)"],
            correctAnswer: 0,
          },
          {
            id: "q2",
            question: "Which direction does the parabola y = -0.5(x + 2)² - 1 open?",
            options: ["Upward", "Downward", "Left", "Right"],
            correctAnswer: 1,
          },
          {
            id: "q3",
            question: "If f(x) = (x - 4)² + 1, what transformation moves the basic parabola y = x²?",
            options: ["Right 4, up 1", "Left 4, down 1", "Right 4, down 1", "Left 4, up 1"],
            correctAnswer: 0,
          },
          {
            id: "q4",
            question: "What is the axis of symmetry for y = 3(x + 1)² - 2?",
            options: ["x = 1", "x = -1", "x = 3", "x = -2"],
            correctAnswer: 1,
          },
          {
            id: "q5",
            question: "Which value of 'a' makes the parabola y = a(x - 2)² wider than y = x²?",
            options: ["a = 2", "a = 0.5", "a = -1", "a = 3"],
            correctAnswer: 1,
          }
        ],
        pointsReward: 75,
        timeLimit: 450,
      },
      {
        id: "functions-quiz-1",
        lessonId: "functions-1",
        topicId: "functions",
        title: "Functions Basics Quiz",
        description: "Test your understanding of functions, domain, and range",
        questions: [
          {
            id: "q1",
            question: "If f(x) = 2x + 3, what is f(5)?",
            options: ["13", "10", "8", "15"],
            correctAnswer: 0,
          },
          {
            id: "q2", 
            question: "What is the domain of f(x) = √(x - 2)?",
            options: ["x ≥ 2", "x ≤ 2", "x > 2", "All real numbers"],
            correctAnswer: 0,
          },
          {
            id: "q3",
            question: "If g(x) = x² - 4x + 3, what is g(-1)?",
            options: ["8", "0", "-2", "6"],
            correctAnswer: 0,
          },
          {
            id: "q4",
            question: "Which relation represents a function?",
            options: ["{(1,2), (2,3), (1,4)}", "{(1,2), (2,2), (3,2)}", "{(1,2), (1,3), (2,4)}", "{(1,2), (2,1), (1,3)}"],
            correctAnswer: 1,
          }
        ],
        pointsReward: 60,
        timeLimit: 360,
      },
      {
        id: "quadratic-solving-quiz",
        lessonId: "quadratic-4",
        topicId: "quadratic", 
        title: "Solving Quadratic Equations Quiz",
        description: "Practice different methods of solving quadratic equations",
        questions: [
          {
            id: "q1",
            question: "Solve x² - 5x + 6 = 0 using factoring.",
            options: ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = -1, -6"],
            correctAnswer: 0,
          },
          {
            id: "q2",
            question: "What is the discriminant of 2x² - 4x + 5 = 0?",
            options: ["-24", "24", "16", "-16"],
            correctAnswer: 0,
          },
          {
            id: "q3",
            question: "How many real solutions does x² - 6x + 9 = 0 have?",
            options: ["0", "1", "2", "Infinite"],
            correctAnswer: 1,
          },
          {
            id: "q4",
            question: "Using the quadratic formula, solve x² + 2x - 3 = 0.",
            options: ["x = 1, -3", "x = -1, 3", "x = 1, 3", "x = -1, -3"],
            correctAnswer: 0,
          }
        ],
        pointsReward: 80,
        timeLimit: 480,
      }
    ];

    sampleQuizzes.forEach(quiz => this.quizzes.set(quiz.id, quiz));

    // Initialize achievements
    const sampleAchievements: Achievement[] = [
      {
        id: "week-warrior",
        title: "Week Warrior",
        description: "7-day study streak achieved!",
        iconClass: "fas fa-fire",
        colorClass: "accent",
        requirement: "streak_7_days",
        pointsReward: 100,
      },
      {
        id: "quiz-master",
        title: "Quiz Master",
        description: "Scored 90%+ on 5 quizzes",
        iconClass: "fas fa-graduation-cap",
        colorClass: "secondary",
        requirement: "quiz_90_percent_5_times",
        pointsReward: 150,
      },
      {
        id: "speed-learner",
        title: "Speed Learner",
        description: "Completed 3 lessons in 1 hour",
        iconClass: "fas fa-clock",
        colorClass: "purple",
        requirement: "lessons_3_in_1_hour",
        pointsReward: 75,
      },
    ];

    sampleAchievements.forEach(achievement => this.achievements.set(achievement.id, achievement));

    // Initialize user achievements
    const userAchievementIds = ["ua-1", "ua-2", "ua-3"];
    const achievementIds = ["week-warrior", "quiz-master", "speed-learner"];
    
    achievementIds.forEach((achievementId, index) => {
      const userAchievement: UserAchievement = {
        id: userAchievementIds[index],
        userId: "user-1",
        achievementId,
        unlockedAt: new Date(),
      };
      this.userAchievements.set(userAchievement.id, userAchievement);
    });

    // Initialize user progress
    const progressEntries = [
      {
        id: "progress-1",
        userId: "user-1",
        topicId: "functions",
        lessonId: null,
        isCompleted: true,
        score: 95,
        timeSpent: 5400,
        completedAt: new Date(),
      },
      {
        id: "progress-2",
        userId: "user-1",
        topicId: "quadratic",
        lessonId: "quadratic-1",
        isCompleted: true,
        score: 88,
        timeSpent: 2700,
        completedAt: new Date(),
      },
      {
        id: "progress-3",
        userId: "user-1",
        topicId: "quadratic",
        lessonId: "quadratic-2",
        isCompleted: true,
        score: 92,
        timeSpent: 3100,
        completedAt: new Date(),
      },
    ];

    progressEntries.forEach(progress => this.userProgress.set(progress.id, progress));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      level: insertUser.level || 1,
      points: insertUser.points || 0,
      streak: insertUser.streak || 0,
      studyTimeMinutes: insertUser.studyTimeMinutes || 0,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Topic methods
  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values()).sort((a, b) => a.order - b.order);
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const fullTopic: Topic = {
      ...topic,
      rating: topic.rating || 50,
      isLocked: topic.isLocked || false,
    };
    this.topics.set(topic.id, fullTopic);
    return fullTopic;
  }

  // Lesson methods
  async getLessonsByTopic(topicId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.topicId === topicId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const fullLesson: Lesson = {
      ...lesson,
      videoUrl: lesson.videoUrl || null,
      videoDuration: lesson.videoDuration || null,
    };
    this.lessons.set(lesson.id, fullLesson);
    return fullLesson;
  }

  // Quiz methods
  async getQuizzesByTopic(topicId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.topicId === topicId);
  }

  async getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.lessonId === lessonId);
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const fullQuiz: Quiz = {
      ...quiz,
      topicId: quiz.topicId || null,
      lessonId: quiz.lessonId || null,
      pointsReward: quiz.pointsReward || 50,
      timeLimit: quiz.timeLimit || null,
    };
    this.quizzes.set(quiz.id, fullQuiz);
    return fullQuiz;
  }

  // Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserTopicProgress(userId: string, topicId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId && progress.topicId === topicId);
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const userProgress: UserProgress = { 
      ...progress, 
      id,
      lessonId: progress.lessonId || null,
      isCompleted: progress.isCompleted || false,
      score: progress.score || null,
      timeSpent: progress.timeSpent || null,
      completedAt: progress.completedAt || null,
    };
    this.userProgress.set(id, userProgress);
    return userProgress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    const updatedProgress = { ...progress, ...updates };
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Achievement methods
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
    
    return userAchievements.map(ua => ({
      ...ua,
      achievement: this.achievements.get(ua.achievementId)!,
    }));
  }

  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = randomUUID();
    const newUserAchievement: UserAchievement = { ...userAchievement, id, unlockedAt: new Date() };
    this.userAchievements.set(id, newUserAchievement);
    return newUserAchievement;
  }
}

export const storage = new MemStorage();
