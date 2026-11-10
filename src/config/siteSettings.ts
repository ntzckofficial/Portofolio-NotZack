export interface SocialLink {
  id: string;
  name: string;
  handle: string;
  roleOrNote: string;
  url: string;
  icon: string;
  copyText: string;
}

export interface GameAccount {
  id: string;
  title: string;
  nickname: string;
  tagOrId: string;
  rank: string;
  server: string;
  favoriteMode: string;
  icon: string;
  logoImage: string;
  detailNote: string;
}

export interface QrisConfig {
  id: string;
  label: string;
  merchantName: string;
  nmid: string;
  acquirer: string;
  subtitle: string;
  supportedApps: string;
  reminderText: string;
  imageUrl: string;
  instructions: string[];
}

export interface FavoriteSong {
  id: string;
  number: string;
  title: string;
  artist: string;
  album: string;
  releaseYear: string;
  genre: string;
  mood: string;
  durationSec: number;
  artworkJpg: string;
  audioUrl: string;
}

export interface SeoConfig {
  siteUrl: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string;
  themeColor: string;
  ogImage: string;
  icon512: string;
  icon192: string;
  appleTouchIcon: string;
  faviconIco: string;
  favicoJpg: string;
}

export interface SiteSettings {
  seo: SeoConfig;
  profile: {
    name: string;
    username: string;
    tagline: string;
    shortBio: string;
    region: string;
    timezone: string;
    statusText: string;
    whatsappDirectUrl: string;
    avatarImage: string;
    backdropImage: string;
  };
  socials: SocialLink[];
  games: GameAccount[];
  qris: QrisConfig;
  playlist: FavoriteSong[];
}

export const SITE_SETTINGS: SiteSettings = {
  seo: {
    siteUrl: 'https://ais-pre-x6dxzfcsdqcctqfqynnddk-28343948057.asia-southeast1.run.app',
    siteName: 'NotZack Official Hub',
    title: 'NotZack — Official Profile, Gaming Roster & QRIS Hub',
    description:
      'Pusat akses resmi NotZack untuk jejaring sosial media, identitas akun game utama (Minecraft, Roblox, Valorant), layanan pembayaran QRIS resmi, dan pemutar musik pilihan.',
    keywords:
      'NotZack, NotZack Official, QRIS NotZack, Minecraft NotZackMC, Roblox NotZack_RBX, Valorant NotZack, Profile Hub',
    themeColor: '#06b6d4',
    ogImage: '/og-image.jpg',
    icon512: '/icon-512.png',
    icon192: '/icon-192.png',
    appleTouchIcon: '/apple-touch-icon.png',
    faviconIco: '/favicon.ico',
    favicoJpg: '/favico.jpg',
  },

  profile: {
    name: 'NotZack',
    username: '@notzack.official',
    tagline: 'Digital Creator · Gaming Hub · Official Merchant',
    shortBio:
      'Pusat akses resmi NotZack untuk jejaring sosial media, identitas akun game utama (Minecraft, Roblox, Valorant), layanan pembayaran QRIS resmi, dan pemutar musik pilihan.',
    region: 'Indonesia',
    timezone: 'WIB (UTC+7)',
    statusText: 'Online & Aktif',
    whatsappDirectUrl: 'https://wa.me/6281234567890',
    avatarImage: '/assets/avatar.jpg',
    backdropImage: '/assets/banner.jpg',
  },

  socials: [
    {
      id: 'discord',
      name: 'Discord',
      handle: 'notzack.gg',
      roleOrNote: 'Server Komunitas & Voice Mabar',
      url: 'https://discord.com',
      icon: 'fa-brands fa-discord',
      copyText: 'notzack.gg',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'NotZack Official',
      roleOrNote: 'Halaman Komunitas & Info Terbaru',
      url: 'https://facebook.com',
      icon: 'fa-brands fa-facebook-f',
      copyText: 'NotZack Official',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@notzack.ig',
      roleOrNote: 'Galeri Visual & Story Harian',
      url: 'https://instagram.com',
      icon: 'fa-brands fa-instagram',
      copyText: '@notzack.ig',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@notzack.clips',
      roleOrNote: 'Cuplikan Gameplay & Konten Kreatif',
      url: 'https://tiktok.com',
      icon: 'fa-brands fa-tiktok',
      copyText: '@notzack.clips',
    },
    {
      id: 'wa-bisnis',
      name: 'WA Bisnis',
      handle: '+62 812-3456-7890',
      roleOrNote: 'Layanan Order & Konfirmasi Bukti Transfer',
      url: 'https://wa.me/6281234567890',
      icon: 'fa-brands fa-whatsapp',
      copyText: '+6281234567890',
    },
    {
      id: 'saluran-ch',
      name: 'Saluran CH',
      handle: 'Saluran Resmi NotZack',
      roleOrNote: 'Katalog Produk, Stok & Testimoni',
      url: 'https://whatsapp.com/channel/0029Va0000000000000000',
      icon: 'fa-solid fa-bullhorn',
      copyText: 'https://whatsapp.com/channel/0029Va0000000000000000',
    },
  ],

  games: [
    {
      id: 'minecraft',
      title: 'Minecraft',
      nickname: 'NotZackMC',
      tagOrId: 'Java & Bedrock Edition',
      rank: 'MVP+ Builder',
      server: 'Hypixel & SMP Asia',
      favoriteMode: 'Survival SMP · SkyWars · BedWars',
      icon: 'fa-solid fa-cubes',
      logoImage: '/assets/games/minecraft.jpg',
      detailNote: 'Aktif membangun realm estetika dan mabar rutin setiap malam.',
    },
    {
      id: 'roblox',
      title: 'Roblox',
      nickname: 'NotZack_RBX',
      tagOrId: '@NotZack_RBX',
      rank: 'Verified Creator',
      server: 'Global / SEA Server',
      favoriteMode: 'Blox Fruits · Fisch · Driving Empire',
      icon: 'fa-solid fa-gamepad',
      logoImage: '/assets/games/roblox.jpg',
      detailNote: 'Open add friend dan join private server komunitas.',
    },
    {
      id: 'valorant',
      title: 'Valorant',
      nickname: 'NotZack',
      tagOrId: '#CYAN',
      rank: 'Ascendant III',
      server: 'AP · Singapore',
      favoriteMode: 'Competitive · Controller / Duelist',
      icon: 'fa-solid fa-crosshairs',
      logoImage: '/assets/games/valorant.png',
      detailNote: 'Main Omen, Jett & Clove di server Singapore ping rendah.',
    },
  ],

  qris: {
    id: 'qris-notzack',
    label: 'QRIS Resmi NotZack',
    merchantName: 'NOTZACK OFFICIAL STORE',
    nmid: 'ID1026000882910',
    acquirer: 'All E-Wallet & Mobile Banking',
    subtitle: 'Pembayaran Instan Satu Pintu via QRIS Nasional',
    supportedApps: 'DANA · GoPay · OVO · ShopeePay · BCA · Mandiri · BRI · BNI · SeaBank',
    reminderText: "Don't forget to send a proof after transfer",
    imageUrl: '/assets/qris-notzack.jpg',
    instructions: [
      'Buka aplikasi E-Wallet atau Mobile Banking pilihan Anda.',
      'Pilih menu Scan QRIS lalu arahkan kamera ke kode QR NotZack.',
      'Masukkan nominal sesuai pesanan dan simpan bukti transaksi berhasil.',
      'Kirimkan bukti transfer ke WhatsApp Bisnis agar pesanan langsung diproses.',
    ],
  },

  playlist: [
    {
      id: 'song-01',
      number: '01',
      title: 'changes',
      artist: 'XXXTENTACION',
      album: '?',
      releaseYear: '2018',
      genre: 'Acoustic Ballad',
      mood: 'Melancholic',
      durationSec: 123,
      artworkJpg: '/assets/covers/song-01.jpg',
      audioUrl: '/assets/audio/song-01.m4a',
    },
    {
      id: 'song-02',
      number: '02',
      title: 'Doa',
      artist: 'K3bi',
      album: 'Doa - Single',
      releaseYear: '2024',
      genre: 'Indonesian Hip-Hop',
      mood: 'Reflective',
      durationSec: 161,
      artworkJpg: '/assets/covers/song-02.jpg',
      audioUrl: '/assets/audio/song-02.m4a',
    },
    {
      id: 'song-03',
      number: '03',
      title: 'Silence',
      artist: 'Marshmello ft. Khalid',
      album: 'Silence - Single',
      releaseYear: '2017',
      genre: 'Electronic Pop',
      mood: 'Euphoric',
      durationSec: 181,
      artworkJpg: '/assets/covers/song-03.jpg',
      audioUrl: '/assets/audio/song-03.m4a',
    },
    {
      id: 'song-04',
      number: '04',
      title: 'Raindance',
      artist: 'Dave ft. Tems',
      album: 'The Boy Who Played the Harp',
      releaseYear: '2023',
      genre: 'Afro-Fusion',
      mood: 'Smooth',
      durationSec: 200,
      artworkJpg: '/assets/covers/song-04.jpg',
      audioUrl: '/assets/audio/song-04.m4a',
    },
    {
      id: 'song-05',
      number: '05',
      title: 'Me & U',
      artist: 'Cassie',
      album: 'Cassie',
      releaseYear: '2006',
      genre: 'R&B',
      mood: 'Classic',
      durationSec: 200,
      artworkJpg: '/assets/covers/song-05.jpg',
      audioUrl: '/assets/audio/song-05.m4a',
    },
    {
      id: 'song-06',
      number: '06',
      title: 'What If I Call',
      artist: 'Cammie',
      album: 'What If I Call',
      releaseYear: '2024',
      genre: 'Pop R&B',
      mood: 'Late Night',
      durationSec: 176,
      artworkJpg: '/assets/covers/song-06.jpg',
      audioUrl: '/assets/audio/song-06.m4a',
    },
    {
      id: 'song-07',
      number: '07',
      title: 'Treat You Better',
      artist: 'Shawn Mendes',
      album: 'Illuminate',
      releaseYear: '2016',
      genre: 'Pop',
      mood: 'Upbeat',
      durationSec: 182,
      artworkJpg: '/assets/covers/song-07.jpg',
      audioUrl: '/assets/audio/song-07.m4a',
    },
    {
      id: 'song-08',
      number: '08',
      title: 'That Should Be Me',
      artist: 'Justin Bieber',
      album: 'My World 2.0',
      releaseYear: '2010',
      genre: 'Pop Ballad',
      mood: 'Emotional',
      durationSec: 229,
      artworkJpg: '/assets/covers/song-08.jpg',
      audioUrl: '/assets/audio/song-08.mp3',
    },
    {
      id: 'song-09',
      number: '09',
      title: 'You & I',
      artist: 'One Direction',
      album: 'Midnight Memories',
      releaseYear: '2013',
      genre: 'Pop Ballad',
      mood: 'Anthemic',
      durationSec: 264,
      artworkJpg: '/assets/covers/song-09.jpg',
      audioUrl: '/assets/audio/song-09.mp3',
    },
    {
      id: 'song-10',
      number: '10',
      title: 'The Night We Met',
      artist: 'Lord Huron',
      album: 'Strange Trails',
      releaseYear: '2015',
      genre: 'Indie Folk',
      mood: 'Nostalgic',
      durationSec: 208,
      artworkJpg: '/assets/covers/song-10.jpg',
      audioUrl: '/assets/audio/song-10.m4a',
    },
    {
      id: 'song-11',
      number: '11',
      title: 'Bawa Dia Kembali',
      artist: 'Mahalini',
      album: 'Fabula',
      releaseYear: '2023',
      genre: 'Indonesian Pop',
      mood: 'Heartfelt',
      durationSec: 252,
      artworkJpg: '/assets/covers/song-11.jpg',
      audioUrl: '/assets/audio/song-11.m4a',
    },
    {
      id: 'song-12',
      number: '12',
      title: 'Cry',
      artist: 'Cigarettes After Sex',
      album: 'Cry',
      releaseYear: '2019',
      genre: 'Dream Pop',
      mood: 'Dreamy',
      durationSec: 257,
      artworkJpg: '/assets/covers/song-12.jpg',
      audioUrl: '/assets/audio/song-12.m4a',
    },
    {
      id: 'song-13',
      number: '13',
      title: 'Jiwa Yang Bersedih',
      artist: 'Ghea Indrawari',
      album: 'Berdamai',
      releaseYear: '2023',
      genre: 'Indonesian Pop',
      mood: 'Warm Comfort',
      durationSec: 269,
      artworkJpg: '/assets/covers/song-13.jpg',
      audioUrl: '/assets/audio/song-13.m4a',
    },
    {
      id: 'song-14',
      number: '14',
      title: 'Iqro',
      artist: 'Raim Laode',
      album: 'Iqro - Single',
      releaseYear: '2024',
      genre: 'Indonesian Folk Pop',
      mood: 'Inspiring',
      durationSec: 235,
      artworkJpg: '/assets/covers/song-14.jpg',
      audioUrl: '/assets/audio/song-14.m4a',
    },
    {
      id: 'song-15',
      number: '15',
      title: 'Dunia Yang Nanti',
      artist: 'Raim Laode',
      album: 'Dunia Yang Nanti - Single',
      releaseYear: '2024',
      genre: 'Acoustic Folk',
      mood: 'Contemplative',
      durationSec: 201,
      artworkJpg: '/assets/covers/song-15.jpg',
      audioUrl: '/assets/audio/song-15.m4a',
    },
    {
      id: 'song-16',
      number: '16',
      title: 'Just Give Me a Reason',
      artist: 'P!nk ft. Nate Ruess',
      album: 'The Truth About Love',
      releaseYear: '2012',
      genre: 'Pop Duet',
      mood: 'Soaring',
      durationSec: 236,
      artworkJpg: '/assets/covers/song-16.jpg',
      audioUrl: '/assets/audio/song-16.m4a',
    },
    {
      id: 'song-17',
      number: '17',
      title: 'The Cure',
      artist: 'Lady Gaga',
      album: 'The Cure - Single',
      releaseYear: '2017',
      genre: 'Synth-Pop',
      mood: 'Uplifting',
      durationSec: 190,
      artworkJpg: '/assets/covers/song-17.jpg',
      audioUrl: '/assets/audio/song-17.m4a',
    },
    {
      id: 'song-18',
      number: '18',
      title: 'The One That Got Away',
      artist: 'Katy Perry',
      album: 'Teenage Dream',
      releaseYear: '2010',
      genre: 'Pop',
      mood: 'Bittersweet',
      durationSec: 239,
      artworkJpg: '/assets/covers/song-18.jpg',
      audioUrl: '/assets/audio/song-18.m4a',
    },
    {
      id: 'song-19',
      number: '19',
      title: 'Menari-nari',
      artist: 'Raim Laode',
      album: 'Menari-nari - Single',
      releaseYear: '2024',
      genre: 'Indonesian Indie Pop',
      mood: 'Warm & Joyful',
      durationSec: 266,
      artworkJpg: '/assets/covers/song-19.jpg',
      audioUrl: '/assets/audio/song-19.m4a',
    },
  ],
};
