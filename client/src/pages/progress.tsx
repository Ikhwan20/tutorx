import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, TrendingUp, Calendar, BookOpen, Star } from "lucide-react";
import type { User, Topic, UserProgress } from "@shared/schema";

export default function ProgressPage() {
  const userId = "user-1";

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", userId],
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", userId, "progress"],
  });

  const calculateOverallStats = () => {
    const totalTopics = topics.length;
    const completedTopics = topics.filter(topic => 
      userProgress.some(p => p.topicId === topic.id && p.isCompleted)
    ).length;
    
    const totalLessons = topics.reduce((sum, topic) => sum + topic.lessonsCount, 0);
    const completedLessons = userProgress.filter(p => p.isCompleted).length;
    
    const averageScore = userProgress.length > 0 
      ? Math.round(userProgress.filter(p => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / userProgress.filter(p => p.score).length)
      : 0;

    const totalStudyTime = user?.studyTimeMinutes || 0;
    
    return {
      topicsProgress: (completedTopics / totalTopics) * 100,
      lessonsProgress: (completedLessons / totalLessons) * 100,
      completedTopics,
      totalTopics,
      completedLessons,
      totalLessons,
      averageScore,
      totalStudyTime,
    };
  };

  const getTopicProgress = (topic: Topic) => {
    const topicProgressEntries = userProgress.filter(p => p.topicId === topic.id);
    const completed = topicProgressEntries.filter(p => p.isCompleted).length;
    const isCompleted = completed > 0;
    const averageScore = topicProgressEntries.length > 0 
      ? Math.round(topicProgressEntries.filter(p => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / topicProgressEntries.filter(p => p.score).length)
      : 0;
    
    return {
      completed,
      total: topic.lessonsCount,
      percentage: (completed / topic.lessonsCount) * 100,
      isCompleted,
      averageScore: topicProgressEntries.filter(p => p.score).length > 0 ? averageScore : null,
    };
  };

  const getRecentActivity = () => {
    return userProgress
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5)
      .map(progress => {
        const topic = topics.find(t => t.id === progress.topicId);
        return {
          ...progress,
          topicTitle: topic?.title || 'Unknown Topic',
          topicColor: topic?.colorClass || 'gray',
        };
      });
  };

  const getLevelProgress = () => {
    if (!user) return { current: 0, total: 1000, percentage: 0, nextLevel: 2 };
    
    const baseXP = 1000;
    const currentLevelXP = (user.level - 1) * baseXP;
    const nextLevelXP = user.level * baseXP;
    const currentProgress = user.points - currentLevelXP;
    const progressPercentage = (currentProgress / baseXP) * 100;
    
    return {
      current: Math.max(0, currentProgress),
      total: baseXP,
      percentage: Math.min(Math.max(0, progressPercentage), 100),
      nextLevel: user.level + 1,
    };
  };

  const stats = calculateOverallStats();
  const recentActivity = getRecentActivity();
  const levelProgress = getLevelProgress();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user || { name: "Ahmad", points: 1250 }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h1>
          <p className="text-gray-600">Track your achievements and identify areas for improvement</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Topics Mastered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedTopics}/{stats.totalTopics}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lessons Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedLessons}/{stats.totalLessons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Study Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(stats.totalStudyTime)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Progress Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Level Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">
                      Level {user?.level || 1}
                    </span>
                    <span className="text-sm text-gray-600">
                      {levelProgress.current}/{levelProgress.total} XP
                    </span>
                  </div>
                  <Progress value={levelProgress.percentage} className="h-3" />
                  <p className="text-sm text-gray-500 mt-1">
                    {levelProgress.total - levelProgress.current} XP to Level {levelProgress.nextLevel}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Topic Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Topic Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topics.map((topic) => {
                    const progress = getTopicProgress(topic);
                    
                    return (
                      <div key={topic.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                            <p className="text-sm text-gray-600">
                              {progress.completed}/{progress.total} lessons completed
                            </p>
                          </div>
                          <div className="text-right">
                            {progress.isCompleted && (
                              <Badge variant="secondary" className="mb-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {progress.averageScore && (
                              <p className="text-sm text-gray-600">
                                Avg: {progress.averageScore}%
                              </p>
                            )}
                          </div>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.score && activity.score >= 80 
                            ? 'bg-green-500' 
                            : activity.score && activity.score >= 60
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.topicTitle}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              {activity.completedAt && formatDate(activity.completedAt)}
                            </p>
                            {activity.score && (
                              <span className="text-xs text-gray-600">
                                {activity.score}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card>
              <CardHeader>
                <CardTitle>Study Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {user?.streak || 0}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Days in a row</p>
                  <p className="text-xs text-gray-500">
                    Keep learning daily to maintain your streak!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Strong Areas</span>
                    <Badge variant="secondary">Functions</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Needs Practice</span>
                    <Badge variant="outline">Logarithms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Study Goal</span>
                    <span className="text-sm font-medium">30 min/day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}