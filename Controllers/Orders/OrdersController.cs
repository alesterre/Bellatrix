using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bellatrix.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace bellatrix.Controllers.Orders
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ILogger<OrdersController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<Order>> GetAll()
        {
            return new List<Order>
            {
                new Order
                {
                    Id = Guid.NewGuid(),
                    DateCreated = DateTime.Now,
                    ClientName = "Doggo Inc.",
                    Description = "Dog food",
                    TotalPrice = (decimal) 500.55
                },
                new Order
                {
                    Id = Guid.NewGuid(),
                    DateCreated = DateTime.Now,
                    ClientName = "Musical Service",
                    Description = "Piano spare parts",
                    TotalPrice = (decimal) 1500.00
                }
            };
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Order order)
        {
            _logger.LogInformation(order.ToString());

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] Order order)
        {
            _logger.LogInformation(id.ToString());
            _logger.LogInformation(order.ToString());

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            _logger.LogInformation(id.ToString());

            return Ok();
        }
    }
}
