import { Link, useLocation } from "wouter";
import { GraduationCap, Home, Book, TrendingUp, Trophy, Coins } from "lucide-react";

interface NavigationProps {
  user: {
    name: string;
    points: number;
  };
}

export function Navigation({ user }: NavigationProps) {
  const [location] = useLocation();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-white rounded-lg p-2">
              <GraduationCap className="text-xl w-6 h-6" />
            </div>
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" data-testid="logo-tutorx">TutorX</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className={`font-medium transition-colors cursor-pointer ${location === '/' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`} data-testid="nav-dashboard">
                Dashboard
              </span>
            </Link>
            <Link href="/topics">
              <span className={`font-medium transition-colors cursor-pointer ${location === '/topics' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`} data-testid="nav-topics">
                Topics
              </span>
            </Link>
            <Link href="/progress">
              <span className={`font-medium transition-colors cursor-pointer ${location === '/progress' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`} data-testid="nav-progress">
                Progress
              </span>
            </Link>
            <Link href="/achievements">
              <span className={`font-medium transition-colors cursor-pointer ${location === '/achievements' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`} data-testid="nav-achievements">
                Achievements
              </span>
            </Link>
          </div>
          
          {/* User Profile & Points */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
              <Coins className="text-accent w-4 h-4" />
              <span className="font-semibold text-accent" data-testid="user-points">{user.points}</span>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm" data-testid="user-initials">{getInitials(user.name)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 py-2">
          <Link href="/">
            <div className={`flex flex-col items-center py-2 cursor-pointer ${location === '/' ? 'text-primary' : 'text-gray-500'}`} data-testid="mobile-nav-home">
              <Home className="text-lg w-5 h-5" />
              <span className="text-xs mt-1">Home</span>
            </div>
          </Link>
          <Link href="/topics">
            <div className={`flex flex-col items-center py-2 cursor-pointer ${location === '/topics' ? 'text-primary' : 'text-gray-500'}`} data-testid="mobile-nav-topics">
              <Book className="text-lg w-5 h-5" />
              <span className="text-xs mt-1">Topics</span>
            </div>
          </Link>
          <Link href="/progress">
            <div className={`flex flex-col items-center py-2 cursor-pointer ${location === '/progress' ? 'text-primary' : 'text-gray-500'}`} data-testid="mobile-nav-progress">
              <TrendingUp className="text-lg w-5 h-5" />
              <span className="text-xs mt-1">Progress</span>
            </div>
          </Link>
          <Link href="/achievements">
            <div className={`flex flex-col items-center py-2 cursor-pointer ${location === '/achievements' ? 'text-primary' : 'text-gray-500'}`} data-testid="mobile-nav-achievements">
              <Trophy className="text-lg w-5 h-5" />
              <span className="text-xs mt-1">Awards</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
