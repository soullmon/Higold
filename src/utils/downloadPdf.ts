/**
 * Utility helper to trigger instant download of official Higold PDF documents
 */
export function downloadOfficialCatalogPdf(filenameOrPdf: string | { filename: string; title: string }, maybeTitle?: string) {
  const filename = typeof filenameOrPdf === 'string' ? filenameOrPdf : filenameOrPdf.filename;
  const title = maybeTitle || (typeof filenameOrPdf === 'string' ? filenameOrPdf : filenameOrPdf.title);
  // Generate a valid text/plain or application/pdf placeholder with rich header
  const pdfHeader = `%PDF-1.4
%
1 0 obj
<<
/Title (${title})
/Author (HIGOLD Official Indonesia - PT Surya Gemilang Sejati)
/Subject (Architectural Kitchen Hardware Technical Catalog)
/Creator (Higold Digital Publishing)
>>
endobj
2 0 obj
<<
/Type /Catalog
/Pages 3 0 R
>>
endobj
3 0 obj
<<
/Type /Pages
/Kids [4 0 R]
/Count 1
>>
endobj
4 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 595 842]
/Contents 5 0 R
>>
endobj
5 0 obj
<<
/Length 180
>>
stream
BT
/F1 18 Tf
50 780 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(HIGOLD OFFICIAL INDONESIA - PT. SURYA GEMILANG SEJATI) Tj
0 -20 Td
(Showroom Pluit, Jakarta Utara | WhatsApp: 0812-9988-7766) Tj
0 -30 Td
(Dokumen Resmi Spesifikasi Teknis & Panduan Toleransi Kabinet) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000140 00000 n 
0000000192 00000 n 
0000000251 00000 n 
0000000341 00000 n 
trailer
<<
/Size 6
/Root 2 0 R
/Info 1 0 R
>>
startxref
570
%%EOF`;

  const blob = new Blob([pdfHeader], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
