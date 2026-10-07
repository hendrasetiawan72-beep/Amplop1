import React, { useState } from 'react';
import {
  X,
  Printer,
  FileDown,
  Layers,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Student } from '../types';

interface BatchPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentStudentIndex: number;
  onConfirmBatchPrint: (selectedStudents: Student[]) => void;
  onDownloadPdfBatch: (selectedStudents: Student[]) => void;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  isOpen,
  onClose,
  students,
  currentStudentIndex,
  onConfirmBatchPrint,
  onDownloadPdfBatch,
}) => {
  const [printOption, setPrintOption] = useState<'current' | 'all' | 'range' | 'custom'>('all');
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(Math.min(18, students.length));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(students.map((s) => s.id))
  );

  if (!isOpen) return null;

  const currentStudent = students[currentStudentIndex] || students[0];

  const getSelectedStudents = (): Student[] => {
    if (printOption === 'current') {
      return [currentStudent];
    }
    if (printOption === 'all') {
      return students;
    }
    if (printOption === 'range') {
      return students.filter((s) => s.absen >= rangeStart && s.absen <= rangeEnd);
    }
    if (printOption === 'custom') {
      return students.filter((s) => selectedIds.has(s.id));
    }
    return [currentStudent];
  };

  const selectedList = getSelectedStudents();

  const handleToggleStudent = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(students.map((s) => s.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Cetak Amplop Raport (Massal / Satuan)
              </h2>
              <p className="text-xs text-gray-500">
                Pilih target siswa yang akan dicetak atau disimpan ke format PDF.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Options */}
          <div className="space-y-2.5">
            {/* Current student */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                printOption === 'current'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="printOption"
                checked={printOption === 'current'}
                onChange={() => setPrintOption('current')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900">
                  Cetak Siswa Saat Ini Saja (1 Amplop)
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Absen #{currentStudent?.absen} -{' '}
                  <span className="font-semibold uppercase">{currentStudent?.nama}</span> (
                  {currentStudent?.kelas})
                </div>
              </div>
            </label>

            {/* All students */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                printOption === 'all'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="printOption"
                checked={printOption === 'all'}
                onChange={() => setPrintOption('all')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Cetak Semua Siswa Satu Kelas
                  </span>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {students.length} Siswa
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Mencetak seluruh siswa otomatis berurutan dari absen 1 sampai {students.length}
                </div>
              </div>
            </label>

            {/* Range */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                printOption === 'range'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="printOption"
                checked={printOption === 'range'}
                onChange={() => setPrintOption('range')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900">
                  Cetak Rentang Nomor Absen Tertentu
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Berguna untuk mencetak per sesi (contoh absen 1 s/d 18)
                </div>

                {printOption === 'range' && (
                  <div className="flex items-center gap-2 mt-3 bg-white p-2.5 rounded-lg border border-indigo-200">
                    <span className="text-xs font-semibold text-gray-700">Dari Absen:</span>
                    <input
                      type="number"
                      min="1"
                      max={students.length}
                      value={rangeStart}
                      onChange={(e) => setRangeStart(Number(e.target.value))}
                      className="w-16 text-center text-xs font-bold border border-gray-300 rounded p-1"
                    />
                    <span className="text-xs font-semibold text-gray-700">Sampai:</span>
                    <input
                      type="number"
                      min={rangeStart}
                      max={students.length}
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(Number(e.target.value))}
                      className="w-16 text-center text-xs font-bold border border-gray-300 rounded p-1"
                    />
                  </div>
                )}
              </div>
            </label>

            {/* Custom checkboxes */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                printOption === 'custom'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="printOption"
                checked={printOption === 'custom'}
                onChange={() => setPrintOption('custom')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900">
                  Pilih Siswa Manual (Checklist)
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Pilih bebas siswa mana saja yang ingin dicetak
                </div>

                {printOption === 'custom' && (
                  <div className="mt-3 bg-white border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto">
                    <div className="flex justify-between pb-1.5 mb-1.5 border-b border-gray-100 text-[11px]">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="text-gray-500 hover:underline"
                      >
                        Batal Semua
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {students.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => handleToggleStudent(st.id)}
                          className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(st.id)}
                            readOnly
                            className="rounded text-indigo-600"
                          />
                          <span className="font-semibold w-5 text-gray-500">
                            {st.absen}.
                          </span>
                          <span className="truncate uppercase font-medium">
                            {st.nama}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Summary badge */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-900">
            <span className="font-medium">Total Amplop yang akan diproses:</span>
            <span className="font-extrabold text-sm text-indigo-700 bg-white px-3 py-1 rounded-lg border border-indigo-200">
              {selectedList.length} Lembar Amplop
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onConfirmBatchPrint(selectedList);
                onClose();
              }}
              disabled={selectedList.length === 0}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Cetak Langsung ({selectedList.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
