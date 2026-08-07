"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, Bot, User, Flag, Mic, MicOff, Video, VideoOff, Clock } from 'lucide-react';
import { Button } from "@/components/shared";
import type { InterviewSession } from "@/lib/supabase/types";
import { chatInterviewAction, finishInterviewAction } from "@/app/actions/interview";
import { InterviewResults } from "./InterviewResults";
import type { JobWithScores } from "@/lib/ai/types";

import { useMediaDevices } from "@/hooks/useMediaDevices";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface Props {
  initialSession: InterviewSession;
  topJobs?: JobWithScores[];
}

export function InterviewRunner({ initialSession, topJobs }: Props) {
  const searchParams = useSearchParams();
  const [enableCamera, setEnableCamera] = useState(searchParams.get('camera') === 'true');
  const [enableMic, setEnableMic] = useState(searchParams.get('mic') === 'true');

  const [session, setSession] = useState<InterviewSession>(initialSession);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    const durationParam = searchParams.get('duration');
    return durationParam ? parseInt(durationParam) * 60 : null;
  });

  // Countdown logic
  useEffect(() => {
    if (timeLeft === null || session.status === 'Completed') return;
    
    if (timeLeft <= 0) {
      if (!isFinishing && !isSubmitting) {
        const hasAnswered = session.turns.length > 1 || (session.turns.length === 1 && session.turns[0].answer.trim().length > 0);
        if (hasAnswered) {
          handleFinish();
        } else {
          alert("Time's up! Since you haven't answered any questions, this interview won't be saved.");
          window.location.href = "/mock-interview";
        }
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null && prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinishing, session.status]);


  // Video feed ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const { error: mediaError } = useMediaDevices({ video: enableCamera, audio: enableMic, videoRef });

  // Speech and TTS
  const { transcript, setTranscript, isListening, startListening, stopListening, isSupported: srSupported } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

  // Sync transcript to answer
  useEffect(() => {
    if (isListening && transcript) {
      setCurrentAnswer(transcript);
    }
  }, [transcript, isListening]);

  // Scroll to bottom on new turns
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.turns]);

  // Speak the initial question on mount if TTS is available
  useEffect(() => {
    const lastTurn = initialSession.turns[initialSession.turns.length - 1];
    if (lastTurn && !lastTurn.answer && enableMic) {
      // Small delay to ensure voices are loaded
      const timer = setTimeout(() => {
        speak(lastTurn.question);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute live metrics from past turns (Must be before early return to obey React hook rules)
  const liveMetrics = useMemo(() => {
    let tech = 0, comm = 0, conf = 0, prob = 0;
    let count = 0;
    session.turns.forEach(t => {
      if (t.evaluation?.metrics) {
        tech += t.evaluation.metrics.technical || 0;
        comm += t.evaluation.metrics.communication || 0;
        conf += t.evaluation.metrics.confidence || 0;
        prob += t.evaluation.metrics.problemSolving || 0;
        count++;
      }
    });
    if (count === 0) return { technical: 0, communication: 0, confidence: 0, problemSolving: 0 };
    return {
      technical: Math.round(tech / count),
      communication: Math.round(comm / count),
      confidence: Math.round(conf / count),
      problemSolving: Math.round(prob / count)
    };
  }, [session.turns]);

  if (session.status === 'Completed' && session.feedback) {
    return <InterviewResults session={session} topJobs={topJobs} />;
  }

  if (!session.turns || session.turns.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="text-destructive font-semibold">Error: No interview turns found.</div>
        <Link href="/mock-interview" passHref>
          <Button variant="outline">Return</Button>
        </Link>
      </div>
    );
  }

  const latestTurn = session.turns[session.turns.length - 1];
  const isAnswered = latestTurn.answer.trim().length > 0;



  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    if (isListening) stopListening();
    stopSpeaking();
    
    // Optimistic UI update
    const optimisticSession = { ...session };
    optimisticSession.turns[optimisticSession.turns.length - 1].answer = currentAnswer;
    setSession(optimisticSession);

    try {
      const response = await chatInterviewAction(session.id, currentAnswer);
      if (response.error) {
        alert(response.error);
        // revert optimistic
        optimisticSession.turns[optimisticSession.turns.length - 1].answer = "";
        setSession(optimisticSession);
      } else if (response.data) {
        setSession(response.data);
        setCurrentAnswer("");
        setTranscript(""); // reset speech transcript
        
        // Speak the new question
        const newTurn = response.data.turns[response.data.turns.length - 1];
        if (newTurn && !newTurn.answer) {
          speak(newTurn.question);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    stopSpeaking();
    if (isListening) stopListening();
    
    try {
      const response = await finishInterviewAction(session.id);
      if (response.error) {
        alert(response.error);
      } else if (response.data) {
        setSession(response.data);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to finish interview.");
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between shrink-0 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h1 className="text-xl font-bold">{session.role} Interview</h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{session.mode}</span>
            <span>{session.company ? `at ${session.company}` : ''}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className={`flex items-center gap-2 font-mono text-lg font-bold px-3 py-1 rounded-md border ${timeLeft < 300 ? 'text-destructive border-destructive/50 bg-destructive/10 animate-pulse' : 'text-foreground border-border bg-secondary/20'}`}>
              <Clock className="w-4 h-4" />
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          <Button variant="outline" onClick={handleFinish} disabled={isFinishing || isSubmitting || session.turns.length === 1 && !isAnswered}>
            {isFinishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Flag className="w-4 h-4 mr-2" />}
            Finish Interview
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Column: Video & Metrics */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          
          {/* AI / User Video Panel */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col relative aspect-[4/3] bg-black">
            {enableCamera && !mediaError ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror"
                style={{ transform: "scaleX(-1)" }} // mirror webcam
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/20">
                <div className={`w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center transition-transform duration-300 ${isSpeaking ? 'scale-110 shadow-[0_0_30px_rgba(var(--primary),0.4)]' : ''}`}>
                  <Bot className="w-12 h-12 text-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  {mediaError && enableCamera ? "Camera unavailable" : (isSpeaking ? 'Sarah is speaking...' : 'Sarah (AI Interviewer)')}
                </p>
              </div>
            )}
            
            {/* Status Overlays */}
            <div className="absolute top-3 left-3 flex gap-2">
              <button 
                onClick={() => setEnableCamera(p => !p)}
                title={enableCamera ? "Turn off camera" : "Turn on camera"}
                className="bg-black/40 hover:bg-black/60 p-1.5 rounded-md transition-colors border border-white/10 backdrop-blur-sm"
              >
                {enableCamera ? <Video className="w-4 h-4 text-white drop-shadow-md" /> : <VideoOff className="w-4 h-4 text-white/50 drop-shadow-md" />}
              </button>
              <button 
                onClick={() => setEnableMic(p => !p)}
                title={enableMic ? "Turn off microphone" : "Turn on microphone"}
                className="bg-black/40 hover:bg-black/60 p-1.5 rounded-md transition-colors border border-white/10 backdrop-blur-sm"
              >
                {enableMic ? <Mic className="w-4 h-4 text-white drop-shadow-md" /> : <MicOff className="w-4 h-4 text-white/50 drop-shadow-md" />}
              </button>
            </div>
          </div>

          {/* Live Scoring Sidebar */}
          <div className="bg-card border border-border rounded-xl p-5 flex-1 shadow-sm overflow-y-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live AI Metrics
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Technical</span>
                  <span>{liveMetrics.technical > 0 ? liveMetrics.technical : '--'}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${liveMetrics.technical}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Communication</span>
                  <span>{liveMetrics.communication > 0 ? liveMetrics.communication : '--'}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${liveMetrics.communication}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Problem Solving</span>
                  <span>{liveMetrics.problemSolving > 0 ? liveMetrics.problemSolving : '--'}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${liveMetrics.problemSolving}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Confidence</span>
                  <span>{liveMetrics.confidence > 0 ? liveMetrics.confidence : '--'}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${liveMetrics.confidence}%` }} />
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-6 leading-relaxed">
              *Metrics are updated in real-time by the AI after each of your answers. Try to maintain eye contact and structure your answers clearly.
            </p>
          </div>
        </div>

        {/* Right Column: Chat Transcript & Input */}
        <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          
          {/* Chat Transcript Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
          >
            {session.turns.map((turn) => (
              <div key={turn.id} className="space-y-6">
                
                {/* Interviewer Question */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 bg-secondary/50 rounded-2xl rounded-tl-none p-4 text-foreground text-sm md:text-base leading-relaxed border border-border/50">
                    {turn.question}
                  </div>
                </div>

                {/* Candidate Answer */}
                {turn.answer && (
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 bg-blue-500/10 rounded-2xl rounded-tr-none p-4 text-foreground text-sm md:text-base leading-relaxed border border-blue-500/20">
                      {turn.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isSubmitting && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 bg-secondary/50 rounded-2xl rounded-tl-none p-4 flex items-center gap-3 text-muted-foreground border border-border/50">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sarah is evaluating your answer...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {!isAnswered && !isSubmitting && !isFinishing && (
            <div className="shrink-0 bg-secondary/10 border-t border-border p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    className="w-full h-24 p-3 pr-12 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm leading-relaxed"
                    placeholder={enableMic ? "Speak or type your answer here..." : "Type your answer here..."}
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    disabled={isSubmitting || isListening}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSubmitAnswer();
                      }
                    }}
                  />
                  {enableMic && srSupported && (
                    <button 
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                      title={isListening ? "Stop listening" : "Start speaking"}
                    >
                      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                <Button onClick={handleSubmitAnswer} aria-label="Submit Answer" disabled={isSubmitting || !currentAnswer.trim() || isListening} className="mb-1 h-12">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground ml-1">
                  {isListening ? "Listening... Speak now." : "Press ⌘+Enter to submit"}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
