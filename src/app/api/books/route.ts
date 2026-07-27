const GITHUB_API = "https://api.github.com/repos/MohKarkoub/sdmoh-studio/contents/public/books.json";
const RAW_URL = "https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json";

export const dynamic = "force-dynamic";

function flattenBooks(arr: any[]): any[] {
  const seen = new Set<string>();
  const result: any[] = [];
  function walk(items: any[]) {
    for (const item of items) {
      if (Array.isArray(item)) {
        walk(item);
      } else if (item && typeof item === "object" && item.id) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          result.push(item);
        }
      }
    }
  }
  walk(arr);
  return result;
}

export async function GET() {
  try {
    const raw = await fetch(RAW_URL + "?t=" + Date.now());
    if (raw.ok) {
      const books = flattenBooks(await raw.json());
      if (books.length > 0) return Response.json(books);
    }
  } catch {}
  try {
    const res = await fetch(GITHUB_API, {
      headers: { Accept: "application/vnd.github.v3.raw" },
    });
    if (res.ok) {
      const text = await res.text();
      const books = flattenBooks(JSON.parse(text));
      if (books.length > 0) return Response.json(books);
    }
  } catch {}
  return Response.json([], { status: 500 });
}
