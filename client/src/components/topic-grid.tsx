import { Star, Check, Loader2, Lock } from "lucide-react";
import { Link } from "wouter";
import type { TopicWithProgress } from "@/lib/types";

interface TopicGridProps {
  topics: TopicWithProgress[];
}

export function TopicGrid({ topics }: TopicGridProps) {
  const getColorClasses = (colorClass: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      primary: "bg-primary/10 text-primary",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
    };
    return colorMap[colorClass as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  };

  const getBadgeColor = (colorClass: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      primary: "bg-accent/10 text-accent",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
    };
    return colorMap[colorClass as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  };

  const getStatusIcon = (topic: TopicWithProgress) => {
    if (topic.isLocked) {
      return (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <Lock className="text-gray-400 text-sm w-4 h-4" />
        </div>
      );
    }
    
    if (topic.isCompleted) {
      return (
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <Check className="text-white text-sm w-4 h-4" />
        </div>
      );
    }
    
    if (topic.isInProgress) {
      return (
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center relative">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      );
    }

    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <Lock className="text-gray-400 text-sm w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Form 4 Additional Mathematics Topics</h3>
        <Link href="/topics">
          <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium" data-testid="button-view-all-topics">
            View All Topics
          </button>
        </Link>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`border border-gray-200 rounded-xl p-4 transition-all duration-200 ${
              topic.isLocked 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:border-primary/30 hover:shadow-md cursor-pointer'
            }`}
            data-testid={`topic-card-${topic.id}`}
          >
            {topic.isLocked ? (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getColorClasses(topic.colorClass)}`}>
                    <i className={topic.iconClass}></i>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="text-accent text-sm w-4 h-4" />
                    <span className="text-sm text-gray-600">{(topic.rating / 10).toFixed(1)}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2" data-testid={`topic-title-${topic.id}`}>{topic.title}</h4>
                <p className="text-gray-600 text-sm mb-3" data-testid={`topic-description-${topic.id}`}>{topic.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(topic.colorClass)}`}>
                      {topic.lessonsCount} lessons
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {Math.floor(topic.estimatedMinutes / 60)}h {topic.estimatedMinutes % 60}m
                    </span>
                  </div>
                  {getStatusIcon(topic)}
                </div>
              </div>
            ) : (
              <Link href={`/topics/${topic.id}`}>
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(topic.colorClass)}`}>
                      <i className={topic.iconClass}></i>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="text-accent text-sm w-4 h-4" />
                      <span className="text-sm text-gray-600">{(topic.rating / 10).toFixed(1)}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2" data-testid={`topic-title-${topic.id}`}>{topic.title}</h4>
                  <p className="text-gray-600 text-sm mb-3" data-testid={`topic-description-${topic.id}`}>{topic.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(topic.colorClass)}`}>
                        {topic.lessonsCount} lessons
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {Math.floor(topic.estimatedMinutes / 60)}h {topic.estimatedMinutes % 60}m
                      </span>
                    </div>
                    {getStatusIcon(topic)}
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
