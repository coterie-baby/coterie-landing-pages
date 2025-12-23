'use client';

import { useState, useRef, useEffect } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

interface UGCVideoProps {
  posterUrl?: string;
}

export default function UGCVideo({
  posterUrl = '/images/ugc-poster.jpg'
}: UGCVideoProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [shouldWiggle, setShouldWiggle] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stopSecondWiggle: NodeJS.Timeout | null = null;

    // First wiggle sequence - starts immediately
    setShouldWiggle(true);
    const stopFirstWiggle = setTimeout(() => {
      setShouldWiggle(false);
    }, 1000); // Animation duration is 1 second

    // Second wiggle sequence - starts after 4 second delay (1s animation + 4s delay = 5s)
    const startSecondWiggle = setTimeout(() => {
      setShouldWiggle(true);
      stopSecondWiggle = setTimeout(() => {
        setShouldWiggle(false);
      }, 1000); // Animation duration is 1 second
    }, 5000); // 1s (first animation) + 4s delay = 5s

    return () => {
      clearTimeout(stopFirstWiggle);
      clearTimeout(startSecondWiggle);
      if (stopSecondWiggle) {
        clearTimeout(stopSecondWiggle);
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      // Stop wiggling when user interacts
      setShouldWiggle(false);
    }
  };

  return (
    <div className="relative w-full h-[75vh]">
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        poster={posterUrl}
        preload="auto"
        src="https://player.vimeo.com/progressive_redirect/playback/1119579050/rendition/720p/file.mp4?loc=external&signature=728907c52d41dbb7fc5ffc32281168626d765f5ced762706f737c378cb7ed311"
        className="w-full h-full object-cover relative z-10"
      />
      <div className="absolute inset-0 w-full h-full bg-black opacity-20 pointer-events-none" />

      {/* Floating Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className={`absolute bottom-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all backdrop-blur-sm ${
          shouldWiggle ? 'animate-wiggle' : ''
        }`}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <SpeakerWaveIcon className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
