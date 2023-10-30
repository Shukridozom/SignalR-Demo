using Microsoft.EntityFrameworkCore;

namespace Project
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("Server=localhost;Port=3306;Database=SignalR_Demo;Uid=root;Pwd=testpassword;");
        }

    }
}
