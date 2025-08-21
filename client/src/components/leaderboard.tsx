import { Crown, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  position: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
}

export function Leaderboard({ leaderboard, currentUserId }: LeaderboardProps) {
  const defaultLeaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Sarah Chen",
      points: 2450,
      position: 1,
    },
    {
      id: currentUserId,
      name: "You",
      points: 1250,
      position: 2,
      isCurrentUser: true,
    },
    {
      id: "3",
      name: "Ali Rahman",
      points: 1180,
      position: 3,
    },
    {
      id: "4",
      name: "Mei Ling",
      points: 980,
      position: 4,
    },
  ];

  const leaderboardToShow = leaderboard.length > 0 ? leaderboard : defaultLeaderboard;

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-accent";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-gray-300";
    }
  };

  const getPositionTextColor = (position: number) => {
    switch (position) {
      case 1:
      case 2:
      case 3:
        return "text-white";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Class Leaderboard</h3>
      
      <div className="space-y-3">
        {leaderboardToShow.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center space-x-3"
            data-testid={`leaderboard-entry-${entry.position}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPositionColor(entry.position)}`}>
              <span className={`font-bold text-sm ${getPositionTextColor(entry.position)}`}>
                {entry.position}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900" data-testid={`leaderboard-name-${entry.position}`}>
                {entry.name}
              </p>
              <p className="text-sm text-gray-600" data-testid={`leaderboard-points-${entry.position}`}>
                {entry.points.toLocaleString()} XP
              </p>
            </div>
            {entry.position === 1 && (
              <Crown className="text-accent w-5 h-5" />
            )}
            {entry.isCurrentUser && entry.position === 2 && (
              <TrendingUp className="text-secondary w-5 h-5" />
            )}
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-primary hover:text-primary/80 transition-colors text-sm font-medium" data-testid="button-view-full-leaderboard">
        View Full Leaderboard
      </button>
    </div>
  );
}
