import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { WelcomeHeader } from "@/components/welcome-header";
import { QuickStats } from "@/components/quick-stats";
import { ContinueLearning } from "@/components/continue-learning";
import { TopicGrid } from "@/components/topic-grid";
import { AchievementShowcase } from "@/components/achievement-showcase";
import { StudyPlan } from "@/components/study-plan";
import { Leaderboard } from "@/components/leaderboard";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import type { DashboardData, TopicWithProgress } from "@/lib/types";

export default function Dashboard() {
  const userId = "user-1"; // In a real app, this would come from auth context

  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/users", userId, "dashboard"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load dashboard data</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // Transform topics with progress information
  const topicsWithProgress: TopicWithProgress[] = dashboardData.topics.map(topic => {
    const topicProgress = dashboardData.currentProgress.filter(p => p.topicId === topic.id);
    const completedLessons = topicProgress.filter(p => p.isCompleted).length;
    const isCompleted = topicProgress.some(p => p.isCompleted);
    const isInProgress = topicProgress.length > 0 && !isCompleted;

    return {
      ...topic,
      isCompleted,
      isInProgress,
      completedLessons,
    };
  });

  // Find current lesson for continue learning section
  const currentLesson = dashboardData.topics
    .filter(topic => !topic.isLocked)
    .find(topic => {
      const progress = dashboardData.currentProgress.filter(p => p.topicId === topic.id);
      return progress.length > 0 && !progress.some(p => p.isCompleted);
    });

  const continueProps = currentLesson ? {
    id: "quadratic-3",
    topicId: currentLesson.id,
    title: "Vertex Form Transformations",
    description: "Understanding vertex form transformations",
    videoDuration: 332,
    topicTitle: currentLesson.title,
    progress: {
      completed: 3,
      total: currentLesson.lessonsCount,
      percentage: (3 / currentLesson.lessonsCount) * 100,
    },
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={dashboardData.user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <WelcomeHeader user={dashboardData.user} />
        <QuickStats stats={dashboardData.stats} />
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <ContinueLearning currentLesson={continueProps} />
            <TopicGrid topics={topicsWithProgress} />
            
            {/* Quick Quiz Challenge */}
            <div className="bg-gradient-to-r from-accent to-orange-400 rounded-2xl p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Quick Quiz Challenge</h3>
                  <p className="text-orange-100 mb-4 sm:mb-0">Test your knowledge with quadratic functions and earn bonus points!</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">+75</div>
                    <div className="text-xs text-orange-200">Bonus XP</div>
                  </div>
                  <Link href="/quiz/quadratic-quiz-1">
                    <Button 
                      className="bg-white text-accent hover:bg-orange-50 font-medium" 
                      data-testid="button-start-quick-quiz"
                    >
                      Start Quiz
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <AchievementShowcase achievements={dashboardData.recentAchievements} />
            <StudyPlan studyPlan={[]} />
            <Leaderboard leaderboard={[]} currentUserId={userId} />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          size="lg"
          className="bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 p-0"
          data-testid="button-quick-help"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
