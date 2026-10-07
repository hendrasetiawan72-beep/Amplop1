import React from 'react';
import {
  X,
  Printer,
  Sliders,
  Move,
  Layers,
  Square,
  Sparkles,
  Check,
} from 'lucide-react';
import { EnvelopeSettings, PaperPreset } from '../types';
import { PAPER_PRESETS } from '../data/initialData';

interface PrintSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EnvelopeSettings;
  onUpdateSettings: (updated: Partial<EnvelopeSettings>) => void;
}

export const PrintSettingsModal: React.FC<PrintSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Format Ukuran Kertas & Tata Letak Cetak
            </h2>
            <p className="text-xs text-gray-500">
              Pilih ukuran amplop, kalibrasi margin printer, dan opsi tampilan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Paper Preset Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">
              Ukuran Kertas / Amplop
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PAPER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onUpdateSettings({ paperSize: preset.id })}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between transition ${
                    settings.paperSize === preset.id
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {preset.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {preset.desc}
                    </div>
                  </div>
                  {settings.paperSize === preset.id && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Kotak Tujuan (Recipient Box) Styling */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Pengaturan Kotak Nama & Penerima (Tujuan)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Label Baris 1
                </label>
                <input
                  type="text"
                  value={settings.recipientTitle}
                  onChange={(e) =>
                    onUpdateSettings({ recipientTitle: e.target.value })
                  }
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Label Baris 2
                </label>
                <input
                  type="text"
                  value={settings.recipientSubtitle}
                  onChange={(e) =>
                    onUpdateSettings({ recipientSubtitle: e.target.value })
                  }
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer bg-white p-2 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  checked={settings.nameUnderline}
                  onChange={(e) =>
                    onUpdateSettings({ nameUnderline: e.target.checked })
                  }
                  className="rounded text-indigo-600"
                />
                Garis Bawah Nama
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer bg-white p-2 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  checked={settings.nameBold}
                  onChange={(e) =>
                    onUpdateSettings({ nameBold: e.target.checked })
                  }
                  className="rounded text-indigo-600"
                />
                Nama Tebal (Bold)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer bg-white p-2 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  checked={settings.uppercaseName}
                  onChange={(e) =>
                    onUpdateSettings({ uppercaseName: e.target.checked })
                  }
                  className="rounded text-indigo-600"
                />
                Huruf Kapital
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Ketebalan Garis Kotak: {settings.borderThickness}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={settings.borderThickness}
                  onChange={(e) =>
                    onUpdateSettings({ borderThickness: Number(e.target.value) })
                  }
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Lengkungan Sudut: {settings.boxBorderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="2"
                  value={settings.boxBorderRadius}
                  onChange={(e) =>
                    onUpdateSettings({ boxBorderRadius: Number(e.target.value) })
                  }
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Elemen Tambahan */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Elemen Amplop Tambahan
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={settings.showAbsenBadge}
                  onChange={(e) =>
                    onUpdateSettings({ showAbsenBadge: e.target.checked })
                  }
                  className="rounded text-indigo-600 mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    Badge Kotak Nomor Absen (Kiri)
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Menampilkan kotak angka absen seperti di Lampiran 1
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={settings.showCropMarks}
                  onChange={(e) =>
                    onUpdateSettings({ showCropMarks: e.target.checked })
                  }
                  className="rounded text-indigo-600 mt-0.5"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    Tanda Garis Potong (Corner Crop Marks)
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Garis siku bantu potong / lipatan amplop di 4 sudut
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Kalibrasi Posisi Printer (Printer Offset) */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-amber-700" />
              <div className="text-xs font-bold text-amber-900 uppercase">
                Kalibrasi Posisi Cetak Printer (Milimeter)
              </div>
            </div>
            <p className="text-[11px] text-amber-800">
              Gunakan jika tray printer fisik Anda mencetak sedikit terlalu ke kiri/kanan/atas.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-amber-950 mb-1">
                  <span>Geser Horizontal (X):</span>
                  <span className="font-bold">{settings.printerOffsetX} mm</span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="25"
                  value={settings.printerOffsetX}
                  onChange={(e) =>
                    onUpdateSettings({ printerOffsetX: Number(e.target.value) })
                  }
                  className="w-full h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-amber-700 mt-0.5">
                  <span>← Kiri</span>
                  <span>Kanan →</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-amber-950 mb-1">
                  <span>Geser Vertikal (Y):</span>
                  <span className="font-bold">{settings.printerOffsetY} mm</span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="25"
                  value={settings.printerOffsetY}
                  onChange={(e) =>
                    onUpdateSettings({ printerOffsetY: Number(e.target.value) })
                  }
                  className="w-full h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-amber-700 mt-0.5">
                  <span>↑ Atas</span>
                  <span>Bawah ↓</span>
                </div>
              </div>
            </div>

            {(settings.printerOffsetX !== 0 || settings.printerOffsetY !== 0) && (
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ printerOffsetX: 0, printerOffsetY: 0 })
                }
                className="text-[11px] text-amber-900 underline font-semibold"
              >
                Reset ke 0 mm (Tengah Sempurna)
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
          >
            Terapkan & Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
