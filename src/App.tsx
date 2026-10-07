/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Printer,
  FileSpreadsheet,
  Settings,
  Users,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Image as ImageIcon,
  Check,
  Loader2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

import {
  Student,
  LetterheadConfig,
  EnvelopeSettings,
  EnvelopeDimensions,
} from './types';
import {
  DEFAULT_LETTERHEAD,
  DEFAULT_LOGO_URL,
  DEFAULT_SETTINGS,
  INITIAL_STUDENTS,
  PAPER_PRESETS,
} from './data/initialData';
import { EnvelopeView } from './components/EnvelopeView';
import { StudentNavigator } from './components/StudentNavigator';
import { StudentDataPage } from './components/StudentDataPage';
import { StudentManagerModal } from './components/StudentManagerModal';
import { LetterheadSettingsModal } from './components/LetterheadSettingsModal';
import { PrintSettingsModal } from './components/PrintSettingsModal';
import { BatchPrintModal } from './components/BatchPrintModal';
import { exportEnvelopeToImage, exportEnvelopeToPdf } from './utils/exportUtils';

export default function App() {
  // Navigation: Active Page ('print' | 'data')
  const [activePage, setActivePage] = useState<'print' | 'data'>('print');

  // State: Students list
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('smk_envelope_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // State: Current student index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // State: Letterhead (with migration to new logo if old logo was cached)
  const [letterhead, setLetterhead] = useState<LetterheadConfig>(() => {
    try {
      const saved = localStorage.getItem('smk_envelope_letterhead');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If old logo was stored, update to requested new logo
        if (parsed.logoUrl?.includes('44857.png')) {
          parsed.logoUrl = DEFAULT_LOGO_URL;
        }
        return parsed;
      }
      return DEFAULT_LETTERHEAD;
    } catch {
      return DEFAULT_LETTERHEAD;
    }
  });

  // State: Settings
  const [settings, setSettings] = useState<EnvelopeSettings>(() => {
    try {
      const saved = localStorage.getItem('smk_envelope_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // State: Modals
  const [showStudentManager, setShowStudentManager] = useState(false);
  const [showLetterheadModal, setShowLetterheadModal] = useState(false);
  const [showPrintSettingsModal, setShowPrintSettingsModal] = useState(false);
  const [showBatchPrintModal, setShowBatchPrintModal] = useState(false);

  // Batch print targets for printing
  const [batchPrintList, setBatchPrintList] = useState<Student[]>([]);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preview zoom scale
  const [previewScale, setPreviewScale] = useState<number>(0.85);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smk_envelope_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('smk_envelope_letterhead', JSON.stringify(letterhead));
    } catch (e) {
      console.error(e);
    }
  }, [letterhead]);

  useEffect(() => {
    try {
      localStorage.setItem('smk_envelope_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Current paper info
  const currentPaper: EnvelopeDimensions = useMemo(() => {
    return (
      PAPER_PRESETS.find((p) => p.id === settings.paperSize) ||
      PAPER_PRESETS[0]
    );
  }, [settings.paperSize]);

  // Auto-fit scale on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 48; // padding
        const paperWidthPx = currentPaper.widthMm * 3.78;
        if (paperWidthPx > 0 && containerWidth > 0) {
          const fitRatio = Math.min(1.0, containerWidth / paperWidthPx);
          setPreviewScale((prev) =>
            prev === 0.85 ? Math.max(0.45, Math.min(fitRatio * 0.95, 1.0)) : prev
          );
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPaper, activePage]);

  // Keyboard navigation for quick browsing (only in print view)
  useEffect(() => {
    if (activePage !== 'print') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement).tagName
        )
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(students.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [students.length, activePage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleQuickUpdateCurrent = (updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s, idx) => (idx === currentIndex ? { ...s, ...updated } : s))
    );
  };

  // Trigger browser print for single student
  const handlePrintSingle = () => {
    setBatchPrintList([students[currentIndex] || students[0]]);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Trigger browser print for batch
  const handleConfirmBatchPrint = (selected: Student[]) => {
    setBatchPrintList(selected);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Export single envelope to PDF
  const handleDownloadSinglePdf = async () => {
    try {
      setIsExporting('pdf');
      const student = students[currentIndex] || students[0];
      const filename = `Amplop_Raport_Absen_${student.absen}_${student.nama.replace(/\s+/g, '_')}.pdf`;
      await exportEnvelopeToPdf(
        'envelope-preview-sheet',
        filename,
        currentPaper.widthMm,
        currentPaper.heightMm
      );
      showToast('Amplop berhasil diunduh dalam format PDF!');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PDF. Anda dapat menggunakan tombol Cetak > Simpan sebagai PDF.');
    } finally {
      setIsExporting(null);
    }
  };

  // Export single envelope to PNG
  const handleDownloadSingleImage = async () => {
    try {
      setIsExporting('png');
      const student = students[currentIndex] || students[0];
      const filename = `Amplop_Raport_Absen_${student.absen}_${student.nama.replace(/\s+/g, '_')}.png`;
      await exportEnvelopeToImage('envelope-preview-sheet', filename);
      showToast('Gambar amplop resolusi tinggi (PNG) berhasil diunduh!');
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh gambar.');
    } finally {
      setIsExporting(null);
    }
  };

  const handleNavigateToPrint = (selectedStudentIndex?: number) => {
    if (typeof selectedStudentIndex === 'number' && selectedStudentIndex >= 0) {
      setCurrentIndex(selectedStudentIndex);
    }
    setActivePage('print');
  };

  const currentStudent = students[currentIndex] || {
    id: '1',
    absen: 1,
    nama: 'ABDULLAH KAFA BIHI',
    kelas: 'XI TKR 1',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER / APP BAR */}
      <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand & School Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              ✉
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-gray-950 truncate tracking-tight">
                  PRINT AMPLOP RAPORT
                </h1>
                <span className="hidden sm:inline bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  SMK MUHIBA
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate hidden md:block">
                SMK Muhammadiyah Bawang • Format Standar Resmi & Siap Cetak
              </p>
            </div>
          </div>

          {/* PAGE NAVIGATION TABS */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setActivePage('print')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activePage === 'print'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Amplop</span>
            </button>
            <button
              onClick={() => setActivePage('data')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activePage === 'data'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Data Siswa & Upload Excel</span>
              <span className="ml-1 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {students.length}
              </span>
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Kop Surat Settings */}
            <button
              onClick={() => setShowLetterheadModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition shadow-2xs"
              title="Atur teks kop, logo, dan garis"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden lg:inline">Kop Surat</span>
            </button>

            {/* Paper & Layout Settings */}
            <button
              onClick={() => setShowPrintSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition shadow-2xs"
              title="Pilih ukuran kertas & posisi margin"
            >
              <Settings className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Ukuran & Format</span>
            </button>

            {activePage === 'print' ? (
              <>
                {/* Download PDF button */}
                <button
                  onClick={handleDownloadSinglePdf}
                  disabled={isExporting !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition shadow-2xs"
                  title="Download PDF amplop siswa saat ini"
                >
                  {isExporting === 'pdf' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 text-indigo-600" />
                  )}
                  <span className="hidden sm:inline">Unduh PDF</span>
                </button>

                {/* Print Button (Primary) */}
                <button
                  onClick={() => setShowBatchPrintModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md shadow-indigo-200"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Amplop</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActivePage('print')}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md shadow-indigo-200"
              >
                <Printer className="w-4 h-4" />
                <span>Lihat Amplop</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* RENDER PAGE BASED ON ACTIVE TAB */}
      {activePage === 'data' ? (
        /* DEDICATED FULL PAGE FOR STUDENT DATA & EXCEL UPLOAD */
        <main className="no-print flex-1 flex flex-col">
          <StudentDataPage
            students={students}
            onUpdateStudents={setStudents}
            onNavigateToPrint={handleNavigateToPrint}
          />
        </main>
      ) : (
        /* ENVELOPE PREVIEW & PRINT STUDIO */
        <>
          {/* STUDENT NAVIGATOR BAR */}
          <div className="no-print">
            <StudentNavigator
              students={students}
              currentIndex={currentIndex}
              onSelectIndex={setCurrentIndex}
              onOpenStudentManager={() => setActivePage('data')}
              onQuickUpdateCurrent={handleQuickUpdateCurrent}
            />
          </div>

          {/* WORKSPACE / ENVELOPE CANVAS */}
          <main className="no-print flex-1 flex flex-col p-4 sm:p-6 items-center">
            {/* Canvas Toolbar (Paper Info & Zoom controls) */}
            <div className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 bg-white/70 backdrop-blur-xs px-4 py-2 rounded-xl border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span>Ukuran Kertas:</span>
                  <span className="text-indigo-600">{currentPaper.name}</span>
                  <span className="text-gray-400 font-normal">
                    ({currentPaper.widthMm} × {currentPaper.heightMm} mm)
                  </span>
                </div>
                <button
                  onClick={() => setShowPrintSettingsModal(true)}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Ubah
                </button>
              </div>

              {/* Quick instructions & zoom stepper */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 hidden sm:inline">
                  Tips: Gunakan tombol panah ◄ ► pada keyboard untuk ganti siswa
                </span>

                {/* Zoom Stepper */}
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                  <button
                    onClick={() => setPreviewScale((s) => Math.max(0.4, s - 0.1))}
                    className="p-1 hover:bg-white rounded transition text-gray-700"
                    title="Perkecil Tampilan"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-[11px] font-bold text-gray-700 w-12 text-center">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    onClick={() => setPreviewScale((s) => Math.min(1.4, s + 0.1))}
                    className="p-1 hover:bg-white rounded transition text-gray-700"
                    title="Perbesar Tampilan"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewScale(1.0)}
                    className="px-2 py-0.5 text-[10px] font-semibold text-gray-600 hover:bg-white rounded transition"
                    title="Skala Asli 100%"
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>

            {/* Paper Container Viewport */}
            <div
              ref={previewContainerRef}
              className="w-full flex-1 flex flex-col items-center justify-start overflow-auto p-4 py-6"
            >
              {/* Wrapper to maintain scaled height */}
              <div
                style={{
                  width: `${currentPaper.widthMm * 3.78 * previewScale}px`,
                  height: `${currentPaper.heightMm * 3.78 * previewScale}px`,
                }}
                className="flex items-start justify-center"
              >
                <div id="envelope-preview-sheet" className="envelope-screen-shadow">
                  <EnvelopeView
                    student={currentStudent}
                    letterhead={letterhead}
                    settings={settings}
                    paperInfo={currentPaper}
                    scale={previewScale}
                    isPrintMode={false}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Quick Bar */}
            <div className="w-full max-w-5xl mt-3 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm">
                  {currentStudent.absen}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase">
                    {currentStudent.nama}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Kelas: {currentStudent.kelas}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('data')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition"
                  title="Buka form input data siswa dan upload Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Upload Excel</span>
                </button>

                <button
                  onClick={handleDownloadSingleImage}
                  disabled={isExporting !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-300 transition"
                  title="Unduh file PNG resolusi tinggi"
                >
                  {isExporting === 'png' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span>Unduh PNG</span>
                </button>

                <button
                  onClick={handlePrintSingle}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition"
                  title="Cetak amplop siswa yang sedang tampil ini"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Siswa Ini</span>
                </button>

                <button
                  onClick={() => setShowBatchPrintModal(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Cetak Semua ({students.length})</span>
                </button>
              </div>
            </div>
          </main>
        </>
      )}

      {/* PRINT-ONLY RENDER CONTAINER */}
      {/* This renders only when window.print() is called, producing pure white, 100% vector print! */}
      <div className="print-only-container">
        {(batchPrintList.length > 0 ? batchPrintList : [currentStudent]).map(
          (st) => (
            <div key={st.id} className="envelope-print-sheet">
              <EnvelopeView
                student={st}
                letterhead={letterhead}
                settings={settings}
                paperInfo={currentPaper}
                scale={1}
                isPrintMode={true}
              />
            </div>
          )
        )}
      </div>

      {/* MODALS */}
      <StudentManagerModal
        isOpen={showStudentManager}
        onClose={() => setShowStudentManager(false)}
        students={students}
        onSaveStudents={setStudents}
        onSelectStudentIndex={setCurrentIndex}
      />

      <LetterheadSettingsModal
        isOpen={showLetterheadModal}
        onClose={() => setShowLetterheadModal(false)}
        letterhead={letterhead}
        onUpdateLetterhead={(updated) =>
          setLetterhead((prev) => ({ ...prev, ...updated }))
        }
        settings={settings}
        onUpdateSettings={(updated) =>
          setSettings((prev) => ({ ...prev, ...updated }))
        }
      />

      <PrintSettingsModal
        isOpen={showPrintSettingsModal}
        onClose={() => setShowPrintSettingsModal(false)}
        settings={settings}
        onUpdateSettings={(updated) =>
          setSettings((prev) => ({ ...prev, ...updated }))
        }
      />

      <BatchPrintModal
        isOpen={showBatchPrintModal}
        onClose={() => setShowBatchPrintModal(false)}
        students={students}
        currentStudentIndex={currentIndex}
        onConfirmBatchPrint={handleConfirmBatchPrint}
        onDownloadPdfBatch={() => {}}
      />
    </div>
  );
}
