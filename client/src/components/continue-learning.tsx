import { Play } from "lucide-react";
import { Link } from "wouter";

interface ContinueLearningProps {
  currentLesson?: {
    id: string;
    topicId: string;
    title: string;
    description: string;
    videoDuration: number;
    topicTitle: string;
    progress: {
      completed: number;
      total: number;
      percentage: number;
    };
  };
}

export function ContinueLearning({ currentLesson }: ContinueLearningProps) {
  if (!currentLesson) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">All Caught Up!</h3>
          <p className="text-gray-600 mb-4">You've completed all available lessons. Check back for new content!</p>
          <Link href="/topics">
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors" data-testid="button-explore-topics">
              Explore Topics
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} minutes`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Continue Learning</h3>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">In Progress</span>
        </div>
        
        {/* Featured Video Lesson */}
        <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
            <div className="text-center">
              <div className="bg-white rounded-full p-4 mb-3 inline-block shadow-lg">
                <Play className="text-primary text-2xl w-8 h-8" />
              </div>
              <p className="text-gray-700 font-medium" data-testid="current-lesson-title">{currentLesson.title}</p>
              <p className="text-gray-500 text-sm" data-testid="lesson-duration">{formatDuration(currentLesson.videoDuration)}</p>
            </div>
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentLesson.topicTitle}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900" data-testid="lesson-topic-title">{currentLesson.topicTitle}</h4>
            <p className="text-gray-600 text-sm" data-testid="lesson-description">{currentLesson.description}</p>
          </div>
          <Link href={`/topics/${currentLesson.topicId}/lessons/${currentLesson.id}`}>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors" data-testid="button-continue-lesson">
              Continue
            </button>
          </Link>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span data-testid="lesson-progress">{currentLesson.progress.completed}/{currentLesson.progress.total} lessons completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-500" 
              style={{ width: `${currentLesson.progress.percentage}%` }}
              data-testid="lesson-progress-bar"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
