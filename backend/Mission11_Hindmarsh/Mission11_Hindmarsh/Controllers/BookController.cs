using Microsoft.AspNetCore.Mvc;
using Mission11_Hindmarsh.Data; // Make sure the correct namespace is included

namespace Mission11_Hindmarsh.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        // Constructor to inject BookDbContext
        public BookController(BookDbContext context) => _bookContext = context;
      

        // GET: api/books
        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetBooks(int pageHowMany = 5, int pageNum = 1, string searchQuery = "")
        {
            var booksQuery = _bookContext.Books.AsQueryable();
            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                booksQuery = booksQuery.Where(book => book.Title.ToLower().Contains(searchQuery.ToLower()));
            }
            
            var totalNumBooks = booksQuery.Count();
            
            var books = booksQuery
                .Skip((pageNum - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();

            var someObject = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };
            return Ok(someObject);
        }
    }
}