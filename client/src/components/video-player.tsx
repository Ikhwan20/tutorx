import { Play, Pause, Volume2, Maximize } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  duration: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ videoUrl, title, duration, onProgress, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setCurrentTime(video.currentTime);
      onProgress?.(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekTime = (clickX / rect.width) * video.duration;
    video.currentTime = seekTime;
  };

  // If no video URL provided, show placeholder with play button
  if (!videoUrl) {
    return (
      <div className="bg-gray-100 rounded-xl overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
          <div className="text-center">
            <div className="bg-white rounded-full p-4 mb-3 inline-block shadow-lg cursor-pointer" onClick={togglePlay} data-testid="video-play-button">
              <Play className="text-primary text-2xl w-8 h-8" />
            </div>
            <p className="text-gray-700 font-medium" data-testid="video-title">{title}</p>
            <p className="text-gray-500 text-sm" data-testid="video-duration">{formatTime(duration)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl overflow-hidden relative group">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        poster=""
        data-testid="video-element"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors"
          data-testid="video-control-button"
        >
          {isPlaying ? (
            <Pause className="text-black w-8 h-8" />
          ) : (
            <Play className="text-black w-8 h-8" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
        <div className="flex items-center space-x-4">
          <button onClick={togglePlay} className="text-white" data-testid="video-play-pause">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <div className="flex-1">
            <div
              className="w-full h-2 bg-white/30 rounded-full cursor-pointer"
              onClick={handleSeek}
              data-testid="video-progress-bar"
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
          
          <span className="text-white text-sm" data-testid="video-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <Volume2 className="text-white w-5 h-5" />
          <Maximize className="text-white w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
