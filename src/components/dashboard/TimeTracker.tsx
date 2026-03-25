"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square } from "lucide-react";
import { toast } from "sonner";

export default function TimeTracker() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
  
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
      toast.success("Timer started");
    } else {
      setIsPaused(!isPaused);
      toast.info(isPaused ? "Timer resumed" : "Timer paused");
    }
  };

  const stopTimer = () => {
    if (!isActive && time === 0) return;
    
    setIsActive(false);
    setIsPaused(false);
    // In a real app we would call an API here to save the session
    toast.success(`Session saved! Total time: ${formatTime(time)}`);
    setTime(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#052e16] rounded-2xl p-6 relative overflow-hidden shadow-md h-full flex flex-col justify-between">
      {/* Decorative background waves mimicking the image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% -20%, #4ade80 0%, transparent 40%), radial-gradient(circle at 100% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 0% 100%, #16a34a 0%, transparent 50%)'
      }}></div>

      <div className="relative z-10">
        <h3 className="font-medium text-white/90 text-lg mb-2">Time Tracker</h3>
        <p className="text-5xl font-light tracking-tight text-white mb-8 mt-4 tabular-nums text-center">
          {formatTime(time)}
        </p>
      </div>

      <div className="relative z-10 flex justify-center gap-4 mt-auto">
        <button 
          onClick={toggleTimer}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#166534] hover:bg-gray-100 transition-colors shadow-sm"
        >
          {isActive && !isPaused ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-1" />
          )}
        </button>
        <button 
          onClick={stopTimer}
          disabled={!isActive}
          className={`w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white transition-colors shadow-sm ${!isActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
