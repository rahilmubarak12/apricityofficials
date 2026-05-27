import React, { useRef, useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed = 80, delay = 0) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    setDisplayed("");

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));

        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return displayed;
};

interface HeroVideoProps {
  onShopMen: () => void;
  onShopWomen: () => void;
  onExploreCollection: () => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  onShopMen,
  onShopWomen,
  onExploreCollection
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const fullText = "APRICITY OFFICIALS";
  const typedText = useTypewriter(fullText, 75, 300);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Programmatically configure muted/playsinline to bypass iOS Safari autoplay restrictions
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');

      // If already playing (e.g. from cache), reveal immediately
      if (!video.paused && !video.ended && video.readyState > 2) {
        setVideoLoaded(true);
      }

      const handlePlaySuccess = () => {
        setVideoLoaded(true);
      };

      const startVideo = () => {
        video.play()
          .then(handlePlaySuccess)
          .catch((err) => {
            console.warn("Autoplay prevented or failed:", err);
            
            // On mobile/safari, if autoplay fails (e.g. Low Power Mode), 
            // trigger play on the first user interaction (touch/click)
            const playOnInteraction = () => {
              video.play()
                .then(() => {
                  handlePlaySuccess();
                  removeListeners();
                })
                .catch(() => {});
            };
            
            const removeListeners = () => {
              document.removeEventListener('touchstart', playOnInteraction);
              document.removeEventListener('click', playOnInteraction);
            };

            document.addEventListener('touchstart', playOnInteraction, { passive: true });
            document.addEventListener('click', playOnInteraction, { passive: true });
          });
      };

      startVideo();
    }
  }, []);

  return (
    <div className="relative w-full h-[90vh] min-h-[640px] bg-black overflow-hidden flex items-center justify-center">
      
      {/* Fallback Image - Mobile gets portrait version, desktop gets landscape */}
      <picture className="absolute inset-0 w-full h-full z-0">
        <source media="(max-width: 768px)" srcSet="/images/hero-photo-mobile.jpg" />
        <img 
          src="/images/hero-photo.jpg" 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
      </picture>

      {/* Video - Only fades in when actually playing (onPlaying), fallback image shows until then */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        onPlaying={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center z-10 transition-opacity duration-700 ease-out pointer-events-none ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          // Suppress browser native play button overlay (especially iOS/Android)
          WebkitAppearance: 'none' as const,
          pointerEvents: 'none',
        }}
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Thin bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />

      {/* Content - Perfectly centered */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 w-full text-center -mt-10">
        <span className="text-[11px] font-mono-street tracking-[0.3em] uppercase text-white/60 mb-5 block">
          Summer Capsule '26
        </span>

        <h1 className="font-heading font-bold text-4xl sm:text-6xl md:text-7xl text-white uppercase leading-none mb-6 min-h-[1.1em]">
          {typedText}
          {typedText.length < fullText.length && (
            <span className="animate-pulse">|</span>
          )}
        </h1>

        <p className="text-white/70 font-light text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Elevated essentials with a refined modern fit.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto font-mono-street text-xs uppercase tracking-[0.2em]">
          <button
            onClick={onExploreCollection}
            className="w-full sm:w-auto px-10 py-4 bg-white text-black font-extrabold hover:bg-zinc-100 transition-colors"
          >
            Shop Now
          </button>
          <button
            onClick={onShopMen}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/40 hover:border-white hover:bg-white/10 transition-colors"
          >
            Men
          </button>
          <button
            onClick={onShopWomen}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/40 hover:border-white hover:bg-white/10 transition-colors"
          >
            Women
          </button>
        </div>
      </div>
    </div>
  );
};