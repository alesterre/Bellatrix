import * as React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Table,
  ButtonGroup,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import { Component } from "react";
import Order from "../Model/Order";
import OrdersApi from "../api/ordersApi";

type OrdersState = {
  orders: Order[];
  searchParam: string;
  latestUsedSearchParam: string;
  pagesCount: number;
  currentPage: number;
  modal: boolean;
  modalAction: "Create" | "Update";
  toggle: boolean;

  currentOrderId: string;
  currentOrderDescription: string;
  currentOrderClientName: string;
  currentOrderTotalPrice: number;
};

type IProps = {};

export class Home extends Component<IProps, OrdersState> {
  static displayName = "Orders";

  constructor(props: {}) {
    super(props);
    this.state = {
      orders: new Array<Order>(),
      searchParam: "",
      latestUsedSearchParam: "",
      pagesCount: 1,
      currentPage: 0,
      modal: false,
      modalAction: "Create",
      toggle: false,
      currentOrderId: "",
      currentOrderDescription: "",
      currentOrderClientName: "",
      currentOrderTotalPrice: 0
    };
  }

  async searchInputKeyPress(event: any) {
    if (event.keyCode === 13) {
      await this.onSearch();
    }
  }

  handleSearchParamChange(event: any) {
    this.setState({ searchParam: event.target.value });
  }

  handleDescriptionChange(event: any) {
    this.setState({ currentOrderDescription: event.target.value });
  }

  handleClientNameChange(event: any) {
    this.setState({ currentOrderClientName: event.target.value });
  }

  handleTotalPriceChange(event: any) {
    this.setState({ currentOrderTotalPrice: +event.target.value });
  }

  async handlePageClick(event: any, page: number) {
    event.preventDefault();
    this.setState({ currentPage: page }, async () => await this.reloadOrders());
  }

  async handlePageNofMClick(event: any) {
    event.preventDefault();
  }

  handlePreviousClick(event: any) {
    event.preventDefault();
    this.setState(
      state => {
        return { currentPage: state.currentPage - 1 };
      },
      async () => await this.reloadOrders()
    );
  }
  handleNextClick(event: any) {
    event.preventDefault();
    this.setState(
      state => {
        return { currentPage: state.currentPage + 1 };
      },
      async () => await this.reloadOrders()
    );
  }

  render() {
    const toggle = () => {
      this.setState(state => {
        return { modal: !state.modal };
      });
    };

    return (
      <Container>
        <h1>Orders</h1>
        <Row>
          <Col>
            <InputGroup>
              <Input
                id="search"
                value={this.state.searchParam}
                onKeyDown={async e => await this.searchInputKeyPress(e)}
                onChange={e => this.handleSearchParamChange(e)}
              />
              <InputGroupAddon addonType="append">
                <Button onClick={this.onSearch} color="primary">
                  Search
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        {this.state.latestUsedSearchParam.length > 0 && (
          <Row>
            Only showing orders with client name containing "
            {this.state.latestUsedSearchParam}"
          </Row>
        )}
        <Row>
          {this.state.orders.length > 0 && (
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
                {this.state.orders.map(o => (
                  <tr key={o.id}>
                    <td> {o.dateCreatedFormatted()}</td>
                    <td> {o.clientName}</td>
                    <td align="right"> {o.totalPriceFormatted()}</td>
                    <td> {o.description}</td>
                    <td>
                      <ButtonGroup>
                        <Button onClick={() => this.onEditItem(o)}>Edit</Button>
                        <Button
                          color="danger"
                          onClick={() => this.onDeleteItem(o)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {this.state.orders.length === 0 && <p>No orders</p>}
        </Row>
        {this.state.pagesCount > 1 && (
          <Row>
            <Pagination>
              <PaginationItem disabled={this.state.currentPage <= 0}>
                <PaginationLink
                  onClick={e => this.handlePageClick(e, 0)}
                  href="#"
                >
                  «
                </PaginationLink>
              </PaginationItem>
              <PaginationItem disabled={this.state.currentPage <= 0}>
                <PaginationLink
                  onClick={e => this.handlePreviousClick(e)}
                  previous
                  href="#"
                >
                  ‹
                </PaginationLink>
              </PaginationItem>
              {this.state.pagesCount <= 10 &&
                [...Array(this.state.pagesCount)].map((page, i) => (
                  <PaginationItem active={i === this.state.currentPage} key={i}>
                    <PaginationLink
                      onClick={async e => await this.handlePageClick(e, i)}
                      href="#"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              {this.state.pagesCount > 10 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={async e => await this.handlePageNofMClick(e)}
                  >
                    Page {this.state.currentPage + 1} of {this.state.pagesCount}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem
                disabled={this.state.currentPage >= this.state.pagesCount - 1}
              >
                <PaginationLink
                  onClick={e => this.handleNextClick(e)}
                  next
                  href="#"
                >
                  ›
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                disabled={this.state.currentPage >= this.state.pagesCount - 1}
              >
                <PaginationLink
                  onClick={e =>
                    this.handlePageClick(e, this.state.pagesCount - 1)
                  }
                  href="#"
                >
                  »
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </Row>
        )}
        <Row className="btn-row">
          <Button color="primary" onClick={this.onAddItem}>
            Add new order
          </Button>
          <Button color="secondary" onClick={this.onAdd10Orders}>
            Generate 10 orders
          </Button>
          <Button color="secondary" onClick={this.onAdd10kOrders}>
            Generate 10K orders
          </Button>
          <Button color="danger" onClick={this.onDeleteAllOrders}>
            Delete all orders
          </Button>
        </Row>
        <Modal isOpen={this.state.modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {this.state.modalAction} order
          </ModalHeader>
          <ModalBody>
            <Container>
              <Row md="2">
                <Col>
                  <Label for="clientName">Client name</Label>
                  <Input
                    id="clientName"
                    value={this.state.currentOrderClientName}
                    onChange={e => this.handleClientNameChange(e)}
                  />
                </Col>
                <Col>
                  <Label for="totalPrice">Total price</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      id="totalPrice"
                      placeholder="Total price"
                      type="number"
                      value={this.state.currentOrderTotalPrice}
                      onChange={e => this.handleTotalPriceChange(e)}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    id="description"
                    value={this.state.currentOrderDescription}
                    onChange={e => this.handleDescriptionChange(e)}
                  />
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={async () => {
                await this.submitOrder();
                toggle();
              }}
            >
              {this.state.modalAction}
            </Button>{" "}
            <Button color="secondary" onClick={() => toggle()}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }

  async componentDidMount() {
    await this.reloadOrders();
  }

  onAddItem = () => {
    this.setState(() => {
      return {
        modal: true,
        modalAction: "Create",
        currentOrderId: "",
        currentOrderClientName: "",
        currentOrderTotalPrice: 0,
        currentOrderDescription: ""
      };
    });
  };

  onAdd10Orders = async () => {
    await OrdersApi.createManyOrders(10);
    await this.reloadOrders();
  };

  onAdd10kOrders = async () => {
    await OrdersApi.createManyOrders(10000);
    await this.reloadOrders();
  };

  onDeleteAllOrders = async () => {
    await OrdersApi.deleteAllOrders();
    this.setState(
      () => {
        return { currentPage: 0 };
      },
      async () => await this.reloadOrders()
    );
  };

  onSearch = async () => {
    this.setState({ currentPage: 0 }, async () => await this.reloadOrders());
  };

  onEditItem = (order: Order) => {
    this.setState(() => {
      return {
        modal: true,
        modalAction: "Update",
        currentOrderId: order.id,
        currentOrderDescription: order.description,
        currentOrderClientName: order.clientName,
        currentOrderTotalPrice: order.totalPrice
      };
    });
  };

  onDeleteItem = async (order: Order) => {
    const deletingLastOrderOnPage =
      this.state.currentPage > 0 && this.state.orders.length === 1;

    await OrdersApi.deleteOrder(order.id);

    if (deletingLastOrderOnPage) {
      this.setState(
        state => {
          return { currentPage: state.currentPage - 1 };
        },
        async () => await this.reloadOrders()
      );
    } else {
      await this.reloadOrders();
    }
  };

  async reloadOrders() {
    let ordersResponse = (
      await OrdersApi.search(this.state.searchParam, this.state.currentPage)
    ).data;
    const filteredOrders = ordersResponse.orders.map((apiOrder: any) => {
      return new Order(
        apiOrder.id,
        apiOrder.dateCreated,
        apiOrder.clientName,
        apiOrder.description,
        apiOrder.totalPrice
      );
    });

    this.setState(() => {
      const orders = filteredOrders;
      return {
        orders,
        pagesCount: ordersResponse.pagesCount,
        latestUsedSearchParam: this.state.searchParam
      };
    });
  }

  async submitOrder() {
    const submittedOrder = new Order(
      "",
      new Date(),
      this.state.currentOrderClientName,
      this.state.currentOrderDescription,
      this.state.currentOrderTotalPrice
    );
    if (this.state.modalAction === "Create") {
      await OrdersApi.createOrder(submittedOrder);
    } else {
      submittedOrder.id = this.state.currentOrderId;
      await OrdersApi.updateOrder(submittedOrder);
    }
    await this.reloadOrders();
  }
}
