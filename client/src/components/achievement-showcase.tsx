interface Achievement {
  id: string;
  achievement: {
    title: string;
    description: string;
    iconClass: string;
    colorClass: string;
  };
}

interface AchievementShowcaseProps {
  achievements: Achievement[];
}

export function AchievementShowcase({ achievements }: AchievementShowcaseProps) {
  const getColorClasses = (colorClass: string) => {
    const colorMap = {
      accent: "bg-accent/10 text-accent",
      secondary: "bg-secondary/10 text-secondary",
      purple: "bg-purple-100 text-purple-600",
    };
    return colorMap[colorClass as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  };

  const getBgColorClasses = (colorClass: string) => {
    const colorMap = {
      accent: "bg-accent",
      secondary: "bg-secondary",
      purple: "bg-purple-500",
    };
    return colorMap[colorClass as keyof typeof colorMap] || "bg-gray-500";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
      
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center space-x-3 p-3 rounded-lg ${getColorClasses(achievement.achievement.colorClass)}`}
            data-testid={`achievement-${achievement.id}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColorClasses(achievement.achievement.colorClass)}`}>
              <i className={`${achievement.achievement.iconClass} text-white`}></i>
            </div>
            <div>
              <p className="font-medium text-gray-900" data-testid={`achievement-title-${achievement.id}`}>
                {achievement.achievement.title}
              </p>
              <p className="text-sm text-gray-600" data-testid={`achievement-description-${achievement.id}`}>
                {achievement.achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-primary hover:text-primary/80 transition-colors text-sm font-medium" data-testid="button-view-all-achievements">
        View All Achievements
      </button>
    </div>
  );
}
