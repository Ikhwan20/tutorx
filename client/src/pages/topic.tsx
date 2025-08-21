import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, BookOpen, Star } from "lucide-react";
import { Link } from "wouter";
import type { Topic, Lesson } from "@shared/schema";

export default function Topic() {
  const [, params] = useRoute("/topics/:id");
  const [, lessonParams] = useRoute("/topics/:topicId/lessons/:lessonId");
  
  const topicId = params?.id || lessonParams?.topicId;
  const lessonId = lessonParams?.lessonId;
  const userId = "user-1";

  const { data: user } = useQuery({
    queryKey: ["/api/users", userId],
  });

  const { data: topic, isLoading: topicLoading } = useQuery<Topic>({
    queryKey: ["/api/topics", topicId],
    enabled: !!topicId,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/topics", topicId, "lessons"],
    enabled: !!topicId,
  });

  const { data: currentLesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: ["/api/lessons", lessonId],
    enabled: !!lessonId,
  });

  const isLoading = topicLoading || lessonsLoading || (lessonId && lessonLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={{ name: "Ahmad", points: 1250 }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading topic...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={{ name: "Ahmad", points: 1250 }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Topic not found</p>
            <Link href="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If viewing a specific lesson
  if (lessonId && currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user || { name: "Ahmad", points: 1250 }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/topics/${topicId}`}>
              <Button variant="ghost" size="sm" data-testid="button-back-topic">
                {topic.title}
              </Button>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600" data-testid="current-lesson-title">{currentLesson.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl" data-testid="lesson-title">{currentLesson.title}</CardTitle>
                  <p className="text-gray-600" data-testid="lesson-description">{currentLesson.description}</p>
                </CardHeader>
                <CardContent>
                  <VideoPlayer
                    videoUrl={currentLesson.videoUrl || undefined}
                    title={currentLesson.title}
                    duration={currentLesson.videoDuration || 300}
                    onProgress={(progress) => console.log('Video progress:', progress)}
                    onComplete={() => console.log('Video completed')}
                  />
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Lesson Content</h3>
                    <div className="prose max-w-none">
                      <p data-testid="lesson-content">{currentLesson.content}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" data-testid="button-previous-lesson">
                      Previous Lesson
                    </Button>
                    <Link href={`/quiz/quadratic-quiz-1`}>
                      <Button data-testid="button-take-quiz">
                        Take Quiz
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Topic Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Topic Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2" data-testid="topic-title">{topic.title}</h4>
                  <p className="text-sm text-gray-600 mb-4" data-testid="topic-description">{topic.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{topic.lessonsCount} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{Math.floor(topic.estimatedMinutes / 60)}h {topic.estimatedMinutes % 60}m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{(topic.rating / 10).toFixed(1)} rating</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lessons?.map((lesson, index) => (
                      <Link key={lesson.id} href={`/topics/${topicId}/lessons/${lesson.id}`}>
                        <div className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          lesson.id === lessonId 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'hover:bg-gray-50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              lesson.id === lessonId 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium" data-testid={`lesson-${lesson.id}-title`}>{lesson.title}</p>
                              <p className="text-xs text-gray-500">
                                {lesson.videoDuration ? `${Math.floor(lesson.videoDuration / 60)}:${(lesson.videoDuration % 60).toString().padStart(2, '0')}` : '5:00'}
                              </p>
                            </div>
                            {lesson.id === lessonId && (
                              <Play className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Topic overview page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user || { name: "Ahmad", points: 1250 }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600" data-testid="topic-breadcrumb">{topic.title}</span>
        </div>

        {/* Topic Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-4 rounded-xl">
                <i className={`${topic.iconClass} text-primary text-2xl`}></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900" data-testid="topic-header-title">{topic.title}</h1>
                <p className="text-gray-600 mt-2" data-testid="topic-header-description">{topic.description}</p>
              </div>
            </div>
            <Badge variant={topic.difficulty === 'advanced' ? 'destructive' : 'secondary'}>
              {topic.difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>{topic.lessonsCount} lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(topic.estimatedMinutes / 60)}h {topic.estimatedMinutes % 60}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>{(topic.rating / 10).toFixed(1)} rating</span>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons?.map((lesson, index) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900" data-testid={`lesson-card-${lesson.id}-title`}>{lesson.title}</h3>
                    <p className="text-sm text-gray-500">
                      {lesson.videoDuration ? `${Math.floor(lesson.videoDuration / 60)}:${(lesson.videoDuration % 60).toString().padStart(2, '0')}` : '5:00'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4" data-testid={`lesson-card-${lesson.id}-description`}>{lesson.description}</p>
                <Link href={`/topics/${topicId}/lessons/${lesson.id}`}>
                  <Button className="w-full" data-testid={`button-start-lesson-${lesson.id}`}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Lesson
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
