export interface Book {
  id: string;
  title: string;
  asin: string;
  amazonLink: string;
  coverImage: string;
  description: string;
  printLength: string;
  language: string;
  publicationDate: string;
  dimensions: string;
  isbn: string;
  price: string;
  contentPages: string[];
  hidden?: boolean;
}

export const BOOKS_JSON_URL = "https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json";

export async function fetchBooks(includeHidden = false): Promise<Book[]> {
  const res = await fetch(BOOKS_JSON_URL);
  if (!res.ok) throw new Error("Failed to fetch books");
  const books: Book[] = await res.json();
  return includeHidden ? books : books.filter((b) => !b.hidden);
}

export async function fetchBookById(id: string): Promise<Book | null> {
  const books = await fetchBooks();
  return books.find((b) => b.id === id) ?? null;
}
