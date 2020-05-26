using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bellatrix.Model
{
    public class BellatrixDatabaseSettings : IBellatrixDatabaseSettings
    {
        public string OrdersCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IBellatrixDatabaseSettings
    {
        string OrdersCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
