using System;
using System.Collections.Generic;
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
            return await _service.GetAsync();
        }

        [HttpGet("search")]
        public async Task<OrdersResponse> Search([FromQuery] string searchParam, [FromQuery] int page)
        {
            var (orders, pagesCount) = await _service.SearchAsync(searchParam, page);

            return new OrdersResponse {Orders = orders, PagesCount = pagesCount};
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Order order)
        {
            order.DateCreated = DateTime.UtcNow;
            await _service.CreateAsync(order);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, [FromBody] Order order)
        {
            var orderToUpdate = await _service.GetAsync(id);

            if (orderToUpdate == null)
            {
                return NotFound();
            }

            await _service.UpdateAsync(id, order);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var orderToDelete = await _service.GetAsync(id);

            if (orderToDelete == null)
            {
                return NotFound();
            }

            await _service.RemoveAsync(id);
            return Ok();
        }

        [HttpPost("generate/{count}")]
        public async Task<ActionResult> CreateMany(int count)
        {
            if (count < 1)
            {
                return UnprocessableEntity("Number of orders to generate should be at least 1.");
            }

            if (count > 1_000_000)
            {
                return UnprocessableEntity($"{count} is too much.");
            }

            await _service.CreateManyAsync(count);
            return Ok();
        }

        [HttpDelete("all")]
        public async Task<ActionResult> DeleteAll()
        {
            await _service.RemoveAllAsync();
            return Ok();
        }

        public class OrdersResponse
        {
            public IList<Order> Orders { get; set; }
            public long PagesCount { get; set; }
        }
    }
}
