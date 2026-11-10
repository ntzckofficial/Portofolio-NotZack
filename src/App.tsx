import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SITE_SETTINGS, GameAccount } from './config/siteSettings';
import { TopLeftMusicPopup } from './components/TopLeftMusicPopup';
import { QrisUtilitySection } from './components/QrisUtilitySection';

const STORAGE_KEY_THEME = 'notzack_cyangloss_theme_v1';

const STUDIO_SPECTRUM_BARS = [
  0.42, 0.74, 0.56, 0.92, 0.64, 0.86, 0.48, 0.96, 0.7, 0.58, 0.88, 0.45, 0.78, 0.94, 0.62, 0.82,
  0.52, 0.9, 0.68, 0.98, 0.54, 0.76, 0.84, 0.46, 0.72, 0.9, 0.6, 0.8, 0.5, 0.66, 0.44, 0.35,
];

export default function App() {
  const { seo, profile, socials, games, qris, playlist } = SITE_SETTINGS;

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved ? saved === 'dark' : false;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playerWindowState, setPlayerWindowState] = useState<'mini' | 'desktop' | 'maximized'>('mini');
  const [livePlaybackState, setLivePlaybackState] = useState<{
    progressSec: number;
    durationSec: number;
  }>({
    progressSec: 0,
    durationSec: playlist[0]?.durationSec || 180,
  });
  const [seekRequestSec, setSeekRequestSec] = useState<number | null>(null);

  const [playlistFilter, setPlaylistFilter] = useState<'all' | 'indo' | 'global'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedGameModal, setSelectedGameModal] = useState<GameAccount | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>(profile.avatarImage);
  const [bannerSrc, setBannerSrc] = useState<string>(profile.backdropImage);

  useEffect(() => {
    const baseUrl = (seo.siteUrl || window.location.origin).replace(/\/$/, '');
    const fullOgImg = seo.ogImage.startsWith('http')
      ? seo.ogImage
      : `${baseUrl}${seo.ogImage}`;

    const canonicalEl = document.getElementById('meta-canonical') as HTMLLinkElement | null;
    if (canonicalEl) canonicalEl.href = `${baseUrl}/`;

    const ogUrlEl = document.getElementById('meta-og-url') as HTMLMetaElement | null;
    if (ogUrlEl) ogUrlEl.content = `${baseUrl}/`;

    const ogImgEl = document.getElementById('meta-og-image') as HTMLMetaElement | null;
    if (ogImgEl) ogImgEl.content = fullOgImg;

    const twImgEl = document.getElementById('meta-twitter-image') as HTMLMetaElement | null;
    if (twImgEl) twImgEl.content = fullOgImg;
  }, [seo]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} (${text}) berhasil disalin`);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeSong = playlist[currentTrackIndex] || playlist[0];
  const activeDuration = livePlaybackState.durationSec || activeSong.durationSec;
  const activeProgressPercent =
    activeDuration > 0 ? Math.min(100, (livePlaybackState.progressSec / activeDuration) * 100) : 0;

  const handleMainDeckSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSeekRequestSec(ratio * activeDuration);
  };

  const filteredPlaylist = useMemo(() => {
    return playlist
      .map((song, originalIndex) => ({ song, originalIndex }))
      .filter(({ song }) => {
        const isIndo = /Indonesian|Raim Laode|Mahalini|Ghea Indrawari|K3bi/i.test(
          `${song.genre} ${song.artist}`
        );
        if (playlistFilter === 'indo' && !isIndo) return false;
        if (playlistFilter === 'global' && isIndo) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            song.title.toLowerCase().includes(q) ||
            song.artist.toLowerCase().includes(q) ||
            song.album.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [playlist, playlistFilter, searchQuery]);

  return (
    <div className="min-h-screen cyan-editorial-canvas text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-cyan-500 selection:text-white">
      <TopLeftMusicPopup
        playlist={playlist}
        currentIndex={currentTrackIndex}
        setCurrentIndex={setCurrentTrackIndex}
        isPlaying={isPlayingAudio}
        setIsPlaying={setIsPlayingAudio}
        windowState={playerWindowState}
        setWindowState={setPlayerWindowState}
        onPlaybackStateChange={setLivePlaybackState}
        seekRequestSec={seekRequestSec}
      />

      <header className="sticky top-0 z-30 w-full border-b border-cyan-200/60 dark:border-cyan-500/15 bg-white/70 dark:bg-[#030b10]/75 backdrop-blur-2xl">
        <div className="max-w-[1220px] mx-auto px-4 sm:px-8 pl-[280px] sm:pl-[330px] lg:pl-8 py-3.5 flex items-center justify-end lg:justify-between gap-8">
          <a
            href="#"
            className="hidden lg:inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-cyan-700 dark:text-cyan-300 whitespace-nowrap shrink-0 lg:ml-[310px]"
          >
            <i className="fa-solid fa-gem text-cyan-500 text-sm" />
            <span>{profile.name}</span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a
              href="#sosmed"
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              Sosial Media
            </a>
            <a
              href="#games"
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              Nick Game
            </a>
            <a
              href="#utilities"
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              QRIS Resmi
            </a>
            <a
              href="#playlist"
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              Music Player ({playlist.length})
            </a>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              className="w-9 h-9 rounded-xl btn-glossy-ice flex items-center justify-center text-xs shrink-0"
              title={darkMode ? 'Mode Cerah' : 'Mode Gelap'}
            >
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
            </motion.button>
            <a
              href={profile.whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl btn-glossy-cyan text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <i className="fa-brands fa-whatsapp text-sm" />
              <span>WA Bisnis</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1220px] mx-auto px-4 sm:px-8 pt-10 pb-24 space-y-20 sm:space-y-24">
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="lg:col-span-7 rounded-[2rem] glass-surface p-7 sm:p-11 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-cyan-200/60 dark:border-cyan-500/15">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular font-semibold text-cyan-700 dark:text-cyan-300">
                    <i className="fa-solid fa-circle-check text-cyan-500" />
                    <span>{profile.username}</span>
                    <span aria-hidden="true">·</span>
                    <span>{profile.region}</span>
                    <span aria-hidden="true">·</span>
                    <span>{profile.timezone}</span>
                  </div>

                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span>{profile.statusText}</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <h1
                    className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.04]"
                    style={{ textWrap: 'balance' }}
                  >
                    {profile.name}
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-cyan-700 dark:text-cyan-300">
                    {profile.tagline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-[58ch]">
                  {profile.shortBio}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-cyan-200/60 dark:border-cyan-500/15 flex flex-wrap items-center gap-3">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  href="#utilities"
                  className="px-5 py-3 rounded-2xl btn-glossy-cyan text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <i className="fa-solid fa-qrcode" />
                  <span>Scan QRIS NotZack</span>
                </motion.a>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => {
                    setIsPlayingAudio(true);
                    setPlayerWindowState('desktop');
                  }}
                  className="px-5 py-3 rounded-2xl btn-glossy-ice text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <i className="fa-solid fa-compact-disc" />
                  <span>Buka Desktop Player</span>
                </motion.button>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  href="#games"
                  className="px-4 py-3 rounded-2xl btn-glossy-ice text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <i className="fa-solid fa-gamepad" />
                  <span>Nick Game</span>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.06 }}
              className="lg:col-span-5 rounded-[2rem] overflow-hidden bg-slate-900 border border-cyan-300/80 dark:border-cyan-500/30 shadow-[0_24px_60px_-15px_rgba(6,182,212,0.28)] relative min-h-[380px] flex flex-col justify-between group"
            >
              <div className="absolute inset-0">
                <img
                  src={bannerSrc}
                  alt="NotZack Banner"
                  onError={() => {
                    if (bannerSrc !== '/assets/banner.jpg') {
                      setBannerSrc('/assets/banner.jpg');
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/15" />
              </div>

              <div className="relative z-10 p-6 flex items-center justify-between text-xs font-mono-tabular text-cyan-100">
                <span className="font-bold tracking-wider">OFFICIAL PROFILE</span>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => handleCopyText(window.location.href, 'Tautan Profil NotZack')}
                  className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-sans font-semibold transition-colors flex items-center gap-1.5 border border-white/15"
                >
                  <i className="fa-solid fa-share-nodes" />
                  <span>Bagikan</span>
                </motion.button>
              </div>

              <div className="relative z-10 p-6 sm:p-7 flex items-end gap-4">
                <motion.div
                  whileHover={{ scale: 1.04, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-cyan-300 shadow-2xl bg-slate-800 shrink-0"
                >
                  <img
                    src={avatarSrc}
                    alt={profile.name}
                    onError={() => {
                      if (avatarSrc !== '/assets/avatar.jpg') {
                        setAvatarSrc('/assets/avatar.jpg');
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="min-w-0 flex-1 text-white space-y-1">
                  <p className="text-xs font-mono-tabular font-semibold text-cyan-300">
                    VERIFIED CREATOR & MERCHANT
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold truncate">
                    {profile.name}
                  </h2>
                  <p className="text-xs text-slate-300 truncate">
                    Minecraft · Roblox · Valorant
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="sosmed" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-cyan-200/70 dark:border-cyan-500/20">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Jejaring Sosial Media
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Terhubung langsung ke 6 saluran resmi atau salin identitas akun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-8">
            {socials.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.04 }}
                className="rounded-3xl glass-surface p-6 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl btn-glossy-cyan flex items-center justify-center text-lg shrink-0">
                    <i className={item.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-mono-tabular font-semibold text-cyan-700 dark:text-cyan-300 truncate mt-0.5">
                      {item.handle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.roleOrNote}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mt-6 pt-4 border-t border-cyan-200/50 dark:border-cyan-500/15">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl btn-glossy-cyan text-xs font-bold text-center whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <span>Buka {item.name}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                  </a>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={() => handleCopyText(item.copyText, item.name)}
                    className="py-2.5 px-3.5 rounded-xl btn-glossy-ice text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-regular fa-copy" />
                    <span>Salin</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="games" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-cyan-200/70 dark:border-cyan-500/20">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                List Nickname Game
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Minecraft · Roblox · Valorant — Salin nickname untuk mabar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {games.map((g, idx) => {
              const fullCopyIgn =
                g.id === 'valorant' ? `${g.nickname}${g.tagOrId}` : g.nickname;
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.06 }}
                  className="rounded-3xl glass-surface p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 pb-4 border-b border-cyan-200/50 dark:border-cyan-500/15">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-300 dark:border-cyan-400/50 bg-white dark:bg-slate-900 flex items-center justify-center shadow-md shrink-0 p-1">
                        <img
                          src={g.logoImage}
                          alt={g.title}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                          {g.title}
                        </span>
                        <h3 className="text-xl font-extrabold font-mono-tabular text-slate-900 dark:text-white tracking-tight truncate">
                          {g.nickname}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3 my-5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400">Tag / Edition</span>
                        <span className="font-mono-tabular font-bold text-slate-900 dark:text-white">
                          {g.tagOrId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400">Rank / Status</span>
                        <span className="font-bold text-cyan-700 dark:text-cyan-300">
                          {g.rank}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400">Server</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {g.server}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-cyan-200/50 dark:border-cyan-500/15">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {g.favoriteMode}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {g.detailNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleCopyText(fullCopyIgn, `Nickname ${g.title}`)}
                      className="flex-1 py-2.5 px-4 rounded-xl btn-glossy-cyan text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      <i className="fa-regular fa-copy" />
                      <span>Salin Nick</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setSelectedGameModal(g)}
                      className="py-2.5 px-3.5 rounded-xl btn-glossy-ice text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-id-card" />
                      <span>Kartu</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <QrisUtilitySection
          qris={qris}
          whatsappUrl={profile.whatsappDirectUrl}
          onNotify={triggerToast}
        />

        <section id="playlist" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-cyan-200/70 dark:border-cyan-500/20">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Desktop Music Player
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {playlist.length} lagu pilihan berdurasi penuh dengan visualizer gelombang 60fps
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative mt-8 rounded-[2rem] overflow-hidden glass-surface"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSong.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.26 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                <img
                  src={activeSong.artworkJpg}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover scale-150 blur-3xl"
                />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSong.id}
                    initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-cyan-300 dark:border-cyan-400/50 shadow-[0_24px_55px_-12px_rgba(6,182,212,0.5)] bg-slate-900 shrink-0"
                  >
                    <img
                      src={activeSong.artworkJpg}
                      alt={activeSong.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-tabular font-bold text-cyan-600 dark:text-cyan-300">
                    <span>TRACK #{activeSong.number}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeSong.releaseYear}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeSong.genre}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                    {activeSong.title}
                  </h3>

                  <p className="text-sm sm:text-base font-bold text-cyan-700 dark:text-cyan-300 truncate">
                    {activeSong.artist}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Album: {activeSong.album} · Suasana {activeSong.mood}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between space-y-5 bg-white/75 dark:bg-slate-900/65 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-cyan-200/70 dark:border-cyan-500/25">
                <div
                  onClick={handleMainDeckSeek}
                  className="h-12 flex items-end justify-between gap-1 px-1 cursor-pointer select-none"
                  title="Klik gelombang untuk menggeser posisi waktu lagu"
                >
                  {STUDIO_SPECTRUM_BARS.map((baseH, idx) => {
                    const barPct = ((idx + 1) / STUDIO_SPECTRUM_BARS.length) * 100;
                    const isPlayed = barPct <= activeProgressPercent;
                    return (
                      <motion.span
                        key={idx}
                        animate={
                          isPlayingAudio
                            ? {
                                scaleY: [
                                  baseH,
                                  Math.min(1, baseH + 0.34),
                                  Math.max(0.2, baseH - 0.2),
                                  baseH,
                                ],
                              }
                            : { scaleY: baseH * 0.6 }
                        }
                        transition={{
                          repeat: isPlayingAudio ? Infinity : 0,
                          duration: 0.7 + (idx % 6) * 0.11,
                          ease: 'easeInOut',
                        }}
                        style={{ height: '100%' }}
                        className={`flex-1 rounded-full origin-bottom transition-colors duration-150 ${
                          isPlayed
                            ? 'bg-gradient-to-t from-cyan-500 to-sky-400'
                            : 'bg-cyan-200/70 dark:bg-slate-700/70'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs font-mono-tabular font-bold text-slate-600 dark:text-slate-300">
                  <span>{formatTime(livePlaybackState.progressSec)}</span>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {isPlayingAudio ? 'SEDANG MEMUTAR' : 'SIAP DIPUTAR'}
                  </span>
                  <span>{formatTime(activeDuration)}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => {
                        setCurrentTrackIndex((i) => (i - 1 + playlist.length) % playlist.length);
                        setIsPlayingAudio(true);
                      }}
                      className="w-11 h-11 rounded-2xl btn-glossy-ice flex items-center justify-center text-xs"
                    >
                      <i className="fa-solid fa-backward-step" />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={() => setIsPlayingAudio((p) => !p)}
                      className="px-6 py-3 rounded-2xl btn-glossy-cyan text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap"
                    >
                      <i className={`fa-solid ${isPlayingAudio ? 'fa-pause' : 'fa-play'}`} />
                      <span>{isPlayingAudio ? 'Jeda Audio' : 'Putar Sekarang'}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => {
                        setCurrentTrackIndex((i) => (i + 1) % playlist.length);
                        setIsPlayingAudio(true);
                      }}
                      className="w-11 h-11 rounded-2xl btn-glossy-ice flex items-center justify-center text-xs"
                    >
                      <i className="fa-solid fa-forward-step" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setPlayerWindowState('desktop')}
                    className="px-4 py-3 rounded-2xl btn-glossy-ice text-xs font-bold flex items-center gap-2 whitespace-nowrap"
                  >
                    <i className="fa-regular fa-window-restore" />
                    <span>Jendela Player</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'all', label: `Semua Lagu (${playlist.length})` },
                  { id: 'indo', label: 'Hits Indonesia' },
                  { id: 'global', label: 'Hits Internasional' },
                ] as const
              ).map((tab) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={tab.id}
                  type="button"
                  onClick={() => setPlaylistFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    playlistFilter === tab.id ? 'btn-glossy-cyan' : 'btn-glossy-ice'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-cyan-600 dark:text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul lagu atau penyanyi..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/90 dark:bg-[#071821]/90 border border-cyan-200 dark:border-cyan-500/30 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-[2rem] overflow-hidden glass-surface">
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3.5 border-b border-cyan-200/60 dark:border-cyan-500/20 text-[11px] font-mono-tabular font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Judul Lagu & Penyanyi</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2">Genre & Mood</div>
              <div className="col-span-1 text-right">
                <i className="fa-regular fa-clock" />
              </div>
            </div>

            <div className="divide-y divide-cyan-100/70 dark:divide-cyan-500/15">
              {filteredPlaylist.map(({ song, originalIndex }) => {
                const isCurrent = originalIndex === currentTrackIndex;

                return (
                  <motion.div
                    key={song.id}
                    layout
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      if (isCurrent) {
                        setIsPlayingAudio((p) => !p);
                      } else {
                        setCurrentTrackIndex(originalIndex);
                        setIsPlayingAudio(true);
                      }
                    }}
                    className={`group px-4 sm:px-6 py-3.5 grid grid-cols-12 gap-3 sm:gap-4 items-center cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-cyan-500/15 dark:bg-cyan-500/20'
                        : 'hover:bg-cyan-50/80 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="col-span-2 sm:col-span-1 flex items-center">
                      {isCurrent && isPlayingAudio ? (
                        <span className="flex items-end gap-0.5 h-4">
                          <motion.span
                            animate={{ scaleY: [0.3, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 0.48, ease: 'easeInOut' }}
                            className="w-1 h-full bg-cyan-500 rounded-full origin-bottom"
                          />
                          <motion.span
                            animate={{ scaleY: [0.95, 0.35, 1] }}
                            transition={{ repeat: Infinity, duration: 0.4, ease: 'easeInOut' }}
                            className="w-1 h-full bg-sky-500 rounded-full origin-bottom"
                          />
                          <motion.span
                            animate={{ scaleY: [0.4, 0.9, 0.3] }}
                            transition={{ repeat: Infinity, duration: 0.55, ease: 'easeInOut' }}
                            className="w-1 h-full bg-cyan-400 rounded-full origin-bottom"
                          />
                        </span>
                      ) : (
                        <>
                          <span
                            className={`text-xs font-mono-tabular font-bold group-hover:hidden ${
                              isCurrent
                                ? 'text-cyan-600 dark:text-cyan-300'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {song.number}
                          </span>
                          <span className="hidden group-hover:inline-flex items-center justify-center text-cyan-600 dark:text-cyan-300 text-xs">
                            <i className="fa-solid fa-play" />
                          </span>
                        </>
                      )}
                    </div>

                    <div className="col-span-8 sm:col-span-7 md:col-span-5 flex items-center gap-3.5 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-cyan-200 dark:border-cyan-500/30 shadow-sm bg-slate-900">
                        <img
                          src={song.artworkJpg}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={`text-sm font-bold truncate ${
                            isCurrent
                              ? 'text-cyan-700 dark:text-cyan-300'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {song.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:block md:col-span-3 min-w-0">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                        {song.album}
                      </p>
                      <p className="text-[11px] font-mono-tabular text-slate-400">
                        Rilis {song.releaseYear}
                      </p>
                    </div>

                    <div className="hidden md:block md:col-span-2 min-w-0">
                      <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 truncate">
                        {song.genre}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{song.mood}</p>
                    </div>

                    <div className="col-span-2 sm:col-span-4 md:col-span-1 flex items-center justify-end">
                      <span className="font-mono-tabular text-xs font-bold text-slate-700 dark:text-slate-200">
                        {formatTime(song.durationSec)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cyan-200/70 dark:border-cyan-500/20 bg-white/70 dark:bg-[#030b10]/80">
        <div className="max-w-[1220px] mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-gem text-cyan-500" />
            <span className="font-bold text-slate-900 dark:text-white">{profile.name}</span>
            <span aria-hidden="true">·</span>
            <span>Don&apos;t forget to send a proof after transfer</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#sosmed" className="hover:text-cyan-600 dark:hover:text-cyan-300">
              Sosmed
            </a>
            <a href="#games" className="hover:text-cyan-600 dark:hover:text-cyan-300">
              Nick Game
            </a>
            <a href="#utilities" className="hover:text-cyan-600 dark:hover:text-cyan-300">
              QRIS Resmi
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedGameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGameModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#071821] border border-cyan-300 dark:border-cyan-500/40 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cyan-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-cyan-300 bg-white dark:bg-slate-900 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={selectedGameModal.logoImage}
                      alt={selectedGameModal.title}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Kartu Identitas {selectedGameModal.title}
                    </h3>
                    <p className="text-xs font-mono-tabular text-cyan-700 dark:text-cyan-300">
                      {selectedGameModal.nickname} ({selectedGameModal.tagOrId})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGameModal(null)}
                  className="w-8 h-8 rounded-xl btn-glossy-ice flex items-center justify-center text-xs"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs bg-cyan-50/70 dark:bg-slate-900/80 p-4 rounded-2xl border border-cyan-200/70 dark:border-cyan-500/20">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nickname</span>
                  <span className="font-mono-tabular font-bold text-slate-900 dark:text-white">
                    {selectedGameModal.nickname}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tag / ID</span>
                  <span className="font-mono-tabular">{selectedGameModal.tagOrId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Server</span>
                  <span>{selectedGameModal.server}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode Favorit</span>
                  <span>{selectedGameModal.favoriteMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rank / Tier</span>
                  <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                    {selectedGameModal.rank}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const full =
                      selectedGameModal.id === 'valorant'
                        ? `${selectedGameModal.nickname}${selectedGameModal.tagOrId}`
                        : selectedGameModal.nickname;
                    handleCopyText(full, `ID ${selectedGameModal.title}`);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl btn-glossy-cyan text-xs font-bold flex items-center justify-center gap-2"
                >
                  <i className="fa-regular fa-copy" />
                  <span>Salin Nickname</span>
                </button>
                <a
                  href={`${profile.whatsappDirectUrl}?text=${encodeURIComponent(
                    `Halo ${profile.name}, ayo mabar ${selectedGameModal.title}! Aku sudah add nick ${selectedGameModal.nickname}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl btn-glossy-ice text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <i className="fa-brands fa-whatsapp" />
                  <span>Ajak Mabar</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl btn-glossy-cyan px-4 py-3 text-xs font-bold shadow-xl flex items-center gap-2.5"
          >
            <i className="fa-solid fa-circle-check text-sm shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
