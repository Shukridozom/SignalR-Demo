using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Project
{
    [Authorize]
    public class ChatHub: Hub
    {

        public static void TestSyncDatabase()
        {
            using (AppDbContext dbContext = new AppDbContext())
            {
                var users = dbContext.Users;
                dbContext.RemoveRange(users);
                dbContext.SaveChanges();

                for (int i = 0; i < 10; i++)
                {
                    var user = new User()
                    {
                        FirstName = "FirstName " + i.ToString(),
                        LastName = "LastName " + i.ToString(),
                        Username = "Username " + i.ToString()
                    };
                    users.Add(user);
                    dbContext.SaveChanges();
                }
            }

        }


        public static async Task TestAsyncDatabase()
        {
            using (AppDbContext dbContext = new AppDbContext())
            {
                var users = dbContext.Users;
                dbContext.RemoveRange(users);
                await dbContext.SaveChangesAsync();

                for (int i = 0; i < 10; i++)
                {
                    var user = new User()
                    {
                        FirstName = "FirstName " + i.ToString(),
                        LastName = "LastName " + i.ToString(),
                        Username = "Username " + i.ToString()
                    };
                    await users.AddAsync(user);
                    await dbContext.SaveChangesAsync();
                }
            }

        }
        public async Task SendMessage(string user, string message)
        {

            await Clients.User(user).SendAsync("ReceiveMessage", "Before DB: ", message);
            //TestSyncDatabase();
            await TestAsyncDatabase();
            await Clients.User(user).SendAsync("ReceiveMessage", "After DB: ", message);
        }
    }
}
