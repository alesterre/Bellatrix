using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bellatrix.Model;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace bellatrix.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<Order> _orders;

        private const int PageSize = 10;

        public MongoDbService(IBellatrixDatabaseSettings settings, ILogger<MongoDbService> logger)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _orders = database.GetCollection<Order>(settings.OrdersCollectionName);

            _orders.Indexes.CreateOne(
                new CreateIndexModel<Order>(
                    new BsonDocumentIndexKeysDefinition<Order>(
                        new BsonDocument("DateCreated", -1)), new CreateIndexOptions { Name = "DateCreatedIndex" }));
        }

        public async Task<List<Order>> GetAsync() =>
            await _orders.Find(order => true).ToListAsync();

        public async Task<(List<Order>, long)> SearchAsync(string searchParam, int page)
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

            var sort = new BsonDocument
            {
                {
                    "DateCreated", -1
                }
            };

            var orders = await _orders
                .Find(filter)
                .Sort(sort)
                .Skip(page*PageSize)
                .Limit(PageSize)
                .ToListAsync();

            var pagesCount = (await _orders.Find(filter).CountDocumentsAsync() - 1) / PageSize + 1;

            return (orders, pagesCount);
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

        public async Task RemoveAllAsync()
        {
            await _orders.DeleteManyAsync(order => true);
        }

        public async Task Create10KAsync()
        {
            var randomOrders = Enumerable.Range(0, 10_000)
                .ToList()
                .Select(i => RandomOrderGenerator.GenerateRandomOrder());
            
            await _orders.InsertManyAsync(randomOrders);
        }
    }
}
