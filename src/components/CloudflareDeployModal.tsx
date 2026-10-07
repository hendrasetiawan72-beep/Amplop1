import React, { useState } from 'react';
import {
  X,
  Cloud,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  GitBranch,
  Folder,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CloudflareDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareDeployModal: React.FC<CloudflareDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                Panduan Deploy ke Cloudflare Pages
              </h2>
              <p className="text-xs text-orange-100">
                Aplikasi telah dikonfigurasi siap pakai untuk Cloudflare Pages & Workers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Config Specs Card */}
          <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
              Parameter Pengaturan Build Cloudflare (Wajib Disalin)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 font-medium">Framework Preset:</span>
                <div className="font-bold text-gray-900 mt-0.5">Vite (atau None)</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 font-medium">Build Command:</span>
                  <div className="font-mono font-bold text-indigo-700 mt-0.5">
                    npm run build
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('npm run build', 'build_cmd')}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition"
                  title="Salin Command"
                >
                  {copiedKey === 'build_cmd' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 font-medium">Build Output Directory:</span>
                  <div className="font-mono font-bold text-indigo-700 mt-0.5">dist</div>
                </div>
                <button
                  onClick={() => handleCopy('dist', 'dist_dir')}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition"
                  title="Salin Nama Folder"
                >
                  {copiedKey === 'dist_dir' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 font-medium">Node.js Version:</span>
                <div className="font-bold text-gray-900 mt-0.5">18 atau 20 (Direkomendasikan)</div>
              </div>
            </div>
          </div>

          {/* Metode 1: GitHub */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-orange-600" />
              Metode 1: Hubungkan ke GitHub (Otomatis & Gratis)
            </h3>
            <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside bg-white p-4 rounded-xl border border-gray-200 leading-relaxed">
              <li>
                Buka Cloudflare Dashboard:{' '}
                <a
                  href="https://dash.cloudflare.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 font-semibold underline inline-flex items-center gap-1"
                >
                  dash.cloudflare.com
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>
                Pilih menu <strong>Workers & Pages</strong> &gt; Klik{' '}
                <strong>Create application</strong> &gt; Tab <strong>Pages</strong>.
              </li>
              <li>
                Pilih <strong>Connect to Git</strong> dan pilih repositori Anda.
              </li>
              <li>
                Masukkan <strong>Build command:</strong> <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-700 font-bold">npm run build</code>,{' '}
                <strong>Output directory:</strong> <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-700 font-bold">dist</code>, dan pastikan <strong>Deploy command</strong> dibiarkan <strong>KOSONG</strong>.
              </li>
              <li>
                Klik <strong>Save and Deploy</strong>. Selesai! Web Anda akan aktif dengan domain <code className="text-emerald-700 font-bold">*.pages.dev</code>.
              </li>
            </ol>
          </div>

          {/* Metode 2: Terminal Wrangler */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              Metode 2: Deploy Manual via Terminal (Wrangler CLI)
            </h3>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400 pb-1 border-b border-gray-800">
                <span>Jalankan di terminal proyek Anda:</span>
                <button
                  onClick={() =>
                    handleCopy(
                      'npm run build && npx wrangler pages deploy dist --project-name=amplop1',
                      'wrangler_cmd'
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300"
                >
                  {copiedKey === 'wrangler_cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Salin Perintah
                    </>
                  )}
                </button>
              </div>
              <p className="text-emerald-400"># 1. Build berkas produksi</p>
              <p className="text-white">npm run build</p>
              <p className="text-emerald-400 pt-1"># 2. Deploy langsung ke Cloudflare Pages</p>
              <p className="text-amber-300">npx wrangler pages deploy dist --project-name=amplop1</p>
            </div>
          </div>

          {/* Berkas Penunjang */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <Check className="w-4 h-4 text-emerald-600" />
              Berkas Khusus Cloudflare Telah Dikonfigurasi Otomatis:
            </div>
            <ul className="list-disc list-inside space-y-1 text-emerald-800 mt-2">
              <li>
                <strong>public/_redirects:</strong> Memastikan rute SPA bekerja tanpa galat 404 saat direfresh.
              </li>
              <li>
                <strong>public/_headers:</strong> Optimasi *caching* aset statis dan keamanan header HTTP.
              </li>
              <li>
                <strong>wrangler.toml:</strong> Berkas deklarasi konfigurasi Cloudflare Pages.
              </li>
              <li>
                <strong>package-lock.json:</strong> Pengganti <code className="font-mono text-emerald-900">bun.lock</code> untuk menghindari error <code className="font-mono text-rose-700">Unknown lockfile version 2</code> di Cloudflare Pages.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Lihat juga berkas <code className="font-mono text-gray-700">CLOUDFLARE_DEPLOY.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
