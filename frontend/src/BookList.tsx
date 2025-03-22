import { useEffect, useState } from 'react';
import { Book } from './types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `http://localhost:5000/api/Book?pageHowMany=${pageSize}&pageNum=${pageNum}&searchQuery=${searchQuery.toLowerCase()}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Fix totalPages calculation
    };
    fetchBooks();
  }, [pageSize, pageNum, totalItems, searchQuery]);

  return (
    <>
      <h1 className="text-decoration-underline">Books</h1>
      <br />

      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setPageNum(1);
        }}
      />
      <br />
      <br />

      {books.map((p) => (
        <div
          id="bookCard"
          className="card mx-auto my-3"
          style={{ maxWidth: '400px' }}
          key={p.bookID}
        >
          <h3 className="card-title text-center">{p.title}</h3>
          <div className="card shadow-sm">
            <ul className="list-unstyled">
              <li>
                <strong>Author: </strong>
                {p.author}
              </li>
              <li>
                <strong>Publisher: </strong> {p.publisher}
              </li>
              <li>
                <strong>Classification/Category: </strong> {p.classification}/
                {p.category}
              </li>
              <li>
                <strong>Number of Pages: </strong> {p.pageCount}
              </li>
              <li>
                <strong>Price: </strong> {p.price}
              </li>
              <li>
                <strong>ISBN: </strong>
                {p.isbn}
              </li>
            </ul>
          </div>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>
      <br />
      <br />
      <label>
        Results Per Page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
