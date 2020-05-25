import Axios from "axios";

export default class OrdersApi {
  public getAll () {
    return Axios.get('/api/orders');
  }
}