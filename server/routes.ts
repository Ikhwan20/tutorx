/**
 * API ROUTES FOR TUTORX LEARNING PLATFORM
 * 
 * This file defines all REST API endpoints for the Malaysian Form 4 Additional
 * Mathematics learning platform. Routes are organized by functional area:
 * 
 * - User Management: Account data and gamification metrics
 * - Educational Content: Topics, lessons, and curriculum structure  
 * - Assessment System: Quizzes and knowledge testing
 * - Progress Tracking: Student analytics and completion data
 * - Achievement System: Gamification rewards and unlocks
 * 
 * All endpoints include proper error handling and data validation.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // =====================================================================
  // USER MANAGEMENT ROUTES - Handle student accounts and gamification
  // =====================================================================
  
  /**
   * GET /api/users/:id - Retrieve user profile with gamification data
   * Returns: User object with points, level, streak, and study time
   */
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  /**
   * PUT /api/users/:id - Update user gamification metrics
   * Used for: Points, level progression, streak updates, study time
   */
  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // =====================================================================
  // EDUCATIONAL CONTENT ROUTES - Manage curriculum structure
  // =====================================================================

  /**
   * GET /api/topics - List all available topics
   * Returns: Array of topics with difficulty, lessons count, and progress info
   */
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get topics" });
    }
  });

  /**
   * GET /api/topics/:id - Get specific topic details
   * Returns: Topic object with description, lessons count, and metadata
   */
  app.get("/api/topics/:id", async (req, res) => {
    try {
      const topic = await storage.getTopic(req.params.id);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to get topic" });
    }
  });

  // =====================================================================
  // LESSON MANAGEMENT ROUTES - Individual learning units
  // =====================================================================

  /**
   * GET /api/topics/:topicId/lessons - Get all lessons for a topic
   * Returns: Array of lessons with video URLs and content
   */
  app.get("/api/topics/:topicId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessonsByTopic(req.params.topicId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lessons" });
    }
  });

  /**
   * GET /api/lessons/:id - Get specific lesson content
   * Returns: Lesson with video URL, duration, and rich text content
   */
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lesson" });
    }
  });

  // Quiz routes
  app.get("/api/topics/:topicId/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByTopic(req.params.topicId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quizzes" });
    }
  });

  app.get("/api/lessons/:lessonId/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByLesson(req.params.lessonId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quizzes" });
    }
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz" });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.get("/api/users/:userId/topics/:topicId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserTopicProgress(req.params.userId, req.params.topicId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get topic progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  app.put("/api/progress/:id", async (req, res) => {
    try {
      const updates = req.body;
      const progress = await storage.updateUserProgress(req.params.id, updates);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userAchievements = await storage.getUserAchievements(req.params.userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements" });
    }
  });

  // Dashboard stats route
  app.get("/api/users/:userId/dashboard", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await storage.getUser(userId);
      const topics = await storage.getAllTopics();
      const userProgress = await storage.getUserProgress(userId);
      const userAchievements = await storage.getUserAchievements(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const completedTopics = userProgress.filter(p => p.isCompleted && !p.lessonId).length;
      const totalTopics = topics.length;
      const averageScore = userProgress.length > 0 
        ? Math.round(userProgress.filter(p => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / userProgress.filter(p => p.score).length)
        : 0;

      const dashboard = {
        user,
        stats: {
          completedTopics: `${completedTopics}/${totalTopics}`,
          quizAverage: `${averageScore}%`,
          studyTime: `${Math.floor(user.studyTimeMinutes / 60)}h ${user.studyTimeMinutes % 60}m`,
          achievements: userAchievements.length,
        },
        recentAchievements: userAchievements.slice(0, 3),
        topics,
        currentProgress: userProgress,
      };

      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
