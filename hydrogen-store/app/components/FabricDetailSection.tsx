import React, { useRef } from 'react';

export const FabricDetailSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;     // Restart from beginning
      video.play();              // Ensure it plays
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();             // Pause when hover ends
    }
  };

  return (
    <section className="py-24 bg-[#f3f2f0] border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-8">
            <span className="text-[11px] font-mono-street text-zinc-400 uppercase tracking-[0.25em] block">EDITORIAL DROP</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl uppercase leading-[1.05] text-[#1a1a1a]">
              WHERE COMFORT MEETS QUALITY
            </h2>
            <p className="text-zinc-500 font-light text-base md:text-lg leading-relaxed">
              Clean silhouettes crafted for everyday confidence.
            </p>
          </div>
          
          <div className="lg:col-span-6">
            <div 
              className="bg-white p-2 border border-zinc-200 group cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative overflow-hidden">
                {/* Still Image - Visible by default */}
                <img 
                  src="/images/editorial-cover.jpg" 
                  alt="Editorial Cover" 
                  className="w-full h-[480px] object-cover object-center transition-opacity duration-500 group-hover:opacity-0" 
                />
                
                {/* Video - Hidden until hover */}
                <video 
                  ref={videoRef}
                  src="/videos/editorial.mp4" 
                  muted 
                  loop 
                  playsInline 
                  className="absolute inset-0 w-full h-[480px] object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
              
              <div className="p-6 flex items-center justify-between text-[11px] font-mono-street border-t border-zinc-200 mt-2 uppercase tracking-widest">
                <span className="text-zinc-400">Editorial Motion</span>
                <span className="text-[#1a1a1a] font-bold">Summer Drop 26</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};