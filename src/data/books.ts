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

export async function fetchBooks(includeHidden = false): Promise<Book[]> {
  const res = await fetch("/api/books");
  if (!res.ok) throw new Error("Failed to fetch books");
  const books: Book[] = await res.json();
  return includeHidden ? books : books.filter((b) => !b.hidden);
}

export async function fetchBookById(id: string): Promise<Book | null> {
  const books = await fetchBooks();
  return books.find((b) => b.id === id) ?? null;
}
