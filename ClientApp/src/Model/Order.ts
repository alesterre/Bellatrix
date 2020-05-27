export default class Order {
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