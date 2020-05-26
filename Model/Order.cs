using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace bellatrix.Model
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public DateTime DateCreated { get; set; }
        public string ClientName { get; set; }
        public string Description { get; set; }
        public decimal TotalPrice { get; set; }

        public override string ToString()
        {
            return $"{Id.ToString().Substring(0, 10)} - {DateCreated} - {ClientName} - {Description}: {TotalPrice:C}";
        }
    }
}
