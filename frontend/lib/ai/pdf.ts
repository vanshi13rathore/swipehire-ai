import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure the worker dynamically via CDN to ensure compatibility with Next.js in the browser
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let text = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      const pageText = content.items
        .map((item: unknown) => (item !== null && typeof item === 'object' && 'str' in item ? (item as { str: string }).str : ''))
        .join(" ");
        
      text += pageText + "\n";
    }
    
    return text.trim();
  } catch (error: unknown) {
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
