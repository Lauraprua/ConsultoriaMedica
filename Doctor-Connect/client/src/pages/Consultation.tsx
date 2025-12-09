import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Settings } from "lucide-react";

export default function Consultation() {
  const { id } = useParams();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-900 text-white">
      {/* Video Area */}
      <div className="flex-1 relative p-4 grid grid-cols-1">
        {/* Main Video Feed (Doctor) */}
        <div className="bg-slate-800 rounded-2xl w-full h-full relative overflow-hidden flex items-center justify-center">
            {videoOn ? (
                 <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center">
                    <p className="text-slate-500 font-medium">Remote Video Feed Simulation</p>
                 </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-3xl font-bold">DR</span>
                    </div>
                    <p className="text-slate-400">Camera is off</p>
                </div>
            )}

            {/* Self View (PIP) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <span className="text-xs text-slate-500">You</span>
                </div>
            </div>

            {/* Call Info Badge */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-sm border border-white/10">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>{formatTime(duration)}</span>
                <span className="mx-1 opacity-50">|</span>
                <span className="font-medium">Dr. Sarah Wilson</span>
            </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-20 bg-slate-950 flex items-center justify-center gap-4 px-4 border-t border-white/10">
        <Button 
            variant={micOn ? "secondary" : "destructive"} 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={() => setMicOn(!micOn)}
        >
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button 
            variant={videoOn ? "secondary" : "destructive"} 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={() => setVideoOn(!videoOn)}
        >
            {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Link href="/">
            <Button 
                variant="destructive" 
                size="icon" 
                className="h-12 w-16 rounded-full mx-4"
            >
                <PhoneOff className="h-6 w-6" />
            </Button>
        </Link>

        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <Users className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
