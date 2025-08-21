import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, Loader2, Lock, BookOpen, Clock, Play } from "lucide-react";
import type { Topic, User, UserProgress } from "@shared/schema";

export default function Topics() {
  const userId = "user-1";

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", userId],
  });

  const { data: topics = [], isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", userId, "progress"],
  });

  const getColorClasses = (colorClass: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      primary: "bg-primary/10 text-primary", 
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
    };
    return colorMap[colorClass as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  };

  const getProgressData = (topicId: string) => {
    const topicProgress = userProgress.filter(p => p.topicId === topicId);
    const completed = topicProgress.filter(p => p.isCompleted).length;
    const isCompleted = completed > 0;
    const isInProgress = topicProgress.length > 0 && !isCompleted;
    
    return { completed, isCompleted, isInProgress };
  };

  const getStatusIcon = (topic: Topic) => {
    const { isCompleted, isInProgress } = getProgressData(topic.id);

    if (topic.isLocked) {
      return (
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <Lock className="text-gray-400 w-5 h-5" />
        </div>
      );
    }
    
    if (isCompleted) {
      return (
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <Check className="text-white w-5 h-5" />
        </div>
      );
    }
    
    if (isInProgress) {
      return (
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <Play className="text-primary w-5 h-5" />
      </div>
    );
  };

  if (topicsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user || { name: "Ahmad", points: 1250 }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading topics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user || { name: "Ahmad", points: 1250 }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form 4 Additional Mathematics</h1>
          <p className="text-gray-600">Master the complete curriculum with interactive lessons and assessments</p>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const { completed, isCompleted, isInProgress } = getProgressData(topic.id);
            
            return (
              <Card 
                key={topic.id} 
                className={`transition-all duration-200 ${
                  topic.isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-md cursor-pointer hover:border-primary/30'
                }`}
                data-testid={`topic-card-${topic.id}`}
              >
                {topic.isLocked ? (
                  <div>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg ${getColorClasses(topic.colorClass)}`}>
                          <i className={topic.iconClass}></i>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="text-accent w-4 h-4" />
                          <span className="text-sm text-gray-600">{(topic.rating / 10).toFixed(1)}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl" data-testid={`topic-title-${topic.id}`}>
                        {topic.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4" data-testid={`topic-description-${topic.id}`}>
                        {topic.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="text-gray-500 w-4 h-4" />
                            <span className="text-sm text-gray-600">{topic.lessonsCount} lessons</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="text-gray-500 w-4 h-4" />
                            <span className="text-sm text-gray-600">
                              {Math.floor(topic.estimatedMinutes / 60)}h {topic.estimatedMinutes % 60}m
                            </span>
                          </div>
                        </div>
                        {getStatusIcon(topic)}
                      </div>

                      <Badge variant="secondary" className="mb-4">
                        {topic.difficulty}
                      </Badge>

                      <p className="text-sm text-gray-500">
                        Complete previous topics to unlock this content
                      </p>
                    </CardContent>
                  </div>
                ) : (
                  <Link href={`/topics/${topic.id}`}>
                    <div>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-3 rounded-lg ${getColorClasses(topic.colorClass)}`}>
                            <i className={topic.iconClass}></i>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="text-accent w-4 h-4" />
                            <span className="text-sm text-gray-600">{(topic.rating / 10).toFixed(1)}</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl" data-testid={`topic-title-${topic.id}`}>
                          {topic.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4" data-testid={`topic-description-${topic.id}`}>
                          {topic.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="text-gray-500 w-4 h-4" />
                              <span className="text-sm text-gray-600">{topic.lessonsCount} lessons</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="text-gray-500 w-4 h-4" />
                              <span className="text-sm text-gray-600">
                                {Math.floor(topic.estimatedMinutes / 60)}h {topic.estimatedMinutes % 60}m
                              </span>
                            </div>
                          </div>
                          {getStatusIcon(topic)}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <Badge variant={topic.difficulty === 'advanced' ? 'destructive' : 'secondary'}>
                            {topic.difficulty}
                          </Badge>
                          {isInProgress && (
                            <span className="text-sm text-primary font-medium">
                              {completed}/{topic.lessonsCount} completed
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-sm text-secondary font-medium">
                              ✓ Completed
                            </span>
                          )}
                        </div>

                        <Button className="w-full" data-testid={`button-start-topic-${topic.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          {isCompleted ? 'Review Topic' : isInProgress ? 'Continue Learning' : 'Start Topic'}
                        </Button>
                      </CardContent>
                    </div>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>

        {/* Study Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Study Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">📚 Effective Learning</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Watch each video lesson completely before moving on</li>
                  <li>• Take notes on key formulas and concepts</li>
                  <li>• Practice problems immediately after each lesson</li>
                  <li>• Review previous topics regularly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Quiz Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Attempt quizzes only after completing lessons</li>
                  <li>• Read questions carefully and check your work</li>
                  <li>• Review incorrect answers to understand mistakes</li>
                  <li>• Retake quizzes to improve your score</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}