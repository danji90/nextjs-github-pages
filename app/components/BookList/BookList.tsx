"use client";
import { useState } from "react";
import Spinner from "@/app/components/Spinner";
import { tryCatch } from "@/app/lib/tryCatch";

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn: string;
  image: string;
  published: string;
  publisher: string;
}

function BookListItem({ book }: { book: Book }) {
  return (
    <li className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold">{book.title}</h2>
      <p className="text-sm text-gray-600">by {book.author}</p>
      <p className="mt-2">{book.description}</p>
    </li>
  );
}

function useBooks() {
  const [books, setBooks] = useState<Array<Book>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchBooks = async () => {
    setLoading(true);
    const [response, err] = await tryCatch(
      fetch("https://www.fakerapi.it/api/v2/books?_quantity=20").then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      }),
    );

    if (err) {
      console.error("Error fetching books:", err);
      setError(err);
      setLoading(false);
      return;
    }

    setBooks(response.data || []);
    setLoading(false);
  };
  return { books, fetchBooks, loading, error };
}

function BookList() {
  const { books, fetchBooks, loading, error } = useBooks();

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-xl">Book List</h1>
      <button
        type="button"
        onClick={fetchBooks}
        disabled={loading}
        className="max-w-max transition group flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 text-white duration-300 hover:bg-gradient-to-l hover:shadow-2xl hover:shadow-purple-600/30 p-[1.5px]"
      >
        <div className="flex px-6 gap-4 h-full w-full items-center justify-center rounded-full bg-gray-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900 group-hover:transition group-hover:duration-300 group-hover:ease-in-out">
          {loading ? (
            <>
              <Spinner /> Loading...
            </>
          ) : (
            "Fetch Books"
          )}
        </div>
      </button>
      {error && (
        <p className="text-red-500 border border-red-500 p-2 rounded max-w-max">
          Error fetching books: {error.message}
        </p>
      )}
      {!loading && !error && (
        <ul className="mt-4 space-y-4">
          {books.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookList;
