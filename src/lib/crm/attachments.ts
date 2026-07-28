/** Max uploaded file size (binary). Base64 storage expands ~33%. */
export const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;

export const ALLOWED_ATTACHMENT_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
] as const;

export function isAllowedAttachment(fileName: string, mimeType: string) {
  const lower = fileName.toLowerCase();
  const extOk = ALLOWED_ATTACHMENT_EXTENSIONS.some((ext) => lower.endsWith(ext));
  const mimeOk =
    ALLOWED_ATTACHMENT_MIME.has(mimeType) ||
    mimeType === "application/octet-stream" ||
    mimeType === "";
  return extOk && mimeOk;
}

export function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
