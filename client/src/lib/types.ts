export interface DashboardData {
  user: {
    id: string;
    name: string;
    level: number;
    points: number;
    streak: number;
    studyTimeMinutes: number;
  };
  stats: {
    completedTopics: string;
    quizAverage: string;
    studyTime: string;
    achievements: number;
  };
  recentAchievements: Array<{
    id: string;
    achievement: {
      title: string;
      description: string;
      iconClass: string;
      colorClass: string;
    };
  }>;
  topics: Array<{
    id: string;
    title: string;
    description: string;
    lessonsCount: number;
    estimatedMinutes: number;
    rating: number;
    iconClass: string;
    colorClass: string;
    isLocked: boolean;
  }>;
  currentProgress: Array<{
    topicId: string;
    isCompleted: boolean;
    score?: number;
  }>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TopicWithProgress {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  estimatedMinutes: number;
  rating: number;
  iconClass: string;
  colorClass: string;
  isLocked: boolean;
  isCompleted: boolean;
  isInProgress: boolean;
  completedLessons: number;
}
