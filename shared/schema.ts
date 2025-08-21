/**
 * DATABASE SCHEMA FOR TUTORX LEARNING PLATFORM
 * 
 * This file defines the complete database structure for the Malaysian Form 4 
 * Additional Mathematics learning platform with gamification features.
 * 
 * Key Features:
 * - User management with gamification (points, levels, streaks)
 * - Topic-based learning structure with lessons
 * - Interactive quiz system with scoring
 * - Achievement system for student motivation
 * - Progress tracking for analytics
 */

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =====================================================================
// USERS TABLE - Core user data and gamification metrics
// =====================================================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),     // Auto-generated UUID
  username: text("username").notNull().unique(),                      // Login username
  email: text("email").notNull().unique(),                           // User email address
  name: text("name").notNull(),                                       // Display name
  level: integer("level").notNull().default(1),                      // Current user level (starts at 1)
  points: integer("points").notNull().default(0),                    // Gamification points/XP
  streak: integer("streak").notNull().default(0),                    // Daily study streak counter
  studyTimeMinutes: integer("study_time_minutes").notNull().default(0), // Total study time tracked
  createdAt: timestamp("created_at").defaultNow(),                   // Account creation timestamp
});

// =====================================================================
// TOPICS TABLE - Main subject areas (e.g., Functions, Quadratic Functions)
// =====================================================================
export const topics = pgTable("topics", {
  id: varchar("id").primaryKey(),                                     // Topic identifier (e.g., "functions")
  title: text("title").notNull(),                                     // Display name (e.g., "Functions and Graphs")
  description: text("description").notNull(),                         // Topic overview for students
  difficulty: text("difficulty").notNull(),                           // "beginner", "intermediate", "advanced"
  estimatedMinutes: integer("estimated_minutes").notNull(),           // Expected time to complete all lessons
  lessonsCount: integer("lessons_count").notNull(),                   // Number of lessons in this topic
  rating: integer("rating").notNull().default(50),                   // Student rating out of 50 (5.0 * 10)
  iconClass: text("icon_class").notNull(),                           // CSS icon class for UI display
  colorClass: text("color_class").notNull(),                         // Theme color for topic branding
  order: integer("order").notNull(),                                  // Display order on topics page
  isLocked: boolean("is_locked").notNull().default(false),           // Prerequisites lock status
});

// =====================================================================
// LESSONS TABLE - Individual learning units within topics
// =====================================================================
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey(),                                     // Lesson identifier (e.g., "quadratic-1")
  topicId: varchar("topic_id").notNull(),                            // Parent topic reference
  title: text("title").notNull(),                                     // Lesson title for display
  description: text("description").notNull(),                         // Brief lesson overview
  videoUrl: text("video_url"),                                       // YouTube or educational video URL
  videoDuration: integer("video_duration"),                          // Video length in seconds
  content: text("content").notNull(),                                // Rich text lesson content
  order: integer("order").notNull(),                                  // Display order within topic
});

// =====================================================================
// QUIZZES TABLE - Assessment and knowledge testing
// =====================================================================
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey(),                                     // Quiz identifier
  lessonId: varchar("lesson_id"),                                    // Associated lesson (optional)
  topicId: varchar("topic_id"),                                      // Associated topic (optional)
  title: text("title").notNull(),                                     // Quiz display name
  description: text("description").notNull(),                         // Quiz instructions/description
  questions: jsonb("questions").notNull(),                           // JSON array of quiz questions with answers
  pointsReward: integer("points_reward").notNull().default(50),      // XP points awarded for completion
  timeLimit: integer("time_limit"),                                  // Optional time limit in seconds
});

// =====================================================================
// USER PROGRESS TABLE - Tracks student completion and performance
// =====================================================================
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),     // Auto-generated progress ID
  userId: varchar("user_id").notNull(),                              // Student reference
  topicId: varchar("topic_id").notNull(),                            // Completed topic reference
  lessonId: varchar("lesson_id"),                                    // Completed lesson reference (optional)
  isCompleted: boolean("is_completed").notNull().default(false),     // Completion status
  score: integer("score"),                                           // Quiz/assessment score (percentage)
  timeSpent: integer("time_spent"),                                  // Time spent in seconds
  completedAt: timestamp("completed_at"),                            // Completion timestamp for analytics
});

// =====================================================================
// ACHIEVEMENTS TABLE - Gamification rewards and milestones
// =====================================================================
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),                                     // Achievement identifier
  title: text("title").notNull(),                                     // Achievement display name
  description: text("description").notNull(),                         // Achievement description for students
  iconClass: text("icon_class").notNull(),                           // CSS icon class for display
  colorClass: text("color_class").notNull(),                         // Color theme for achievement badge
  requirement: text("requirement").notNull(),                         // Text description of unlock requirement
  pointsReward: integer("points_reward").notNull().default(100),     // XP points awarded when unlocked
});

// =====================================================================
// USER ACHIEVEMENTS TABLE - Junction table for unlocked rewards
// =====================================================================
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),     // Auto-generated junction ID
  userId: varchar("user_id").notNull(),                              // Student who unlocked achievement
  achievementId: varchar("achievement_id").notNull(),                // Achievement that was unlocked
  unlockedAt: timestamp("unlocked_at").defaultNow(),                 // When achievement was earned
});

// =====================================================================
// ZOD SCHEMAS FOR VALIDATION - Input validation for API endpoints
// =====================================================================

// User input schemas (omit auto-generated fields)
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,        // Auto-generated UUID
  createdAt: true, // Auto-generated timestamp
});

// Schema definitions for data validation
export const insertTopicSchema = createInsertSchema(topics);
export const insertLessonSchema = createInsertSchema(lessons);
export const insertQuizSchema = createInsertSchema(quizzes);
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,        // Auto-generated UUID
});
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,        // Auto-generated UUID
});

// =====================================================================
// TYPESCRIPT TYPES - Type safety for frontend/backend communication
// =====================================================================

// Insert types for creating new records
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

// Select types for reading existing records (includes all fields)
export type User = typeof users.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
