import React from 'react';
import { EnvelopeSettings, LetterheadConfig, Student, EnvelopeDimensions } from '../types';

interface EnvelopeViewProps {
  student: Student;
  letterhead: LetterheadConfig;
  settings: EnvelopeSettings;
  paperInfo: EnvelopeDimensions;
  scale?: number;
  isPrintMode?: boolean;
}

export const EnvelopeView: React.FC<EnvelopeViewProps> = ({
  student,
  letterhead,
  settings,
  paperInfo,
  scale = 1,
  isPrintMode = false,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const displayName = settings.uppercaseName
    ? student.nama.toUpperCase()
    : student.nama;

  // Real dimensions in mm
  const widthMm = paperInfo.widthMm;
  const heightMm = paperInfo.heightMm;

  return (
    <div
      className={`envelope-container bg-white relative text-black select-none ${
        isPrintMode ? 'envelope-print-sheet' : 'shadow-xl border border-gray-300'
      }`}
      style={{
        width: `${widthMm}mm`,
        height: `${heightMm}mm`,
        minWidth: `${widthMm}mm`,
        minHeight: `${heightMm}mm`,
        transform: !isPrintMode && scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: "'Times New Roman', serif",
      }}
    >
      {/* Corner Crop Marks (like Reference Image 1) */}
      {settings.showCropMarks && (
        <>
          {/* Top-Left */}
          <div className="absolute top-2 left-2 pointer-events-none">
            <div className="w-4 h-0.5 bg-gray-400"></div>
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>
          {/* Top-Right */}
          <div className="absolute top-2 right-2 pointer-events-none flex flex-col items-end">
            <div className="w-4 h-0.5 bg-gray-400"></div>
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>
          {/* Bottom-Left */}
          <div className="absolute bottom-2 left-2 pointer-events-none flex flex-col justify-end">
            <div className="w-0.5 h-4 bg-gray-400"></div>
            <div className="w-4 h-0.5 bg-gray-400"></div>
          </div>
          {/* Bottom-Right */}
          <div className="absolute bottom-2 right-2 pointer-events-none flex flex-col items-end justify-end">
            <div className="w-0.5 h-4 bg-gray-400"></div>
            <div className="w-4 h-0.5 bg-gray-400"></div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div
        className="w-full h-full flex flex-col"
        style={{
          paddingLeft: `${14 + settings.printerOffsetX}mm`,
          paddingRight: `${14 - settings.printerOffsetX}mm`,
          paddingTop: `${9 + settings.printerOffsetY}mm`,
          paddingBottom: `${9 - settings.printerOffsetY}mm`,
        }}
      >
        {/* KOP SURAT (LETTERHEAD) */}
        <div className="w-full flex items-center justify-between pb-2">
          {/* School Emblem / Logo on the Left */}
          <div
            className="flex-shrink-0 flex items-center justify-center pl-1"
            style={{ width: `${letterhead.logoWidth}px` }}
          >
            {!imageError && letterhead.logoUrl ? (
              <img
                src={letterhead.logoUrl}
                alt="Logo SMK Muhammadiyah Bawang"
                crossOrigin="anonymous"
                className="w-full h-auto object-contain max-h-[115px]"
                onError={() => setImageError(true)}
              />
            ) : (
              /* High-fidelity Vector Fallback of SMK Muhammadiyah Emblem */
              <div className="w-24 h-24 rounded-full border-4 border-indigo-700 bg-indigo-600 flex flex-col items-center justify-center text-white text-center shadow-inner p-1">
                <span className="text-[9px] font-bold tracking-wider">SMK MUH</span>
                <div className="w-8 h-8 my-0.5 bg-amber-400 rounded-full flex items-center justify-center text-indigo-900 font-extrabold text-[9px]">
                  ★
                </div>
                <span className="text-[8px] font-semibold">BAWANG</span>
              </div>
            )}
          </div>

          {/* Letterhead Text (Right side of Logo, Centered) */}
          <div className="flex-1 text-center px-3 leading-snug">
            <h3 className="text-[13pt] font-semibold tracking-wide uppercase text-black font-sans">
              {letterhead.yayasan}
            </h3>
            <h4 className="text-[13.5pt] font-semibold tracking-wide uppercase text-black font-sans -mt-0.5">
              {letterhead.daerah}
            </h4>
            <h1 className="text-[18pt] font-extrabold tracking-normal uppercase text-black font-sans mt-0.5 mb-0.5">
              {letterhead.namaSekolah}
            </h1>

            {letterhead.showAkreditasi && letterhead.akreditasi && (
              <div className="text-[12pt] font-black tracking-widest uppercase text-black font-sans mb-0.5">
                {letterhead.akreditasi}
              </div>
            )}

            <p className="text-[9.5pt] text-black font-sans">
              {letterhead.alamat}
            </p>
            <p className="text-[9.5pt] text-black font-sans -mt-0.5">
              {letterhead.kontakEmailWeb}
            </p>
            <p className="text-[9.5pt] text-black font-sans -mt-0.5">
              {letterhead.kontakTelpFax}
            </p>
          </div>

          {/* Spacer to balance logo width on right side if desired */}
          <div
            className="flex-shrink-0 hidden md:block"
            style={{ width: `${Math.max(10, letterhead.logoWidth * 0.25)}px` }}
          />
        </div>

        {/* DOUBLE HORIZONTAL LINE SEPARATOR (KOP SURAT DIVIDER) */}
        <div className="w-full my-1">
          {settings.doubleLineStyle === 'classic-double' ? (
            <div className="w-full flex flex-col gap-[2px]">
              <div className="w-full border-t-[3px] border-black" />
              <div className="w-full border-t-[1px] border-black" />
            </div>
          ) : settings.doubleLineStyle === 'thin-double' ? (
            <div className="w-full flex flex-col gap-[2px]">
              <div className="w-full border-t-[1.5px] border-black" />
              <div className="w-full border-t-[1.5px] border-black" />
            </div>
          ) : (
            <div className="w-full border-t-[2.5px] border-black" />
          )}
        </div>

        {/* BODY AREA (EXPANDED WHITE SPACE AS IN REFERENCE IMAGE) */}
        <div className="w-full flex-1 relative flex flex-col justify-between pt-3">
          {/* Top of Body: Nomor Absen Badge on Left (Like Image 1) */}
          <div className="w-full flex items-start justify-between">
            {settings.showAbsenBadge ? (
              <div
                className="inline-flex items-center justify-center min-w-[58px] px-3.5 py-1 text-center font-bold text-[19pt] text-black border-2 border-black rounded-lg bg-white shadow-none mt-1 ml-1"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {student.absen}
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Bottom-Right / Center-Right Recipient Box (Like Image 1) */}
          <div className="w-full flex justify-end pb-3 pr-2">
            <div
              className="bg-white text-black border-black"
              style={{
                width: '125mm',
                maxWidth: '85%',
                borderWidth: `${settings.borderThickness}px`,
                borderRadius: `${settings.boxBorderRadius}px`,
                padding: '16px 24px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {/* Header inside box */}
              <div className="text-[12pt] leading-snug">
                <div className="font-medium text-black">{settings.recipientTitle}</div>
                <div className="font-medium text-black">{settings.recipientSubtitle}</div>
              </div>

              {/* Student Name & Class Center Aligned inside box */}
              <div className="mt-5 mb-2 text-center">
                <div
                  className={`text-[15.5pt] tracking-wide text-black ${
                    settings.nameBold ? 'font-bold' : 'font-semibold'
                  } ${settings.nameUnderline ? 'underline underline-offset-4 decoration-black decoration-2' : ''}`}
                >
                  {displayName}
                </div>
                <div className="text-[13pt] font-bold text-black mt-1">
                  ( {student.kelas} )
                </div>
                {student.nis && (
                  <div className="text-[10pt] text-gray-700 mt-0.5">
                    NIS/NISN: {student.nis}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
