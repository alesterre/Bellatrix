using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bellatrix.Model;
using bellatrix.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace bellatrix.Controllers.Orders
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;
        private readonly MongoDbService _service;

        public OrdersController(
            ILogger<OrdersController> logger,
            MongoDbService service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet]
        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _service.Get();
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
