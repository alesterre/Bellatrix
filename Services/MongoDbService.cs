using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bellatrix.Model;
using MongoDB.Bson;
using MongoDB.Driver;

namespace bellatrix.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<Order> _orders;

        public MongoDbService(IBellatrixDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _orders = database.GetCollection<Order>(settings.OrdersCollectionName);
        }

        public async Task<List<Order>> GetAsync() =>
            await _orders.Find(order => true).ToListAsync();

        public async Task<List<Order>> SearchAsync(string searchParam)
        {
            var filter = new BsonDocument
            {
                {
                    "ClientName", 
                    new BsonDocument 
                    { 
                        {"$regex", searchParam ?? ""}, {"$options", "i"}
                    }
                }
            };

            return await _orders
                .Find(filter)
                .ToListAsync();
        }

        public async Task<Order> GetAsync(string id) =>
            await _orders.Find<Order>(order => order.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Order order)
        {
            await _orders.InsertOneAsync(order);
        }

        public async Task UpdateAsync(string id, Order orderIn)
        {
            var updateBsonDoc = new BsonDocument
            {
                {"ClientName", orderIn.ClientName},
                {"Description", orderIn.Description},
                {"TotalPrice", orderIn.TotalPrice}
            };

            await _orders.UpdateOneAsync(order => order.Id == id,
                new BsonDocument("$set", updateBsonDoc));
        }

        public async Task RemoveAsync(string id)
        {
            await _orders.DeleteOneAsync(order => order.Id == id);
        }
    }
}
