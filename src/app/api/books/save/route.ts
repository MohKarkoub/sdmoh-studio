import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com/repos/MohKarkoub/sdmoh-studio/contents/public/books.json";

export async function POST(req: NextRequest) {
  try {
    const { books, token, message } = await req.json();
    if (!books || !token) {
      return NextResponse.json({ error: "Missing books or token" }, { status: 400 });
    }

    const shaRes = await fetch(GITHUB_API, {
      headers: { Authorization: `token ${token}` },
    });

    if (!shaRes.ok) {
      const err = await shaRes.json().catch(() => ({}));
      if (shaRes.status === 401 || shaRes.status === 403) {
        return NextResponse.json({ error: "Token invalid or expired" }, { status: 401 });
      }
      return NextResponse.json({ error: err.message || "GitHub API error" }, { status: shaRes.status });
    }

    const shaData = await shaRes.json();
    const sha = shaData.sha;

    const raw = shaData.content.replace(/\s/g, "");
    const currentBooks = JSON.parse(decodeURIComponent(escape(atob(raw))));
    currentBooks.push(books);

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(currentBooks, null, 2))));

    const putRes = await fetch(GITHUB_API, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message || "Add book via SDMoh Studio",
        content,
        sha,
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      if (putRes.status === 401 || putRes.status === 403) {
        return NextResponse.json({ error: "Token missing write permission" }, { status: 401 });
      }
      return NextResponse.json({ error: err.message || "GitHub API error" }, { status: putRes.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
