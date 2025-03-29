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
        public ActionResult<IEnumerable<Book>> GetBooks(int pageHowMany = 5, int pageNum = 1, string searchQuery ="", [FromQuery] List<string>? bookTypes = null)
        {
            var query = _bookContext.Books.AsQueryable();

// Filter by category
            if (bookTypes != null && bookTypes.Any())
            {
                query = query.Where(b => bookTypes.Contains(b.Category));
            }

// Filter by search query
            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                query = query.Where(book => book.Title.ToLower().Contains(searchQuery.ToLower()));
            }

// Get total book count after filtering
            var totalNumBooks = query.Count();

// Apply pagination
            var books = query
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

        [HttpGet("GetCategories")]

        public IActionResult GetCategories()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            return Ok(bookCategories);
        }
    }
}