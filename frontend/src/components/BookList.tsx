import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart from context

  const handleAddToCart = (bookID: number, title: string, price: number) => {
    if (!bookID || !title || !price) {
      console.error('Missing book details');
      return;
    }

    const newItem: CartItem = {
      bookID,
      title,
      price,
    };
    addToCart(newItem); // Add the item to the cart
    navigate('/cart'); // Navigate to the cart page
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `http://localhost:5000/api/Book?pageHowMany=${pageSize}&pageNum=${pageNum}&searchQuery=${searchQuery.toLowerCase()}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Fix totalPages calculation
    };
    fetchBooks();
  }, [pageSize, pageNum, totalItems, searchQuery, selectedCategories]);

  return (
    <>
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
        <div key={p.bookID}>
          <div className="card shadow-lg rounded">
            <div className="card-body">
              <h5 className="card-title">{p.title}</h5>
              <ul className="list-unstyled">
                <li>
                  <strong>Author: </strong>
                  {p.author}
                </li>
                <li>
                  <strong>Publisher: </strong>
                  {p.publisher}
                </li>
                <li>
                  <strong>Classification/Category: </strong>
                  {p.classification}/{p.category}
                </li>
                <li>
                  <strong>Number of Pages: </strong>
                  {p.pageCount}
                </li>
                <li>
                  <strong>Price: </strong>
                  {p.price}
                </li>
                <li>
                  <strong>ISBN: </strong>
                  {p.isbn}
                </li>
              </ul>
              <button
                className="btn btn-success"
                onClick={() => handleAddToCart(p.bookID, p.title, p.price)} // Call the function with necessary arguments
              >
                Add To Cart
              </button>
            </div>
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
