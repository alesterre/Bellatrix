using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bellatrix.Model;
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

        public Order Get(string id) =>
            _orders.Find<Order>(order => order.Id == id).FirstOrDefault();

        public async Task CreateAsync(Order order)
        {
            await _orders.InsertOneAsync(order);
        }

        public async Task UpdateAsync(string id, Order orderIn)
        {
            await _orders.ReplaceOneAsync(order => order.Id == id, orderIn);
        }

        public async Task RemoveAsync(string id)
        {
            await _orders.DeleteOneAsync(order => order.Id == id);
        }
    }
}
