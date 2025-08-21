import { Check } from "lucide-react";

interface StudyPlanItem {
  id: string;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  order: number;
}

interface StudyPlanProps {
  studyPlan: StudyPlanItem[];
}

export function StudyPlan({ studyPlan }: StudyPlanProps) {
  const defaultStudyPlan: StudyPlanItem[] = [
    {
      id: "1",
      title: "Complete Quadratic Functions",
      subtitle: "Video + Quiz",
      isCompleted: true,
      order: 1,
    },
    {
      id: "2",
      title: "Review Functions Domain",
      subtitle: "Practice Problems",
      isCompleted: false,
      order: 2,
    },
    {
      id: "3",
      title: "Take Weekly Quiz",
      subtitle: "15 minutes",
      isCompleted: false,
      order: 3,
    },
  ];

  const planToShow = studyPlan.length > 0 ? studyPlan : defaultStudyPlan;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Study Plan</h3>
      
      <div className="space-y-3">
        {planToShow.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              item.isCompleted ? 'bg-secondary/10' : 'bg-gray-50'
            }`}
            data-testid={`study-plan-item-${item.id}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              item.isCompleted 
                ? 'bg-secondary'
                : item.order === 2 
                  ? 'bg-primary' 
                  : 'bg-gray-300'
            }`}>
              {item.isCompleted ? (
                <Check className="text-white text-xs w-3 h-3" />
              ) : (
                <span className="text-white text-xs font-bold">{item.order}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm" data-testid={`study-plan-title-${item.id}`}>
                {item.title}
              </p>
              <p className="text-xs text-gray-600" data-testid={`study-plan-subtitle-${item.id}`}>
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
