interface WelcomeHeaderProps {
  user: {
    name: string;
    level: number;
    streak: number;
    points: number;
  };
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getLevelProgress = () => {
    const baseXP = 1000;
    const currentLevelXP = (user.level - 1) * baseXP;
    const nextLevelXP = user.level * baseXP;
    const currentProgress = user.points - currentLevelXP;
    const progressPercentage = (currentProgress / baseXP) * 100;
    
    return {
      current: currentProgress,
      total: baseXP,
      percentage: Math.min(progressPercentage, 100),
    };
  };

  const levelProgress = getLevelProgress();

  return (
    <div className="mb-8">
      <div className="gradient-primary rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="welcome-greeting">
              {getGreeting()}, {user.name}!
            </h2>
            <p className="text-indigo-100 mb-4 sm:mb-0">
              Ready to level up your Additional Mathematics skills today?
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="user-level">Level {user.level}</div>
              <div className="text-sm text-indigo-200">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="user-streak">{user.streak}</div>
              <div className="text-sm text-indigo-200">Day Streak</div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-indigo-200 mb-2">
            <span>Progress to Level {user.level + 1}</span>
            <span data-testid="level-progress">{levelProgress.current}/{levelProgress.total} XP</span>
          </div>
          <div className="w-full bg-indigo-400 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500" 
              style={{ width: `${levelProgress.percentage}%` }}
              data-testid="progress-bar"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
