import React, { useRef } from 'react';
import { X, RotateCcw, Upload, Image as ImageIcon, Sliders } from 'lucide-react';
import { LetterheadConfig, EnvelopeSettings } from '../types';
import { DEFAULT_LETTERHEAD, DEFAULT_LOGO_URL } from '../data/initialData';

interface LetterheadSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterhead: LetterheadConfig;
  onUpdateLetterhead: (updated: Partial<LetterheadConfig>) => void;
  settings: EnvelopeSettings;
  onUpdateSettings: (updated: Partial<EnvelopeSettings>) => void;
}

export const LetterheadSettingsModal: React.FC<LetterheadSettingsModalProps> = ({
  isOpen,
  onClose,
  letterhead,
  onUpdateLetterhead,
  settings,
  onUpdateSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateLetterhead({ logoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetKop = () => {
    if (confirm('Kembalikan kop surat ke format resmi SMK Muhammadiyah Bawang?')) {
      onUpdateLetterhead(DEFAULT_LETTERHEAD);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Pengaturan Kop Surat (Letterhead)
            </h2>
            <p className="text-xs text-gray-500">
              Sesuaikan teks kop, logo resmi, dan garis pemisah amplop.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Logo Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4">
            <div className="w-20 h-20 bg-white border border-gray-300 rounded-xl p-1 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={letterhead.logoUrl}
                alt="Logo Sekolah"
                className="max-h-full max-w-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1 min-w-[200px] space-y-2">
              <div className="text-xs font-bold text-gray-700 uppercase">
                Logo Sekolah (Kop Surat Kiri)
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  Ganti Gambar Logo
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLetterhead({ logoUrl: DEFAULT_LOGO_URL })}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                >
                  Logo Resmi SMK Muh Bawang
                </button>
              </div>

              {/* Logo Width Slider */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] font-medium text-gray-500">Ukuran Logo:</span>
                <input
                  type="range"
                  min="70"
                  max="140"
                  value={letterhead.logoWidth}
                  onChange={(e) =>
                    onUpdateLetterhead({ logoWidth: Number(e.target.value) })
                  }
                  className="w-36 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-[11px] font-bold text-gray-700">
                  {letterhead.logoWidth}px
                </span>
              </div>
            </div>
          </div>

          {/* Kop Text Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Yayasan / Majlis Pembina
              </label>
              <input
                type="text"
                value={letterhead.yayasan}
                onChange={(e) => onUpdateLetterhead({ yayasan: e.target.value })}
                className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 uppercase focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Daerah / Cabang
              </label>
              <input
                type="text"
                value={letterhead.daerah}
                onChange={(e) => onUpdateLetterhead({ daerah: e.target.value })}
                className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 uppercase focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Sekolah (Cetak Tebal)
              </label>
              <input
                type="text"
                value={letterhead.namaSekolah}
                onChange={(e) => onUpdateLetterhead({ namaSekolah: e.target.value })}
                className="w-full text-sm font-bold border border-gray-300 rounded-lg px-3 py-2 uppercase focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Akreditasi Toggle & Text */}
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-indigo-950 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={letterhead.showAkreditasi}
                    onChange={(e) =>
                      onUpdateLetterhead({ showAkreditasi: e.target.checked })
                    }
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  Tampilkan Status Akreditasi (Seperti Lampiran 2)
                </label>
                <p className="text-[11px] text-indigo-700 mt-0.5 ml-6">
                  Menampilkan teks TERAKREDITASI "A" di bawah nama sekolah
                </p>
              </div>
              {letterhead.showAkreditasi && (
                <input
                  type="text"
                  value={letterhead.akreditasi}
                  onChange={(e) => onUpdateLetterhead({ akreditasi: e.target.value })}
                  placeholder='TERAKREDITASI "A"'
                  className="text-xs font-bold w-44 border border-indigo-300 rounded-lg px-2.5 py-1 uppercase bg-white"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alamat Sekolah
              </label>
              <input
                type="text"
                value={letterhead.alamat}
                onChange={(e) => onUpdateLetterhead({ alamat: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kontak Email & Website
              </label>
              <input
                type="text"
                value={letterhead.kontakEmailWeb}
                onChange={(e) => onUpdateLetterhead({ kontakEmailWeb: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kode Pos, Telepon & Fax
              </label>
              <input
                type="text"
                value={letterhead.kontakTelpFax}
                onChange={(e) => onUpdateLetterhead({ kontakTelpFax: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Separator Line Style */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Garis Pemisah Kop Surat (Divider Line)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ doubleLineStyle: 'classic-double' })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    settings.doubleLineStyle === 'classic-double'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="w-full h-1 bg-black rounded-xs"></div>
                    <div className="w-full h-[1px] bg-black"></div>
                  </div>
                  <div className="text-xs font-bold text-gray-800">Garis Ganda Tebal</div>
                  <div className="text-[10px] text-gray-500">Standar resmi dinas</div>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ doubleLineStyle: 'thin-double' })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    settings.doubleLineStyle === 'thin-double'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="w-full h-[1.5px] bg-black"></div>
                    <div className="w-full h-[1.5px] bg-black"></div>
                  </div>
                  <div className="text-xs font-bold text-gray-800">Garis Ganda Tipis</div>
                  <div className="text-[10px] text-gray-500">Dua garis halus</div>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ doubleLineStyle: 'bold-single' })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    settings.doubleLineStyle === 'bold-single'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-full h-1 bg-black mb-3.5 rounded-xs"></div>
                  <div className="text-xs font-bold text-gray-800">Garis Tunggal</div>
                  <div className="text-[10px] text-gray-500">Minimalis tebal</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetKop}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Bawaan Sekolah
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
          >
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
