// Import the inner module directly to bypass pdf-parse/index.js,
// which tries to read a bundled test PDF on require and throws ENOENT.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text.trim();
}
