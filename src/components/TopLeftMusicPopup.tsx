import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FavoriteSong } from '../config/siteSettings';

interface TopLeftMusicPopupProps {
  playlist: FavoriteSong[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  windowState: 'mini' | 'desktop' | 'maximized';
  setWindowState: React.Dispatch<React.SetStateAction<'mini' | 'desktop' | 'maximized'>>;
  onPlaybackStateChange?: (state: {
    progressSec: number;
    durationSec: number;
  }) => void;
  seekRequestSec?: number | null;
}

const WAVEFORM_BARS = [
  0.38, 0.62, 0.48, 0.85, 0.72, 0.94, 0.54, 0.78, 0.66, 0.92, 0.44, 0.82, 0.98, 0.6,
  0.75, 0.88, 0.52, 0.95, 0.68, 0.84, 0.46, 0.76, 0.9, 0.58, 0.8, 0.64, 0.48, 0.36,
];

export const TopLeftMusicPopup: React.FC<TopLeftMusicPopupProps> = ({
  playlist,
  currentIndex,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  windowState,
  setWindowState,
  onPlaybackStateChange,
  seekRequestSec,
}) => {
  const [orientationMode, setOrientationMode] = useState<'portrait' | 'landscape'>('portrait');
  const [tiltAngle, setTiltAngle] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [progressSec, setProgressSec] = useState<number>(0);
  const [realAudioDurationSec, setRealAudioDurationSec] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.88);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [isRepeatOne, setIsRepeatOne] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedTrackIdRef = useRef<string>('');
  const isPlayingRef = useRef<boolean>(isPlaying);

  const currentTrack = playlist[currentIndex] || playlist[0];
  const fullTargetDuration =
    realAudioDurationSec > 35 ? realAudioDurationSec : currentTrack.durationSec;

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (seekRequestSec == null || seekRequestSec < 0) return;
    setProgressSec(seekRequestSec);
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Math.min(seekRequestSec, audio.duration - 0.2);
    }
  }, [seekRequestSec]);

  useEffect(() => {
    const updateOrientation = () => {
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      setOrientationMode(isLandscape ? 'landscape' : 'portrait');
    };
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ? Math.max(-8, Math.min(8, e.gamma / 4)) : 0;
      const beta = e.beta ? Math.max(-8, Math.min(8, (e.beta - 45) / 5)) : 0;
      setTiltAngle({ x: gamma, y: beta });
    };
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (loadedTrackIdRef.current !== currentTrack.id) {
      loadedTrackIdRef.current = currentTrack.id;
      setProgressSec(0);
      setRealAudioDurationSec(currentTrack.durationSec);

      audio.src = currentTrack.audioUrl;
      audio.volume = volume;
      audio.load();

      if (isPlayingRef.current) {
        setIsBuffering(true);
        audio
          .play()
          .then(() => setIsBuffering(false))
          .catch(() => {
            setIsBuffering(false);
            setIsPlaying(false);
          });
      }
    }
  }, [currentTrack.id, currentTrack.audioUrl, currentTrack.durationSec, setIsPlaying, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (audio.paused) {
        setIsBuffering(true);
        audio
          .play()
          .then(() => setIsBuffering(false))
          .catch(() => {
            setIsBuffering(false);
            setIsPlaying(false);
          });
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
      setIsBuffering(false);
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (onPlaybackStateChange) {
      onPlaybackStateChange({
        progressSec,
        durationSec: fullTargetDuration,
      });
    }
  }, [progressSec, fullTargetDuration, onPlaybackStateChange]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Number.isFinite(audio.duration) && audio.duration > 35) {
      setRealAudioDurationSec(Math.round(audio.duration));
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgressSec(audio.currentTime);
  };

  const handleTrackEnded = () => {
    const audio = audioRef.current;
    if (isRepeatOne && audio) {
      audio.currentTime = 0;
      setProgressSec(0);
      audio.play().catch(() => setIsPlaying(false));
      return;
    }
    setProgressSec(0);
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
    setIsPlaying(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSec = clickRatio * fullTargetDuration;
    setProgressSec(targetSec);

    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Math.min(targetSec, audio.duration - 0.2);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent =
    fullTargetDuration > 0 ? Math.min(100, (progressSec / fullTargetDuration) * 100) : 0;

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />

      <div
        className={`fixed z-50 transition-all duration-300 ${
          windowState === 'maximized'
            ? 'inset-3 sm:inset-6'
            : 'top-3 left-3 sm:top-4 sm:left-4'
        }`}
      >
        <motion.div
          layout
          style={{
            rotateY: windowState === 'mini' ? tiltAngle.x : 0,
            rotateX: windowState === 'mini' ? -tiltAngle.y : 0,
          }}
          transition={{ type: 'spring', stiffness: 340, damping: 30, mass: 0.75 }}
          className={`relative rounded-3xl backdrop-blur-2xl bg-white/92 dark:bg-[#05141c]/92 border border-cyan-300/80 dark:border-cyan-400/30 shadow-[0_24px_70px_-15px_rgba(6,182,212,0.42)] overflow-hidden flex flex-col will-change-transform ${
            windowState === 'maximized'
              ? 'w-full h-full'
              : windowState === 'desktop'
              ? orientationMode === 'landscape'
                ? 'w-[94vw] sm:w-[740px] lg:w-[820px] h-[82vh] sm:h-[490px]'
                : 'w-[94vw] sm:w-[560px] h-[78vh] sm:h-[520px]'
              : orientationMode === 'landscape'
              ? 'w-[290px] sm:w-[335px]'
              : 'w-[265px] sm:w-[305px]'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: windowState === 'mini' ? 0.14 : 0.28 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <img
                src={currentTrack.artworkJpg}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover scale-150 blur-3xl"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 px-4 py-2.5 bg-gradient-to-r from-cyan-600/90 via-sky-500/90 to-cyan-500/90 backdrop-blur-xl text-white flex items-center justify-between gap-3 select-none shrink-0 border-b border-white/15">
            <div className="flex items-center gap-2 min-w-0">
              <motion.span
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0"
              >
                <i className="fa-solid fa-compact-disc" />
              </motion.span>
              <span className="text-xs font-bold tracking-tight truncate">
                NotZack Audio Player
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setWindowState('mini')}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  windowState === 'mini'
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'bg-white/20 hover:bg-white/35 text-white'
                }`}
                title="Perkecil"
              >
                <i className="fa-solid fa-minus" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setWindowState((s) => (s === 'desktop' ? 'mini' : 'desktop'))
                }
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  windowState === 'desktop'
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'bg-white/20 hover:bg-white/35 text-white'
                }`}
                title="Mode Desktop"
              >
                <i className="fa-regular fa-window-restore" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setWindowState((s) => (s === 'maximized' ? 'desktop' : 'maximized'))
                }
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  windowState === 'maximized'
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'bg-white/20 hover:bg-white/35 text-white'
                }`}
                title="Layar Penuh"
              >
                <i className="fa-solid fa-expand" />
              </button>
            </div>
          </div>

          {windowState === 'mini' && (
            <div className="relative z-10 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="group relative w-12 h-12 rounded-2xl overflow-hidden border border-cyan-300 dark:border-cyan-400/50 shadow-md shrink-0 bg-slate-900"
                >
                  <img
                    src={currentTrack.artworkJpg}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-white">
                    <i
                      className={`fa-solid ${
                        isBuffering
                          ? 'fa-spinner fa-spin'
                          : isPlaying
                          ? 'fa-pause'
                          : 'fa-play'
                      } text-xs`}
                    />
                  </div>
                </motion.button>

                <div
                  onClick={() => setWindowState('desktop')}
                  className="min-w-0 flex-1 cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono-tabular font-bold text-cyan-600 dark:text-cyan-400">
                      {currentTrack.number}
                    </span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {currentTrack.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentTrack.artist}
                  </p>
                  <p className="text-[10px] font-mono-tabular text-cyan-700 dark:text-cyan-300 mt-0.5">
                    {formatTime(progressSec)} / {formatTime(fullTargetDuration)}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={handlePrev}
                    className="w-7 h-7 rounded-xl btn-glossy-ice flex items-center justify-center text-[10px]"
                  >
                    <i className="fa-solid fa-backward-step" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={handleNext}
                    className="w-7 h-7 rounded-xl btn-glossy-ice flex items-center justify-center text-[10px]"
                  >
                    <i className="fa-solid fa-forward-step" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => setWindowState('desktop')}
                    className="w-7 h-7 rounded-xl btn-glossy-cyan flex items-center justify-center text-[10px]"
                  >
                    <i className="fa-solid fa-sliders" />
                  </motion.button>
                </div>
              </div>

              <div
                onClick={handleSeek}
                className="w-full h-1.5 rounded-full bg-cyan-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
              >
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {windowState !== 'mini' && (
            <div className="relative z-10 flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden">
              <div className="sm:w-[320px] lg:w-[350px] p-5 sm:p-6 border-b sm:border-b-0 sm:border-r border-cyan-200/60 dark:border-cyan-500/20 flex flex-col justify-between bg-white/55 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
                <div className="flex sm:flex-col items-center text-left sm:text-center gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTrack.id}
                      initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                      className="relative w-20 h-20 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-cyan-300/90 dark:border-cyan-400/40 shadow-[0_20px_50px_-12px_rgba(6,182,212,0.5)] bg-slate-900 shrink-0"
                    >
                      <img
                        src={currentTrack.artworkJpg}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="min-w-0 flex-1 sm:w-full space-y-1">
                    <div className="inline-flex items-center gap-2 text-[11px] font-mono-tabular font-semibold text-cyan-700 dark:text-cyan-300">
                      <span>TRACK {currentTrack.number}</span>
                      <span aria-hidden="true">·</span>
                      <span>{currentTrack.releaseYear}</span>
                    </div>
                    <h4 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-cyan-700 dark:text-cyan-300 truncate">
                      {currentTrack.artist}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentTrack.album} · {currentTrack.genre}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3.5">
                  <div
                    onClick={handleSeek}
                    className="h-9 flex items-end justify-between gap-1 px-1 cursor-pointer select-none"
                  >
                    {WAVEFORM_BARS.map((baseHeight, idx) => {
                      const barPct = ((idx + 1) / WAVEFORM_BARS.length) * 100;
                      const isPlayed = barPct <= progressPercent;
                      return (
                        <motion.span
                          key={idx}
                          animate={
                            isPlaying
                              ? {
                                  scaleY: [
                                    baseHeight,
                                    Math.min(1, baseHeight + 0.32),
                                    Math.max(0.22, baseHeight - 0.18),
                                    baseHeight,
                                  ],
                                }
                              : { scaleY: baseHeight * 0.65 }
                          }
                          transition={{
                            repeat: isPlaying ? Infinity : 0,
                            duration: 0.75 + (idx % 5) * 0.12,
                            ease: 'easeInOut',
                          }}
                          style={{ height: '100%' }}
                          className={`flex-1 rounded-full origin-bottom transition-colors duration-150 ${
                            isPlayed
                              ? 'bg-gradient-to-t from-cyan-500 to-sky-400'
                              : 'bg-cyan-200/75 dark:bg-slate-700/75'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[11px] font-mono-tabular font-semibold text-slate-500 dark:text-slate-400">
                    <span>{formatTime(progressSec)}</span>
                    <span>{formatTime(fullTargetDuration)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setIsShuffle((s) => !s)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${
                        isShuffle ? 'btn-glossy-cyan' : 'btn-glossy-ice opacity-75'
                      }`}
                    >
                      <i className="fa-solid fa-shuffle" />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-xl btn-glossy-ice flex items-center justify-center text-xs"
                    >
                      <i className="fa-solid fa-backward-step" />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="w-12 h-12 rounded-2xl btn-glossy-cyan flex items-center justify-center text-base shadow-lg"
                    >
                      <i
                        className={`fa-solid ${
                          isBuffering
                            ? 'fa-spinner fa-spin'
                            : isPlaying
                            ? 'fa-pause'
                            : 'fa-play'
                        }`}
                      />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={handleNext}
                      className="w-10 h-10 rounded-xl btn-glossy-ice flex items-center justify-center text-xs"
                    >
                      <i className="fa-solid fa-forward-step" />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setIsRepeatOne((r) => !r)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${
                        isRepeatOne ? 'btn-glossy-cyan' : 'btn-glossy-ice opacity-75'
                      }`}
                    >
                      <i className="fa-solid fa-repeat" />
                    </motion.button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2.5 pt-2 border-t border-cyan-200/60 dark:border-cyan-500/20">
                    <i className="fa-solid fa-volume-high text-xs text-cyan-700 dark:text-cyan-300" />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.02}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer h-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col min-h-0 bg-white/45 dark:bg-[#041118]/75 backdrop-blur-xl">
                <div className="px-5 py-3 border-b border-cyan-200/60 dark:border-cyan-500/20 flex items-center justify-between shrink-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <i className="fa-solid fa-bars-staggered text-cyan-500" />
                    <span>Antrean Playlist ({playlist.length} Lagu)</span>
                  </span>
                  <span className="text-[11px] font-mono-tabular text-cyan-700 dark:text-cyan-300">
                    Audio Penuh
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5">
                  {playlist.map((song, idx) => {
                    const active = idx === currentIndex;
                    return (
                      <motion.button
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.985 }}
                        key={song.id}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setIsPlaying((p) => !p);
                          } else {
                            setCurrentIndex(idx);
                            setIsPlaying(true);
                          }
                        }}
                        className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between gap-3 transition-colors ${
                          active
                            ? 'btn-glossy-cyan shadow-md'
                            : 'hover:bg-cyan-100/70 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/30 bg-slate-800">
                            <img
                              src={song.artworkJpg}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">
                              {song.number}. {song.title}
                            </p>
                            <p
                              className={`text-[11px] truncate ${
                                active
                                  ? 'text-cyan-50'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {song.artist} · {song.album}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono-tabular font-semibold shrink-0">
                          {formatTime(song.durationSec)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};
