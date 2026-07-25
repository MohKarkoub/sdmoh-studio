const GITHUB_API = "https://api.github.com/repos/MohKarkoub/sdmoh-studio/contents/public/books.json";
const RAW_URL = "https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiUrl = GITHUB_API;
  try {
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github.v3.raw" },
    });
    if (res.ok) {
      const text = await res.text();
      const books = JSON.parse(text);
      return Response.json(books);
    }
  } catch {}
  try {
    const raw = await fetch(RAW_URL + "?t=" + Date.now());
    const books = await raw.json();
    return Response.json(books);
  } catch {
    return Response.json([], { status: 500 });
  }
}
