using Microsoft.EntityFrameworkCore;

namespace Mission11_Hindmarsh.Data;

public class BookDbContext : DbContext
{
    public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
    {
    }
    
    public DbSet<Book> Books { get; set; }
}

