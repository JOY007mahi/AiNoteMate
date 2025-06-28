declare module 'pdf-parse' {
  interface PDFInfo {
    text: string;
    [key: string]: any;
  }

  function pdf(buffer: Buffer): Promise<PDFInfo>;

  export = pdf;
}
