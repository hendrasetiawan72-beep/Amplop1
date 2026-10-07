import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  Search,
  Check,
  AlertCircle,
  ArrowUpDown,
  RotateCcw,
  Printer,
  FileDown,
  Layers,
  Sparkles,
  Edit2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Student } from '../types';
import { INITIAL_STUDENTS } from '../data/initialData';

interface StudentDataPageProps {
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onNavigateToPrint: (selectedStudentIndex?: number) => void;
}

export const StudentDataPage: React.FC<StudentDataPageProps> = ({
  students,
  onUpdateStudents,
  onNavigateToPrint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Single Add Form
  const [inputAbsen, setInputAbsen] = useState<number>(students.length + 1);
  const [inputNama, setInputNama] = useState('');
  const [inputKelas, setInputKelas] = useState(students[0]?.kelas || 'XI TKR 1');
  const [inputNis, setInputNis] = useState('');

  // Excel Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | 'loading' | null;
    message: string;
    details?: string;
  }>({ type: null, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync default absen counter
  React.useEffect(() => {
    setInputAbsen(students.length + 1);
    if (students.length > 0 && !inputKelas) {
      setInputKelas(students[0].kelas);
    }
  }, [students.length]);

  // Unique classes for filter
  const uniqueClasses = Array.from(new Set(students.map((s) => s.kelas).filter(Boolean)));

  // Add single student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNama.trim()) return;

    const newStudent: Student = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      absen: Number(inputAbsen) || students.length + 1,
      nama: inputNama.trim().toUpperCase(),
      kelas: inputKelas.trim() || 'XI TKR 1',
      nis: inputNis.trim() || undefined,
    };

    const next = [...students, newStudent].sort((a, b) => a.absen - b.absen);
    onUpdateStudents(next);

    setInputNama('');
    setInputNis('');
    setInputAbsen(next.length + 1);

    setUploadStatus({
      type: 'success',
      message: `Siswa "${newStudent.nama}" berhasil ditambahkan!`,
    });
    setTimeout(() => setUploadStatus({ type: null, message: '' }), 3000);
  };

  // Inline update student
  const handleUpdateStudent = (id: string, field: keyof Student, value: any) => {
    const next = students.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          [field]: field === 'nama' ? String(value).toUpperCase() : value,
        };
      }
      return s;
    });
    onUpdateStudents(next);
  };

  // Delete single
  const handleDeleteStudent = (id: string) => {
    const next = students.filter((s) => s.id !== id);
    onUpdateStudents(next);
  };

  // Delete selected
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Yakin ingin menghapus ${selectedIds.size} siswa terpilih?`)) {
      const next = students.filter((s) => !selectedIds.has(s.id));
      onUpdateStudents(next);
      setSelectedIds(new Set());
    }
  };

  // Re-number attendance (1 to N)
  const handleRenumberAbsen = () => {
    const next = students.map((s, idx) => ({
      ...s,
      absen: idx + 1,
    }));
    onUpdateStudents(next);
    setUploadStatus({
      type: 'success',
      message: 'Nomor absen telah diurutkan otomatis (1 s/d ' + next.length + ')!',
    });
    setTimeout(() => setUploadStatus({ type: null, message: '' }), 3000);
  };

  // Sort by Name A-Z
  const handleSortByName = () => {
    const next = [...students].sort((a, b) => a.nama.localeCompare(b.nama));
    onUpdateStudents(next);
  };

  // Sort by Absen
  const handleSortByAbsen = () => {
    const next = [...students].sort((a, b) => a.absen - b.absen);
    onUpdateStudents(next);
  };

  // Reset to default XI TKR 1 (36 siswa)
  const handleResetDefault = () => {
    if (confirm('Kembalikan daftar ke data bawaan (XI TKR 1 - 36 Siswa)?')) {
      onUpdateStudents(INITIAL_STUDENTS);
      setSelectedIds(new Set());
      setUploadStatus({
        type: 'success',
        message: 'Daftar siswa dikembalikan ke data bawaan.',
      });
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 3000);
    }
  };

  // Download Excel Template
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        'No Absen': 1,
        'Nama Siswa': 'ABDULLAH KAFA BIHI',
        Kelas: 'XI TKR 1',
        'NIS/NISN': '23241001',
      },
      {
        'No Absen': 2,
        'Nama Siswa': 'ACHMAD RIZQI MAULANA',
        Kelas: 'XI TKR 1',
        'NIS/NISN': '23241002',
      },
      {
        'No Absen': 3,
        'Nama Siswa': 'ADITYA PRATAMA PUTRA',
        Kelas: 'XI TKR 1',
        'NIS/NISN': '23241003',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar_Siswa');

    // Auto-fit column widths
    worksheet['!cols'] = [
      { wch: 10 }, // No Absen
      { wch: 32 }, // Nama
      { wch: 14 }, // Kelas
      { wch: 16 }, // NIS
    ];

    XLSX.writeFile(workbook, 'Template_Data_Siswa_SMK_Muhammadiyah_Bawang.xlsx');
  };

  // Export current students to Excel
  const handleExportCurrentToExcel = () => {
    const exportData = students.map((s) => ({
      'No Absen': s.absen,
      'Nama Siswa': s.nama,
      Kelas: s.kelas,
      'NIS/NISN': s.nis || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Siswa');

    worksheet['!cols'] = [{ wch: 10 }, { wch: 32 }, { wch: 14 }, { wch: 16 }];

    const filename = `Data_Siswa_${inputKelas.replace(/\s+/g, '_')}_${students.length}_siswa.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // Process Excel File Upload
  const processExcelFile = async (file: File) => {
    setUploadStatus({
      type: 'loading',
      message: `Sedang memproses file ${file.name}...`,
    });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      // Take first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      if (!worksheet) {
        throw new Error('Lembar kerja (sheet) kosong atau tidak ditemukan.');
      }

      // Convert sheet to json array of objects or rows
      const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        defval: '',
      });

      if (rawJson.length === 0) {
        throw new Error('Tidak ada data siswa ditemukan dalam file Excel ini.');
      }

      // Smart column matching
      const parsedStudents: Student[] = [];

      rawJson.forEach((row, index) => {
        const keys = Object.keys(row);

        // Find Absen column
        const absenKey = keys.find((k) =>
          /absen|no|nomor|urut|no\.\s*absen|nr/i.test(k.trim())
        );

        // Find Nama column
        const namaKey = keys.find((k) =>
          /nama|siswa|peserta|name|student|lengkap/i.test(k.trim())
        );

        // Find Kelas column
        const kelasKey = keys.find((k) =>
          /kelas|rombel|jurusan|tingkat/i.test(k.trim())
        );

        // Find NIS column
        const nisKey = keys.find((k) =>
          /nis|nisn|induk|id/i.test(k.trim())
        );

        let absenVal = absenKey ? Number(row[absenKey]) : index + 1;
        if (isNaN(absenVal) || absenVal <= 0) {
          absenVal = index + 1;
        }

        // If no explicit namaKey, check if any cell has text
        let namaVal = '';
        if (namaKey && row[namaKey]) {
          namaVal = String(row[namaKey]).trim();
        } else {
          // fallback to first non-number column
          for (const k of keys) {
            const v = String(row[k]).trim();
            if (v && isNaN(Number(v))) {
              namaVal = v;
              break;
            }
          }
        }

        const kelasVal = (kelasKey && row[kelasKey])
          ? String(row[kelasKey]).trim()
          : inputKelas || 'XI TKR 1';

        const nisVal = (nisKey && row[nisKey]) ? String(row[nisKey]).trim() : '';

        if (namaVal && namaVal.length > 1) {
          parsedStudents.push({
            id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
            absen: absenVal,
            nama: namaVal.toUpperCase(),
            kelas: kelasVal,
            nis: nisVal || undefined,
          });
        }
      });

      if (parsedStudents.length === 0) {
        throw new Error(
          'Gagal membaca kolom Nama Siswa. Pastikan terdapat kolom dengan judul "Nama Siswa".'
        );
      }

      // Sort by absen
      const sorted = parsedStudents.sort((a, b) => a.absen - b.absen);

      onUpdateStudents(sorted);
      setSelectedIds(new Set());
      setUploadStatus({
        type: 'success',
        message: `Berhasil mengimpor ${sorted.length} siswa dari "${file.name}"!`,
        details: `Sheet: ${firstSheetName}. Data langsung siap dicetak pada amplop raport.`,
      });
    } catch (err: any) {
      console.error(err);
      setUploadStatus({
        type: 'error',
        message: err.message || 'Terjadi kesalahan saat membaca file Excel.',
        details: 'Gunakan tombol "Unduh Template Excel" untuk melihat format yang sesuai.',
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processExcelFile(file);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processExcelFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Filtered student list
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.absen.toString().includes(searchQuery) ||
      (s.nis && s.nis.includes(searchQuery)) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesKelas = filterKelas === 'ALL' || s.kelas === filterKelas;
    return matchesSearch && matchesKelas;
  });

  const toggleSelectStudent = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-300" />
            Integrasi Microsoft Excel & Spreadsheet
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Kelola Data Siswa & Upload Excel
          </h1>
          <p className="mt-2 text-indigo-200 text-sm sm:text-base leading-relaxed">
            Upload file Excel (.xlsx / .xls) untuk mengisi nomor absen dan nama siswa secara otomatis.
            Data yang dimasukkan langsung tersinkronisasi ke amplop raport siap cetak.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToPrint()}
              className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition"
            >
              <Printer className="w-4 h-4 text-indigo-700" />
              Kembali ke Laman Cetak Amplop
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2.5 bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-400/40 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Unduh Template Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* Decorative Watermark Emblem */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none">
          <FileSpreadsheet className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Upload Zone & Manual Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Excel Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload File Excel Siswa
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Mendukung .xlsx, .xls, .csv
              </span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px] ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/70 scale-[0.99]'
                  : 'border-gray-300 hover:border-indigo-500 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>

              <div className="text-sm font-bold text-gray-800">
                Klik untuk memilih file Excel atau seret (drag & drop) ke sini
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Otomatis membaca kolom <strong>No Absen</strong>, <strong>Nama Siswa</strong>, dan <strong>Kelas</strong>
              </p>
            </div>
          </div>

          {/* Upload Status Banner */}
          {uploadStatus.type && (
            <div
              className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                uploadStatus.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : uploadStatus.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}
            >
              {uploadStatus.type === 'success' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {uploadStatus.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">{uploadStatus.message}</div>
                {uploadStatus.details && (
                  <div className="mt-0.5 opacity-90">{uploadStatus.details}</div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              💡 Belum punya format? Klik <strong>Unduh Template Excel</strong> di atas.
            </span>
          </div>
        </div>

        {/* Manual Quick Form Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Plus className="w-5 h-5 text-indigo-600" />
              Tambah Siswa Manual
            </h2>

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    No Absen
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inputAbsen}
                    onChange={(e) => setInputAbsen(Number(e.target.value))}
                    className="w-full text-sm font-bold border border-gray-300 rounded-xl px-3 py-2 text-center focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    value={inputKelas}
                    onChange={(e) => setInputKelas(e.target.value)}
                    placeholder="XI TKR 1"
                    className="w-full text-sm font-semibold border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Siswa Lengkap
                </label>
                <input
                  type="text"
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
                  placeholder="Contoh: ABDULLAH KAFA BIHI"
                  className="w-full text-sm font-bold uppercase border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  NIS / NISN (Opsional)
                </label>
                <input
                  type="text"
                  value={inputNis}
                  onChange={(e) => setInputNis(e.target.value)}
                  placeholder="Nomor Induk Siswa"
                  className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                Tambah ke Daftar Siswa
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Student Data Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, absen, atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Kelas */}
            {uniqueClasses.length > 1 && (
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Semua Kelas ({students.length})</option>
                {uniqueClasses.map((kls) => (
                  <option key={kls} value={kls}>
                    Kelas {kls}
                  </option>
                ))}
              </select>
            )}

            <span className="text-xs font-semibold text-gray-500">
              Menampilkan {filteredStudents.length} dari {students.length} siswa
            </span>
          </div>

          {/* Quick Table Utilities */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Terpilih ({selectedIds.size})
              </button>
            )}

            <button
              onClick={handleRenumberAbsen}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 flex items-center gap-1.5 transition"
              title="Urutkan nomor absen dari 1 sampai akhir"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
              Urutkan No. Absen (1..N)
            </button>

            <button
              onClick={handleExportCurrentToExcel}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-700" />
              Export ke Excel
            </button>

            <button
              onClick={handleResetDefault}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-rose-700 rounded-lg transition"
              title="Kembalikan ke data bawaan XI TKR 1"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 &&
                      selectedIds.size === filteredStudents.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-indigo-600"
                  />
                </th>
                <th
                  onClick={handleSortByAbsen}
                  className="py-3 px-3 w-20 text-center cursor-pointer hover:text-indigo-600"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Absen</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={handleSortByName}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600"
                >
                  <div className="flex items-center gap-1">
                    <span>Nama Siswa Lengkap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 w-32">Kelas</th>
                <th className="py-3 px-4 w-32">NIS/NISN</th>
                <th className="py-3 px-4 w-40 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <FileSpreadsheet className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    Tidak ada siswa yang sesuai pencarian. Silakan upload Excel atau tambah data baru.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const originalIndex = students.findIndex((s) => s.id === student.id);
                  const isSelected = selectedIds.has(student.id);

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-indigo-50/40 transition ${
                        isSelected ? 'bg-indigo-50/60' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStudent(student.id)}
                          className="rounded text-indigo-600"
                        />
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={student.absen}
                          onChange={(e) =>
                            handleUpdateStudent(student.id, 'absen', Number(e.target.value))
                          }
                          className="w-14 text-center text-xs font-extrabold text-indigo-900 bg-indigo-50/50 border border-indigo-200 rounded-lg py-1 px-1 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>

                      <td className="py-2.5 px-4 font-bold text-gray-900">
                        <input
                          type="text"
                          value={student.nama}
                          onChange={(e) =>
                            handleUpdateStudent(student.id, 'nama', e.target.value)
                          }
                          className="w-full text-xs font-bold uppercase border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded-lg px-2 py-1 transition"
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={student.kelas}
                          onChange={(e) =>
                            handleUpdateStudent(student.id, 'kelas', e.target.value)
                          }
                          className="w-full text-xs font-semibold text-gray-700 border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded-lg px-2 py-1 transition"
                        />
                      </td>

                      <td className="py-2.5 px-4 text-xs text-gray-500">
                        <input
                          type="text"
                          value={student.nis || ''}
                          placeholder="-"
                          onChange={(e) =>
                            handleUpdateStudent(student.id, 'nis', e.target.value)
                          }
                          className="w-full text-xs border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded-lg px-2 py-1 transition"
                        />
                      </td>

                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onNavigateToPrint(originalIndex)}
                            className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1 transition"
                            title="Buka dan cetak amplop siswa ini"
                          >
                            <Printer className="w-3.5 h-3.5 text-indigo-600" />
                            Cetak
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-200 bg-slate-50/60 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">Total: {students.length} Siswa</span>
            <span>• Seluruh perubahan tersimpan otomatis ke browser</span>
          </div>

          <button
            onClick={() => onNavigateToPrint()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            Ke Laman Cetak Amplop Raport →
          </button>
        </div>
      </div>
    </div>
  );
};
