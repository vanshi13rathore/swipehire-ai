"use client";

import { useState, useEffect, RefObject } from 'react';

interface UseMediaDevicesOptions {
  video: boolean;
  audio: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function useMediaDevices({ video, audio, videoRef }: UseMediaDevicesOptions) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startMedia() {
      if (!video && !audio) return;
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video, audio });
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }

    startMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [video, audio, videoRef]);

  return { stream, error };
}
