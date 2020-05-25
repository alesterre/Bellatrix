import * as React from 'react';
import { Component } from 'react';
import OrdersApi from '../api/ordersApi'

class Order {
  id: string;
  dateCreated: Date;
  clientName: string;
  description: string;
  totalPrice: number;

  constructor(
    id: string,
    dateCreated: Date,
    clientName: string,
    description: string,
    totalPrice: number) {
    this.id = id;
    this.dateCreated = dateCreated;
    this.clientName = clientName;
    this.description = description;
    this.totalPrice = totalPrice;
  }

  toString() {
    return `${this.id} - ${this.dateCreated} - ${this.clientName} - ${this.description}: $${this.totalPrice}`
  }
}

type OrdersState = {
  orders: Order[]
}

type IProps = {}

export class Home extends Component<IProps, OrdersState> {
  static displayName = 'Orders';

  constructor(props: {}) {
    super(props);
    this.state = { orders: new Array<Order>() };
  }

  render () {
    return (
      <div>
        <h1>Orders</h1>
        <ul>{this.state.orders.map((o) =>
          <li key={o.id}>
            Order: {o.toString()}
          </li>
        )}</ul>
        <button
          type="button"
          onClick={this.onAddItem}
        >
          Add
        </button>
      </div>
    );
  }

  async componentDidMount() {
    const ordersApi = new OrdersApi();

    const allOrders = (await ordersApi.getAll()).data.map((apiOrder: any) => {
      return new Order(apiOrder.id, apiOrder.dateCreated, apiOrder.clientName, apiOrder.description, apiOrder.totalPrice)
    } );

    this.setState(() => {
      const orders = allOrders
      return { orders }
    })
  }

  onAddItem = () => {
    this.setState(state => {
      const orders = state.orders.concat(new Order('', new Date(), 'Dog Solutions Inc.', '', 40))
      return { orders }
    })
  };
}
