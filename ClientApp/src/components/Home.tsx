import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col,
         Label, Input, InputGroup, InputGroupAddon, Table, ButtonGroup  } from 'reactstrap';
import { Component } from 'react';
import Order from '../Model/Order'
import OrdersApi from '../api/ordersApi'
import { booleanLiteral } from '@babel/types';

type OrdersState = {
  orders: Order[],
  modal: boolean,
  modalAction: 'Create' | 'Update',
  toggle: boolean,

  currentOrderId: string,
  currentOrderDescription: string,
  currentOrderClientName: string,
  currentOrderTotalPrice: number
}

type IProps = {}

export class Home extends Component<IProps, OrdersState> {
  static displayName = 'Orders';

  constructor(props: {}) {
    super(props);
    this.state = {
      orders: new Array<Order>(),
      modal: false,
      modalAction: 'Create',
      toggle: false,
      currentOrderId: "",
      currentOrderDescription: "",
      currentOrderClientName: "",
      currentOrderTotalPrice: 0
     };
  }

  handleDescriptionChange(event: any) {
    this.setState({currentOrderDescription: event.target.value});
  }

  handleClientNameChange(event: any) {
    this.setState({currentOrderClientName: event.target.value});
  }

  handleTotalPriceChange(event: any) {
    this.setState({currentOrderTotalPrice: +event.target.value});
  }

  render () {
    const toggle = () => {
       this.setState(state => { return { modal: !state.modal} })
      };

    return (
      <div>
        <h1>Orders</h1>
        <Table>
          <thead>
            <tr>
              <th>Created at</th>
              <th>Client name</th>
              <th>Total price</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.orders.map((o) =>
              <tr key={o.id}>
                <td> {o.dateCreatedFormat()}</td>
                <td> {o.clientName}</td>
                <td> {o.totalPrice}</td>
                <td> {o.description}</td>
                <td>
                  <ButtonGroup>
                    <Button onClick={() => this.onEditItem(o)}>Edit</Button>
                    <Button color="danger" onClick={() => this.onDeleteItem(o)}>Delete</Button>
                  </ButtonGroup>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Button
          type="button"
          onClick={this.onAddItem}
        >
          Add new order
        </Button>
        <Modal isOpen={this.state.modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>{this.state.modalAction} order</ModalHeader>
          <ModalBody>
            <Container>
              <Row md="2">
                <Col>
                  <Label for="clientName">Client name</Label>
                  <Input id="clientName"
                         value={this.state.currentOrderClientName}
                         onChange={(e) => this.handleClientNameChange(e)} />
                </Col>
                <Col>
                  <Label for="totalPrice">Total price</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input id="totalPrice" placeholder="Total price" type="number"
                           value={this.state.currentOrderTotalPrice}
                           onChange={(e) => this.handleTotalPriceChange(e)} />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label for="description">Description</Label>
                  <Input type="textarea" id="description"
                         value={this.state.currentOrderDescription}
                         onChange={(e) => this.handleDescriptionChange(e)} />
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={ async () => { await this.submitOrder(); toggle()}}>{this.state.modalAction}</Button>{' '}
            <Button color="secondary" onClick={ () => toggle() }>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    await this.reloadOrders()
  }

  onAddItem = () => {
    this.setState(() => {
      return {
        modal: true,
        modalAction: 'Create',
        currentOrderId: '',
        currentOrderClientName: '',
        currentOrderTotalPrice: 0,
        currentOrderDescription: ''
      }
    })
  };

  onEditItem = (order: Order) => {
    this.setState(() => {
      return {
        modal: true,
        modalAction: 'Update',
        currentOrderId: order.id,
        currentOrderDescription: order.description,
        currentOrderClientName: order.clientName,
        currentOrderTotalPrice: order.totalPrice
      }
    })
  }

  onDeleteItem = async (order: Order) => {
    await OrdersApi.deleteOrder(order.id);
    await this.reloadOrders();
  }

  async reloadOrders() {
    const allOrders = (await OrdersApi.getAll()).data.map((apiOrder: any) => {
      return new Order(apiOrder.id, apiOrder.dateCreated, apiOrder.clientName, apiOrder.description, apiOrder.totalPrice)
    } );

    this.setState(() => {
      const orders = allOrders
      return { orders }
    })
  }

  async submitOrder() {
    const submittedOrder = new Order('', new Date(), this.state.currentOrderClientName,
      this.state.currentOrderDescription, this.state.currentOrderTotalPrice);
    if (this.state.modalAction === 'Create') {
      await OrdersApi.createOrder(submittedOrder);
    } else {
      submittedOrder.id = this.state.currentOrderId;
      await OrdersApi.updateOrder(submittedOrder);
    }
    await this.reloadOrders();
  }
}
