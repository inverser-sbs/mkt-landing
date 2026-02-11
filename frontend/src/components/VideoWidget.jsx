import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX } from 'lucide-react';

/**
 * VideoWidget - Widget de video flotante para landings
 * 
 * Props:
 * - videoUrl: URL del video (YouTube, Vimeo, MP4, Amazon S3)
 * - orientation: 'horizontal' | 'vertical'
 * - position: 'bottom-left' | 'bottom-right' (default: bottom-left)
 */
const VideoWidget = ({ videoUrl, orientation = 'horizontal', position = 'bottom-left' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoType, setVideoType] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  // Detect video type and extract ID/thumbnail
  useEffect(() => {
    if (!videoUrl) return;

    const url = videoUrl.trim();
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      setVideoType('youtube');
      setVideoId(ytMatch[1]);
      setThumbnail(`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`);
      return;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      setVideoType('vimeo');
      setVideoId(vimeoMatch[1]);
      // Fetch Vimeo thumbnail
      fetch(`https://vimeo.com/api/v2/video/${vimeoMatch[1]}.json`)
        .then(res => res.json())
        .then(data => setThumbnail(data[0]?.thumbnail_large))
        .catch(() => setThumbnail(null));
      return;
    }

    // MP4 / Direct video (Amazon S3, etc)
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || url.includes('s3.') || url.includes('amazonaws.com')) {
      setVideoType('direct');
      setVideoId(url);
      // For direct videos, we'll show a play icon overlay
      setThumbnail(null);
      return;
    }

    // Default: treat as direct video
    setVideoType('direct');
    setVideoId(url);
  }, [videoUrl]);

  // Handle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsMuted(false); // Unmute when expanding
    } else {
      setIsMuted(true); // Mute when collapsing
      // Pause video when collapsing
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  // Toggle mute
  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  // Close widget
  const closeWidget = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
    setIsMuted(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  if (!videoUrl || !videoType) return null;

  // Sizes based on orientation
  const bubbleSize = orientation === 'vertical' 
    ? { width: 60, height: 80 } 
    : { width: 80, height: 60 };
  
  const expandedSize = orientation === 'vertical'
    ? { width: 'min(280px, 70vw)', height: 'min(500px, 70vh)' }
    : { width: 'min(400px, 90vw)', height: 'min(225px, 50vw)' };

  // Position styles
  const positionStyles = position === 'bottom-left'
    ? { left: '20px', bottom: '20px' }
    : { right: '20px', bottom: '20px' };

  // Render video player based on type
  const renderPlayer = () => {
    if (videoType === 'youtube') {
      return (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&rel=0`}
          className="w-full h-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video del mentor"
        />
      );
    }

    if (videoType === 'vimeo') {
      return (
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=${isMuted ? 1 : 0}&playsinline=1`}
          className="w-full h-full rounded-2xl"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Video del mentor"
        />
      );
    }

    // Direct video (MP4, Amazon S3, etc)
    return (
      <video
        ref={videoRef}
        src={videoId}
        autoPlay
        muted={isMuted}
        playsInline
        loop
        className="w-full h-full object-cover rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    );
  };

  return (
    <div
      className={`
        fixed z-[9998] transition-all duration-300 ease-in-out cursor-pointer
        ${isExpanded ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl hover:scale-105'}
      `}
      style={{
        ...positionStyles,
        width: isExpanded ? expandedSize.width : bubbleSize.width,
        height: isExpanded ? expandedSize.height : bubbleSize.height,
        borderRadius: '16px',
      }}
      onClick={!isExpanded ? toggleExpand : undefined}
      data-testid="video-widget"
    >
      {/* Collapsed State - Bubble */}
      {!isExpanded && (
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900">
          {/* Thumbnail with blur effect */}
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Video preview"
              className="w-full h-full object-cover filter blur-[2px] scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800" />
          )}
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Play icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-4 h-4 text-purple-700 fill-purple-700 ml-0.5" />
            </div>
          </div>
          
          {/* Pulse animation ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full border-2 border-white/50 animate-ping" />
          </div>
        </div>
      )}

      {/* Expanded State - Video Player */}
      {isExpanded && (
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
          {/* Video */}
          {renderPlayer()}
          
          {/* Controls overlay */}
          <div className="absolute top-2 right-2 flex gap-2">
            {/* Mute/Unmute button (only for direct videos) */}
            {videoType === 'direct' && (
              <button
                onClick={toggleMute}
                className="w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                data-testid="video-mute-btn"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            )}
            
            {/* Close button */}
            <button
              onClick={closeWidget}
              className="w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
              data-testid="video-close-btn"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          
          {/* Click to minimize hint */}
          <div 
            className="absolute bottom-2 left-2 right-2 text-center"
            onClick={toggleExpand}
          >
            <span className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full">
              Clic para minimizar
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoWidget;
