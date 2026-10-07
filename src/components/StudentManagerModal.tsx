import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Search,
  Check,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Student } from '../types';
import { INITIAL_STUDENTS } from '../data/initialData';

interface StudentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSaveStudents: (students: Student[]) => void;
  onSelectStudentIndex: (index: number) => void;
}

export const StudentManagerModal: React.FC<StudentManagerModalProps> = ({
  isOpen,
  onClose,
  students,
  onSaveStudents,
  onSelectStudentIndex,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'import'>('list');
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState('');

  // Single Add / Edit Form State
  const [newAbsen, setNewAbsen] = useState<number>(students.length + 1);
  const [newNama, setNewNama] = useState('');
  const [newKelas, setNewKelas] = useState(students[0]?.kelas || 'XI TKR 1');
  const [newNis, setNewNis] = useState('');

  // Batch Import state
  const [importText, setImportText] = useState('');
  const [importDefaultKelas, setImportDefaultKelas] = useState('XI TKR 1');
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Sync when prop updates
  React.useEffect(() => {
    setLocalStudents(students);
    setNewAbsen(students.length + 1);
    if (students.length > 0) {
      setNewKelas(students[0].kelas);
    }
  }, [students, isOpen]);

  if (!isOpen) return null;

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim()) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      absen: Number(newAbsen) || localStudents.length + 1,
      nama: newNama.trim().toUpperCase(),
      kelas: newKelas.trim() || 'XI TKR 1',
      nis: newNis.trim() || undefined,
    };

    const updated = [...localStudents, newStudent].sort((a, b) => a.absen - b.absen);
    setLocalStudents(updated);
    onSaveStudents(updated);

    // Reset form
    setNewNama('');
    setNewNis('');
    setNewAbsen(updated.length + 1);
  };

  const handleDelete = (id: string) => {
    const updated = localStudents.filter((s) => s.id !== id);
    setLocalStudents(updated);
    onSaveStudents(updated);
  };

  const handleUpdateStudent = (id: string, field: keyof Student, value: any) => {
    const updated = localStudents.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          [field]: field === 'nama' ? String(value).toUpperCase() : value,
        };
      }
      return s;
    });
    setLocalStudents(updated);
    onSaveStudents(updated);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan ke daftar siswa bawaan (XI TKR 1 - 36 Siswa)?')) {
      setLocalStudents(INITIAL_STUDENTS);
      onSaveStudents(INITIAL_STUDENTS);
    }
  };

  const handleExportCsv = () => {
    const headers = ['No Absen', 'Nama Siswa', 'Kelas', 'NIS'];
    const rows = localStudents.map((s) => [
      s.absen,
      `"${s.nama}"`,
      `"${s.kelas}"`,
      `"${s.nis || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daftar_siswa_${newKelas.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchImport = () => {
    if (!importText.trim()) return;

    const lines = importText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: Student[] = [];

    lines.forEach((line, index) => {
      // Check if tab separated (from Excel copy-paste) or comma separated or numbered
      const parts = line.includes('\t')
        ? line.split('\t')
        : line.includes(';')
        ? line.split(';')
        : line.includes(',')
        ? line.split(',')
        : [line];

      const cleanParts = parts.map((p) => p.trim().replace(/^["']|["']$/g, ''));

      let absenNum = index + 1;
      let nama = '';
      let kelas = importDefaultKelas;
      let nis = '';

      if (cleanParts.length >= 3) {
        // format: Absen, Nama, Kelas, (NIS)
        if (!isNaN(Number(cleanParts[0]))) {
          absenNum = Number(cleanParts[0]);
          nama = cleanParts[1];
          kelas = cleanParts[2] || importDefaultKelas;
          nis = cleanParts[3] || '';
        } else {
          nama = cleanParts[0];
          kelas = cleanParts[1] || importDefaultKelas;
          nis = cleanParts[2] || '';
        }
      } else if (cleanParts.length === 2) {
        if (!isNaN(Number(cleanParts[0]))) {
          absenNum = Number(cleanParts[0]);
          nama = cleanParts[1];
        } else {
          nama = cleanParts[0];
          kelas = cleanParts[1] || importDefaultKelas;
        }
      } else {
        // Just names or format like "1. ABDULLAH" or "1 ABDULLAH"
        const lineStr = cleanParts[0];
        const match = lineStr.match(/^(\d+)[\.\s\-]+(.*)/);
        if (match) {
          absenNum = Number(match[1]);
          nama = match[2].trim();
        } else {
          nama = lineStr;
        }
      }

      if (nama) {
        parsed.push({
          id: `${Date.now()}-${index}`,
          absen: absenNum,
          nama: nama.toUpperCase(),
          kelas: kelas || importDefaultKelas,
          nis: nis || undefined,
        });
      }
    });

    if (parsed.length > 0) {
      const sorted = parsed.sort((a, b) => a.absen - b.absen);
      setLocalStudents(sorted);
      onSaveStudents(sorted);
      setImportSuccessMsg(`Berhasil mengimpor ${sorted.length} siswa!`);
      setTimeout(() => {
        setImportSuccessMsg('');
        setActiveTab('list');
      }, 1200);
    }
  };

  const filteredStudents = localStudents.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.absen.toString().includes(searchQuery) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Kelola Data Siswa & Nomor Absen
            </h2>
            <p className="text-xs text-gray-500">
              Total {localStudents.length} siswa terdaftar. Perubahan langsung
              terhubung ke amplop cetak.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 px-6 gap-6 bg-white">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Daftar Siswa ({localStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Import dari Excel / Teks
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {/* Form Tambah Siswa */}
              <form
                onSubmit={handleAddStudent}
                className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 flex flex-wrap items-end gap-3"
              >
                <div className="w-20">
                  <label className="block text-xs font-semibold text-indigo-900 mb-1">
                    No Absen
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newAbsen}
                    onChange={(e) => setNewAbsen(Number(e.target.value))}
                    className="w-full text-sm font-bold bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 text-center"
                    required
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-indigo-900 mb-1">
                    Nama Siswa Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: MUHAMMAD FARHAN"
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    className="w-full text-sm font-semibold bg-white border border-indigo-200 rounded-lg px-3 py-1.5 uppercase focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="w-32">
                  <label className="block text-xs font-semibold text-indigo-900 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="XI TKR 1"
                    value={newKelas}
                    onChange={(e) => setNewKelas(e.target.value)}
                    className="w-full text-sm bg-white border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="w-28">
                  <label className="block text-xs font-semibold text-indigo-900 mb-1">
                    NIS/NISN (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Opsional"
                    value={newNis}
                    onChange={(e) => setNewNis(e.target.value)}
                    className="w-full text-sm bg-white border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </form>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari siswa atau absen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleResetToDefault}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Default (36 Siswa)
                  </button>
                </div>
              </div>

              {/* Table of students */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3 w-16 text-center">Absen</th>
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3 w-28">Kelas</th>
                      <th className="py-2.5 px-3 w-28">NIS</th>
                      <th className="py-2.5 px-3 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          Tidak ada data siswa ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => {
                        const originalIndex = localStudents.findIndex(
                          (s) => s.id === student.id
                        );
                        return (
                          <tr
                            key={student.id}
                            className="hover:bg-slate-50/80 transition"
                          >
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                value={student.absen}
                                onChange={(e) =>
                                  handleUpdateStudent(
                                    student.id,
                                    'absen',
                                    Number(e.target.value)
                                  )
                                }
                                className="w-12 text-center text-xs font-bold border border-gray-200 rounded px-1 py-1"
                              />
                            </td>
                            <td className="py-2 px-3 font-semibold text-gray-900">
                              <input
                                type="text"
                                value={student.nama}
                                onChange={(e) =>
                                  handleUpdateStudent(
                                    student.id,
                                    'nama',
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs font-bold uppercase border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded px-1.5 py-1"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={student.kelas}
                                onChange={(e) =>
                                  handleUpdateStudent(
                                    student.id,
                                    'kelas',
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded px-1.5 py-1"
                              />
                            </td>
                            <td className="py-2 px-3 text-xs text-gray-500">
                              <input
                                type="text"
                                value={student.nis || ''}
                                placeholder="-"
                                onChange={(e) =>
                                  handleUpdateStudent(
                                    student.id,
                                    'nis',
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded px-1.5 py-1"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectStudentIndex(originalIndex);
                                    onClose();
                                  }}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition"
                                >
                                  Pilih
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(student.id)}
                                  className="p-1 text-gray-400 hover:text-rose-600 rounded transition"
                                  title="Hapus"
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
            </div>
          ) : (
            /* Batch Import Tab */
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Cara Mudah Import Siswa dari Excel:</h4>
                  <p className="mt-1">
                    Cukup salin (copy) kolom nama siswa dari Microsoft Excel atau
                    Google Sheets, lalu tempel (paste) ke kotak di bawah.
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-amber-800">
                    Format yang didukung:
                    <br />• Nomor [Tab] Nama Siswa [Tab] Kelas
                    <br />• 1. ABDULLAH KAFA BIHI
                    <br />• Hanya daftar nama (nomor absen akan dibuat otomatis berurutan)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-700">
                  Set Kelas Bawaan:
                </label>
                <input
                  type="text"
                  value={importDefaultKelas}
                  onChange={(e) => setImportDefaultKelas(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2.5 py-1 font-medium"
                />
              </div>

              <textarea
                rows={10}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`1\tABDULLAH KAFA BIHI\tXI TKR 1\n2\tACHMAD RIZQI MAULANA\tXI TKR 1\n3\tADITYA PRATAMA PUTRA\tXI TKR 1\n...`}
                className="w-full font-mono text-xs border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />

              {importSuccessMsg && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-sm font-semibold">
                  <Check className="w-4 h-4" />
                  {importSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleBatchImport}
                  disabled={!importText.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  Proses & Simpan Semua Siswa
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-xl transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
