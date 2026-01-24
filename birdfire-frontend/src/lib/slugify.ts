// src/lib/slugify.ts
export function slugify(text: string): string {
  if (!text) {
    throw new Error("slugify() received undefined text")
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
