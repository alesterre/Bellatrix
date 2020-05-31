import moment from "moment";
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
    totalPrice: number
  ) {
    this.id = id;
    this.dateCreated = dateCreated;
    this.clientName = clientName;
    this.description = description;
    this.totalPrice = totalPrice;
  }

  dateCreatedFormatted(): string {
    return moment(this.dateCreated)
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
  }

  totalPriceFormatted(): string {
    return `$${this.totalPrice}`;
  }

  toString() {
    return `${this.id} - ${this.dateCreatedFormatted()} - ${
      this.clientName
    } - ${this.description}: $${this.totalPrice}`;
  }
}
