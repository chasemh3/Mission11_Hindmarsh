import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart from context
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          pageSize,
          pageNum,
          selectedCategories,
          searchQuery
        );

        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Fix totalPages calculation
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [pageSize, pageNum, selectedCategories, searchQuery]);
  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default BookList;
