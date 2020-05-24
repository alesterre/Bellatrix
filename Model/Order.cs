using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bellatrix.Model
{
    public class Order
    {
        public Guid Id { get; set; }
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
