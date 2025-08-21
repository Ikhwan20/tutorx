import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Quiz } from "@shared/schema";
import type { QuizQuestion } from "@/lib/types";

export default function QuizPage() {
  const [, params] = useRoute("/quiz/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const quizId = params?.id;
  const userId = "user-1";

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const { data: user } = useQuery({
    queryKey: ["/api/users", userId],
  });

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ["/api/quizzes", quizId],
    enabled: !!quizId,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: Record<number, number>) => {
      return apiRequest("POST", "/api/progress", {
        userId,
        topicId: quiz?.topicId,
        lessonId: quiz?.lessonId,
        isCompleted: true,
        score: Math.round((score / questions.length) * 100),
        timeSpent: quiz?.timeLimit ? quiz.timeLimit - (timeRemaining || 0) : 300,
        completedAt: new Date(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Quiz Completed!",
        description: `You scored ${Math.round((score / questions.length) * 100)}%`,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={{ name: "Ahmad", points: 1250 }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={{ name: "Ahmad", points: 1250 }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Quiz not found</p>
            <Link href="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const questions = quiz.questions as QuizQuestion[];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setIsSubmitted(true);
    submitQuizMutation.mutate(selectedAnswers);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Results view
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user || { name: "Ahmad", points: 1250 }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-gray-900">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="text-6xl font-bold text-primary mb-4" data-testid="quiz-score">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-gray-600 text-lg">
                  You got {score} out of {questions.length} questions correct
                </p>
              </div>

              {/* Question Review */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-left">Question Review</h3>
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <Card key={question.id} className="text-left">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                            isCorrect ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-2" data-testid={`review-question-${index}`}>
                              {question.question}
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Your answer:</span>{" "}
                                <span className={userAnswer !== undefined ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-gray-500'}>
                                  {userAnswer !== undefined ? question.options[userAnswer] : 'No answer selected'}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm">
                                  <span className="font-medium">Correct answer:</span>{" "}
                                  <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-center space-x-4">
                <Link href="/">
                  <Button variant="outline">Return to Dashboard</Button>
                </Link>
                <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user || { name: "Ahmad", points: 1250 }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600" data-testid="quiz-title">{quiz.title}</span>
          </div>
          
          {quiz.timeLimit && timeRemaining !== null && (
            <div className="flex items-center space-x-2 text-primary">
              <Clock className="w-4 h-4" />
              <span className="font-medium" data-testid="quiz-timer">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl" data-testid="question-text">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  data-testid={`answer-option-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestionIndex] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                data-testid="button-previous-question"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                data-testid={isLastQuestion ? "button-submit-quiz" : "button-next-question"}
              >
                {isLastQuestion ? "Submit Quiz" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Info */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Points Reward: <Badge variant="secondary">+{quiz.pointsReward} XP</Badge></span>
              {quiz.timeLimit && (
                <span>Time Limit: {Math.floor(quiz.timeLimit / 60)} minutes</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
