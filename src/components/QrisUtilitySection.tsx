import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrisConfig } from '../config/siteSettings';

interface QrisUtilitySectionProps {
  qris: QrisConfig;
  whatsappUrl: string;
  onNotify: (msg: string) => void;
}

export const QrisUtilitySection: React.FC<QrisUtilitySectionProps> = ({
  qris,
  whatsappUrl,
  onNotify,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const handleDownloadJpg = () => {
    const a = document.createElement('a');
    a.href = qris.imageUrl;
    a.download = 'QRIS-NotZack-Official.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onNotify('Gambar QRIS NotZack (.JPG) berhasil diunduh');
  };

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(qris.nmid);
    onNotify(`NMID (${qris.nmid}) berhasil disalin`);
  };

  return (
    <section id="utilities" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="rounded-[2rem] glass-surface p-6 sm:p-10 overflow-hidden relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              whileHover={{ y: -5, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              onClick={() => setIsZoomed(true)}
              className="group relative w-full max-w-[390px] aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-cyan-300/90 dark:border-cyan-400/40 shadow-[0_24px_60px_-15px_rgba(6,182,212,0.35)] cursor-pointer"
            >
              <img
                src={qris.imageUrl}
                alt={qris.merchantName}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/15">
                <i className="fa-solid fa-magnifying-glass-plus text-cyan-300" />
                <span>Perbesar QRIS</span>
              </div>
            </motion.div>

            <div className="w-full max-w-[390px] grid grid-cols-2 gap-3 mt-4">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsZoomed(true)}
                className="py-3 px-4 rounded-2xl btn-glossy-cyan text-xs font-bold flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-expand" />
                <span>Layar Penuh</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleDownloadJpg}
                className="py-3 px-4 rounded-2xl btn-glossy-ice text-xs font-bold flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-download" />
                <span>Unduh .JPG</span>
              </motion.button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular font-semibold text-cyan-600 dark:text-cyan-300">
                <i className="fa-solid fa-qrcode" />
                <span>{qris.label}</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={handleCopyNmid}
                  className="hover:underline flex items-center gap-1"
                >
                  <span>NMID {qris.nmid}</span>
                  <i className="fa-regular fa-copy text-[10px]" />
                </button>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {qris.merchantName}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {qris.subtitle}. Mendukung penuh {qris.supportedApps}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {qris.instructions.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.28 }}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/65 border border-cyan-200/70 dark:border-cyan-500/20 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg btn-glossy-cyan text-[11px] font-mono-tabular font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-transparent border border-cyan-300/60 dark:border-cyan-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-cyan-500" />
                  <span>{qris.reminderText}</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Kirimkan tangkapan layar bukti pembayaran Anda ke WhatsApp Bisnis NotZack.
                </p>
              </div>

              <a
                href={`${whatsappUrl}?text=${encodeURIComponent(
                  'Halo NotZack, saya sudah melakukan pembayaran via QRIS. Berikut bukti transfernya:'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl btn-glossy-cyan text-xs font-bold whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
              >
                <i className="fa-brands fa-whatsapp text-sm" />
                <span>Kirim Bukti Transfer</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#071821] border border-cyan-300 dark:border-cyan-500/40 p-5 sm:p-6 text-center shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-cyan-100 dark:border-slate-800 pb-3">
                <div className="text-left">
                  <span className="text-xs font-mono-tabular font-bold text-cyan-600 dark:text-cyan-400 block">
                    {qris.label}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {qris.merchantName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  className="w-8 h-8 rounded-xl btn-glossy-ice flex items-center justify-center text-xs"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-cyan-300 bg-white">
                <img
                  src={qris.imageUrl}
                  alt={qris.merchantName}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                {qris.reminderText}
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadJpg}
                  className="flex-1 py-2.5 px-4 rounded-xl btn-glossy-cyan text-xs font-bold flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-download" />
                  <span>Unduh Gambar (.JPG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  className="py-2.5 px-4 rounded-xl btn-glossy-ice text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
