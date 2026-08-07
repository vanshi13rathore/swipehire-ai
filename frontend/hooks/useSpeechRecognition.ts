"use client";

import { useState, useEffect, useCallback } from 'react';

// Web Speech API interfaces
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const sr = new SpeechRecognition();
        sr.continuous = true;
        sr.interimResults = true;
        
        sr.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(prev => prev + currentTranscript);
        };

        sr.onerror = (event: SpeechRecognitionErrorEvent) => {
          setError(event.error);
          setIsListening(false);
        };

        sr.onend = () => {
          setIsListening(false);
        };

        setRecognition(sr);
      } else {
        setError("Speech recognition is not supported in this browser.");
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        setTranscript("");
        setError(null);
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (err) {
        console.error(err);
      }
    }
  }, [recognition, isListening]);

  return { transcript, setTranscript, isListening, startListening, stopListening, error, isSupported: !!recognition };
}
