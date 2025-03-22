using System.ComponentModel.DataAnnotations;

namespace Mission11_Hindmarsh.Data;

public class Book
{
    [Key]
    public int BookID { get; set; }
    
    public string Title { get; set; } = "";
    
    public string Author { get; set; } = "";
    
    public string Publisher { get; set; } = "";
    
    public string ISBN { get; set; } = "";
    
    public string Classification { get; set; } = "";
    
    public string Category { get; set; } = "";
    [Required]
    public int PageCount { get; set; } 
    [Required]
    public double Price { get; set; }
}