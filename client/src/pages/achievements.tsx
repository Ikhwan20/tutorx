import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Lock, CheckCircle, Star, Target, Zap, Crown, Clock } from "lucide-react";
import type { User, Achievement, UserAchievement } from "@shared/schema";

export default function Achievements() {
  const userId = "user-1";

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", userId],
  });

  const { data: allAchievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements = [] } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: ["/api/users", userId, "achievements"],
  });

  const getAchievementStatus = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  };

  const getIconForAchievement = (iconClass: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "fas fa-fire": <Zap className="w-6 h-6" />,
      "fas fa-graduation-cap": <Trophy className="w-6 h-6" />,
      "fas fa-clock": <Clock className="w-6 h-6" />,
      "fas fa-star": <Star className="w-6 h-6" />,
      "fas fa-crown": <Crown className="w-6 h-6" />,
      "fas fa-target": <Target className="w-6 h-6" />,
    };
    return iconMap[iconClass] || <Trophy className="w-6 h-6" />;
  };

  const getColorClasses = (colorClass: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return "bg-gray-100 text-gray-400 border-gray-200";
    }

    const colorMap = {
      accent: "bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-yellow-300",
      secondary: "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300",
      purple: "bg-gradient-to-br from-purple-400 to-indigo-500 text-white border-purple-300",
      primary: "bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-blue-300",
    };
    return colorMap[colorClass as keyof typeof colorMap] || "bg-gradient-to-br from-gray-400 to-gray-500 text-white border-gray-300";
  };

  const categorizeAchievements = () => {
    const categories = {
      study: { title: "Study Mastery", achievements: [] as Achievement[] },
      performance: { title: "Academic Excellence", achievements: [] as Achievement[] },
      engagement: { title: "Learning Engagement", achievements: [] as Achievement[] },
      special: { title: "Special Rewards", achievements: [] as Achievement[] },
    };

    allAchievements.forEach(achievement => {
      if (achievement.requirement.includes('streak')) {
        categories.study.achievements.push(achievement);
      } else if (achievement.requirement.includes('quiz') || achievement.requirement.includes('score')) {
        categories.performance.achievements.push(achievement);
      } else if (achievement.requirement.includes('lessons') || achievement.requirement.includes('time')) {
        categories.engagement.achievements.push(achievement);
      } else {
        categories.special.achievements.push(achievement);
      }
    });

    return categories;
  };

  const calculateProgress = () => {
    const totalAchievements = allAchievements.length;
    const unlockedAchievements = userAchievements.length;
    const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.achievement.pointsReward, 0);
    
    return {
      percentage: totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0,
      unlocked: unlockedAchievements,
      total: totalAchievements,
      points: totalPoints,
    };
  };

  const categories = categorizeAchievements();
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user || { name: "Ahmad", points: 1250 }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Unlock rewards by reaching learning milestones</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{progress.unlocked}/{progress.total}</div>
                <p className="text-indigo-100">Achievements Unlocked</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{Math.round(progress.percentage)}%</div>
                <p className="text-indigo-100">Collection Complete</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{progress.points}</div>
                <p className="text-indigo-100">Achievement Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <div className="space-y-8">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span>{category.title}</span>
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.achievements.map((achievement) => {
                  const isUnlocked = getAchievementStatus(achievement.id);
                  const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
                  
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`transition-all duration-200 ${
                        isUnlocked 
                          ? 'border-yellow-300 shadow-md hover:shadow-lg transform hover:scale-105' 
                          : 'border-gray-200 opacity-75 hover:opacity-90'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Achievement Icon */}
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                            getColorClasses(achievement.colorClass, isUnlocked)
                          }`}>
                            {isUnlocked ? (
                              getIconForAchievement(achievement.iconClass)
                            ) : (
                              <Lock className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          
                          {/* Achievement Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {achievement.title}
                              </h3>
                              {isUnlocked && (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                              )}
                            </div>
                            
                            <p className={`text-sm mb-3 ${
                              isUnlocked ? 'text-gray-600' : 'text-gray-500'
                            }`}>
                              {achievement.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <Badge 
                                variant={isUnlocked ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                +{achievement.pointsReward} XP
                              </Badge>
                              
                              {isUnlocked && userAchievement && (
                                <p className="text-xs text-gray-500">
                                  Unlocked {new Date(userAchievement.unlockedAt!).toLocaleDateString()}
                                </p>
                              )}
                            </div>

                            {isUnlocked && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-green-600 font-medium">
                                  ✓ Achievement Complete
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Keep Going!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🎯 Upcoming Achievements</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Complete 3 more topics to unlock "Topic Master"</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Maintain a 10-day streak for "Consistency Champion"</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Score 95%+ on 3 quizzes for "Perfect Scholar"</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">💡 Achievement Tips</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Study consistently every day to build streaks</p>
                  <p>• Review lessons before taking quizzes for better scores</p>
                  <p>• Set daily goals to stay motivated</p>
                  <p>• Share your progress with friends for accountability</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}