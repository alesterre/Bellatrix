import Axios from "axios";
import Order from '../Model/Order'

export default class OrdersApi {
  public static getAll () {
    return Axios.get('/api/orders');
  }

  public static search (searchParam: string, page: number) {
    return Axios.get('/api/orders/search', { params: {
      searchParam,
      page
    }});
  }

  public static createOrder (newOrder: Order) {
    return Axios.post<Order>('/api/orders', newOrder)
  }

  public static updateOrder (updatedOrder: Order) {
    return Axios.put(`/api/orders/${updatedOrder.id}`, updatedOrder)
  }

  public static deleteOrder (orderId: string) {
    return Axios.delete(`/api/orders/${orderId}`)
  }

  public static create10kOrders () {
    return Axios.post('/api/orders/10k')
  }

  public static deleteAllOrders () {
    return Axios.delete(`/api/orders/all`)
  }
}