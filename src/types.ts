export interface Student {
  id: string;
  absen: number;
  nama: string;
  kelas: string;
  nis?: string;
}

export interface LetterheadConfig {
  yayasan: string;
  daerah: string;
  namaSekolah: string;
  akreditasi: string;
  showAkreditasi: boolean;
  alamat: string;
  kontakEmailWeb: string;
  kontakTelpFax: string;
  logoUrl: string;
  logoWidth: number;
}

export type PaperPreset = 'a4-landscape' | 'dl' | 'c5' | 'f4-landscape' | 'kabinet-standard';

export interface EnvelopeDimensions {
  id: PaperPreset;
  name: string;
  desc: string;
  widthMm: number;
  heightMm: number;
}

export interface EnvelopeSettings {
  paperSize: PaperPreset;
  customWidthMm?: number;
  customHeightMm?: number;
  showAbsenBadge: boolean;
  showCropMarks: boolean;
  recipientTitle: string;
  recipientSubtitle: string;
  nameUnderline: boolean;
  nameBold: boolean;
  uppercaseName: boolean;
  borderThickness: number;
  boxBorderRadius: number;
  doubleLineStyle: 'classic-double' | 'bold-single' | 'thin-double';
  printerOffsetX: number; // in mm
  printerOffsetY: number; // in mm
}
