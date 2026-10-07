import { EnvelopeDimensions, LetterheadConfig, Student, EnvelopeSettings } from '../types';

export const DEFAULT_LOGO_URL =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSl3c440H1cWt89juZEb4LojehtllUa7RQvrYFzuxuCoerjRORl7eYBGRWuwOwN9gtEzUVkQJjOzRY0S1AazMnzmQBWvI0O0x9BLMA7srvriwOgb5IfHWOvGnhyphenhyphenq2Sbqc2nxAoKCDMrIcxs5rw8_uGvVljZxlX-XHdTQe2YkBUh8_jS3pOPCvMUWdHsx40/s506/50562.png';

export const DEFAULT_LETTERHEAD: LetterheadConfig = {
  yayasan: 'MAJLIS PENDIDIKAN DASAR DAN MENENGAH',
  daerah: 'DAERAH MUHAMMADIYAH BATANG',
  namaSekolah: 'SMK MUHAMMADIYAH BAWANG',
  akreditasi: 'TERAKREDITASI "A"',
  showAkreditasi: false, // In reference image 1 it is not shown, in image 2 it is shown. Can toggle!
  alamat: 'Jl. Bawang-Sukorejo Km 01 Ds. Jlamprang Kec. Bawang Kab. Batang',
  kontakEmailWeb: 'Email. smkmuhbawang@yahoo.co.id  Website : www.smkmuhiba.sch.id',
  kontakTelpFax: 'Kode Pos 51274 Telp. (0285) 4486909 Fax. (0285) 4486899',
  logoUrl: DEFAULT_LOGO_URL,
  logoWidth: 105,
};

export const PAPER_PRESETS: EnvelopeDimensions[] = [
  {
    id: 'a4-landscape',
    name: 'A4 Landscape',
    desc: '297 × 210 mm (Kertas HVS/Amplop Cetak A4)',
    widthMm: 297,
    heightMm: 210,
  },
  {
    id: 'dl',
    name: 'Amplop DL Standar',
    desc: '220 × 110 mm (Amplop Panjang Resmi)',
    widthMm: 220,
    heightMm: 110,
  },
  {
    id: 'kabinet-standard',
    name: 'Amplop Kabinet',
    desc: '230 × 110 mm (Ukuran amplop surat dinas)',
    widthMm: 230,
    heightMm: 110,
  },
  {
    id: 'c5',
    name: 'Amplop C5 / Sedang',
    desc: '229 × 162 mm (Setengah A4 landscape)',
    widthMm: 229,
    heightMm: 162,
  },
  {
    id: 'f4-landscape',
    name: 'F4 / Folio Landscape',
    desc: '330 × 215 mm (Kertas F4/HVS Folio)',
    widthMm: 330,
    heightMm: 215,
  },
];

export const DEFAULT_SETTINGS: EnvelopeSettings = {
  paperSize: 'a4-landscape',
  showAbsenBadge: true,
  showCropMarks: true,
  recipientTitle: 'Kepada :',
  recipientSubtitle: 'Orang Tua/Wali',
  nameUnderline: true,
  nameBold: true,
  uppercaseName: true,
  borderThickness: 2,
  boxBorderRadius: 16,
  doubleLineStyle: 'classic-double',
  printerOffsetX: 0,
  printerOffsetY: 0,
};

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', absen: 1, nama: 'ABDULLAH KAFA BIHI', kelas: 'XI TKR 1', nis: '23241001' },
  { id: '2', absen: 2, nama: 'ACHMAD RIZQI MAULANA', kelas: 'XI TKR 1', nis: '23241002' },
  { id: '3', absen: 3, nama: 'ADITYA PRATAMA PUTRA', kelas: 'XI TKR 1', nis: '23241003' },
  { id: '4', absen: 4, nama: 'AGUS DWI PRASETYO', kelas: 'XI TKR 1', nis: '23241004' },
  { id: '5', absen: 5, nama: 'AHMAD FADLIL MUBAROK', kelas: 'XI TKR 1', nis: '23241005' },
  { id: '6', absen: 6, nama: 'ALDI BAGUS KURNIAWAN', kelas: 'XI TKR 1', nis: '23241006' },
  { id: '7', absen: 7, nama: 'ANDIKA SETIA BUDI', kelas: 'XI TKR 1', nis: '23241007' },
  { id: '8', absen: 8, nama: 'ANTON WICAKSONO', kelas: 'XI TKR 1', nis: '23241008' },
  { id: '9', absen: 9, nama: 'ARIF NUR HIDAYAT', kelas: 'XI TKR 1', nis: '23241009' },
  { id: '10', absen: 10, nama: 'BAGAS TRI WAHYUDI', kelas: 'XI TKR 1', nis: '23241010' },
  { id: '11', absen: 11, nama: 'BAYU AJI PAMUNGKAS', kelas: 'XI TKR 1', nis: '23241011' },
  { id: '12', absen: 12, nama: 'BIMA SAKTI RAMADHAN', kelas: 'XI TKR 1', nis: '23241012' },
  { id: '13', absen: 13, nama: 'CHANDRA EKA SAPUTRA', kelas: 'XI TKR 1', nis: '23241013' },
  { id: '14', absen: 14, nama: 'DANANG KURNIAWAN', kelas: 'XI TKR 1', nis: '23241014' },
  { id: '15', absen: 15, nama: 'DIMAS ARYA PRADIPTA', kelas: 'XI TKR 1', nis: '23241015' },
  { id: '16', absen: 16, nama: 'FAHRI ALAMSYAH', kelas: 'XI TKR 1', nis: '23241016' },
  { id: '17', absen: 17, nama: 'FAJAR SHODIQ', kelas: 'XI TKR 1', nis: '23241017' },
  { id: '18', absen: 18, nama: 'GILANG PRASETYO', kelas: 'XI TKR 1', nis: '23241018' },
  { id: '19', absen: 19, nama: 'HAFIDZ NUR ROHMAN', kelas: 'XI TKR 1', nis: '23241019' },
  { id: '20', absen: 20, nama: 'IKHSAN MAULANA', kelas: 'XI TKR 1', nis: '23241020' },
  { id: '21', absen: 21, nama: 'IQBAL HIDAYATULLOH', kelas: 'XI TKR 1', nis: '23241021' },
  { id: '22', absen: 22, nama: 'KHAERUL ANAM', kelas: 'XI TKR 1', nis: '23241022' },
  { id: '23', absen: 23, nama: 'M. ILHAM FIRMANSYAH', kelas: 'XI TKR 1', nis: '23241023' },
  { id: '24', absen: 24, nama: 'MIFTAHUL HUDA', kelas: 'XI TKR 1', nis: '23241024' },
  { id: '25', absen: 25, nama: 'MUHAMMAD ALIF NUGROHO', kelas: 'XI TKR 1', nis: '23241025' },
  { id: '26', absen: 26, nama: 'MUHAMMAD AZIZ MUSYAFFA', kelas: 'XI TKR 1', nis: '23241026' },
  { id: '27', absen: 27, nama: 'MUHAMMAD DZAKY', kelas: 'XI TKR 1', nis: '23241027' },
  { id: '28', absen: 28, nama: 'NAUVAL ZAKI ABIDIN', kelas: 'XI TKR 1', nis: '23241028' },
  { id: '29', absen: 29, nama: 'PANJI GUMILANG', kelas: 'XI TKR 1', nis: '23241029' },
  { id: '30', absen: 30, nama: 'RAFI RAMADHANI', kelas: 'XI TKR 1', nis: '23241030' },
  { id: '31', absen: 31, nama: 'RENDI SAPUTRA', kelas: 'XI TKR 1', nis: '23241031' },
  { id: '32', absen: 32, nama: 'RIZAL KURNIAWAN', kelas: 'XI TKR 1', nis: '23241032' },
  { id: '33', absen: 33, nama: 'SYAHRUL RAMADHAN', kelas: 'XI TKR 1', nis: '23241033' },
  { id: '34', absen: 34, nama: 'WAHYU TRI ATMOJO', kelas: 'XI TKR 1', nis: '23241034' },
  { id: '35', absen: 35, nama: 'YOGA PRATAMA', kelas: 'XI TKR 1', nis: '23241035' },
  { id: '36', absen: 36, nama: 'ZULFIKAR ALI ROZAN', kelas: 'XI TKR 1', nis: '23241036' },
];
