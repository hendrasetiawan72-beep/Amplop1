import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserCheck,
  Edit3,
  Users,
} from 'lucide-react';
import { Student } from '../types';

interface StudentNavigatorProps {
  students: Student[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenStudentManager: () => void;
  onQuickUpdateCurrent: (updated: Partial<Student>) => void;
}

export const StudentNavigator: React.FC<StudentNavigatorProps> = ({
  students,
  currentIndex,
  onSelectIndex,
  onOpenStudentManager,
  onQuickUpdateCurrent,
}) => {
  const [isEditingInline, setIsEditingInline] = React.useState(false);
  const currentStudent = students[currentIndex] || {
    id: '0',
    absen: 1,
    nama: 'NAMA SISWA',
    kelas: 'XI TKR 1',
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < students.length - 1) {
      onSelectIndex(currentIndex + 1);
    }
  };

  const handleFirst = () => onSelectIndex(0);
  const handleLast = () => onSelectIndex(students.length - 1);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Stepper */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleFirst}
            disabled={currentIndex === 0}
            title="Siswa Pertama (Home)"
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 transition"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            title="Siswa Sebelumnya (Panah Kiri)"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 text-sm font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Absence badge / counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900">
            <span className="text-xs uppercase font-semibold text-indigo-600">No. Absen</span>
            <span className="text-lg font-black tracking-tight text-indigo-950">
              {currentStudent.absen}
            </span>
            <span className="text-xs text-indigo-400 font-medium">
              / {students.length}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= students.length - 1}
            title="Siswa Selanjutnya (Panah Kanan)"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 text-sm font-medium transition"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleLast}
            disabled={currentIndex >= students.length - 1}
            title="Siswa Terakhir (End)"
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 transition"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Student Quick Selector & Name Edit */}
        <div className="flex-1 min-w-[280px] max-w-xl flex items-center gap-2">
          {/* Dropdown Quick Jump */}
          <select
            value={currentIndex}
            onChange={(e) => onSelectIndex(Number(e.target.value))}
            className="text-xs sm:text-sm font-medium border border-gray-300 rounded-lg py-1.5 px-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[190px] truncate"
          >
            {students.map((s, idx) => (
              <option key={s.id || idx} value={idx}>
                #{s.absen} - {s.nama} ({s.kelas})
              </option>
            ))}
          </select>

          {/* Inline Edit Nama & Kelas */}
          {isEditingInline ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={currentStudent.nama}
                onChange={(e) =>
                  onQuickUpdateCurrent({ nama: e.target.value.toUpperCase() })
                }
                placeholder="Nama Siswa"
                className="w-full text-xs font-bold border border-indigo-400 rounded px-2 py-1 uppercase focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
              <input
                type="text"
                value={currentStudent.kelas}
                onChange={(e) => onQuickUpdateCurrent({ kelas: e.target.value })}
                placeholder="Kelas"
                className="w-20 text-xs font-semibold border border-indigo-400 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => setIsEditingInline(false)}
                className="text-xs bg-indigo-600 text-white px-2 py-1 rounded font-medium hover:bg-indigo-700"
              >
                Simpan
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-gray-900 truncate uppercase">
                  {currentStudent.nama}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  Kelas: <span className="text-gray-800 font-semibold">{currentStudent.kelas}</span>
                  {currentStudent.nis && ` • NIS: ${currentStudent.nis}`}
                </div>
              </div>
              <button
                onClick={() => setIsEditingInline(true)}
                title="Edit Cepat Nama/Kelas Siswa Ini"
                className="p-1 text-gray-500 hover:text-indigo-600 rounded hover:bg-gray-200 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Manage All Students Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStudentManager}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition shadow-2xs"
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Kelola Data Siswa</span>
            <span className="ml-1 bg-indigo-200 text-indigo-800 px-1.5 py-0.2 rounded-full text-[11px]">
              {students.length}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
