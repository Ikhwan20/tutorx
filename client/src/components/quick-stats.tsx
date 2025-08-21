import { CheckCircle, Star, Clock, Trophy } from "lucide-react";

interface QuickStatsProps {
  stats: {
    completedTopics: string;
    quizAverage: string;
    studyTime: string;
    achievements: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Topics Completed</p>
            <p className="text-2xl font-bold text-gray-900" data-testid="stat-completed-topics">{stats.completedTopics}</p>
          </div>
          <div className="bg-secondary/10 p-3 rounded-lg">
            <CheckCircle className="text-secondary text-xl w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Quiz Average</p>
            <p className="text-2xl font-bold text-gray-900" data-testid="stat-quiz-average">{stats.quizAverage}</p>
          </div>
          <div className="bg-accent/10 p-3 rounded-lg">
            <Star className="text-accent text-xl w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Study Time</p>
            <p className="text-2xl font-bold text-gray-900" data-testid="stat-study-time">{stats.studyTime}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <Clock className="text-primary text-xl w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Achievements</p>
            <p className="text-2xl font-bold text-gray-900" data-testid="stat-achievements">{stats.achievements}</p>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-lg">
            <Trophy className="text-amber-500 text-xl w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
