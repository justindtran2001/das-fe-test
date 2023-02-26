import { Order } from '../models/order';

class OrderClient {
  private ORDER_DATA: Order[] = [
    {
      orderNumber: 1,
      customerId: 1,
      orderDate: new Date('2022-01-01T00:00:00.000Z'),
      shipDate: new Date('2022-01-03T00:00:00.000Z'),
      employeeNumber: 1,
    },
    {
      orderNumber: 2,
      customerId: 2,
      orderDate: new Date('2022-01-02T00:00:00.000Z'),
      shipDate: new Date('2022-01-05T00:00:00.000Z'),
      employeeNumber: 2,
    },
    {
      orderNumber: 3,
      customerId: 3,
      orderDate: new Date('2022-01-03T00:00:00.000Z'),
      shipDate: new Date('2022-01-06T00:00:00.000Z'),
      employeeNumber: 1,
    },
    {
      orderNumber: 4,
      customerId: 4,
      orderDate: new Date('2022-01-04T00:00:00.000Z'),
      shipDate: new Date('2022-01-07T00:00:00.000Z'),
      employeeNumber: 2,
    },
    {
      orderNumber: 5,
      customerId: 5,
      orderDate: new Date('2022-01-05T00:00:00.000Z'),
      shipDate: new Date('2022-01-08T00:00:00.000Z'),
      employeeNumber: 1,
    },
    {
      orderNumber: 6,
      customerId: 6,
      orderDate: new Date('2022-01-06T00:00:00.000Z'),
      shipDate: new Date('2022-01-09T00:00:00.000Z'),
      employeeNumber: 2,
    },
    {
      orderNumber: 7,
      customerId: 7,
      orderDate: new Date('2022-01-07T00:00:00.000Z'),
      shipDate: new Date('2022-01-10T00:00:00.000Z'),
      employeeNumber: 1,
    },
  ];
  private nextAvailableNumber = this.ORDER_DATA.length + 1;
  private observers: ((params?: any) => any)[] = [];

  constructor() {}

  subscribe(func: (params?: any) => any) {
    this.observers.push(func);
  }

  unsubscribe(func: () => {}) {
    this.observers = this.observers.filter((observer) => observer !== func());
  }

  notifyChangesToSubscribers() {
    this.observers.forEach((observer) => observer());
  }
  async createNewOrder(newOrder: Order): Promise<void> {
    newOrder.orderNumber = this.nextAvailableNumber++;
    this.ORDER_DATA.push(newOrder);
    this.notifyChangesToSubscribers();
  }

  async getOrders(): Promise<Order[]> {
    const orders = this.ORDER_DATA;
    return orders;
  }

  async updateOrder(updatedOrder: Order): Promise<void> {
    this.ORDER_DATA = this.ORDER_DATA.map((order: Order) => {
      if (order.orderNumber === updatedOrder.orderNumber) {
        return updatedOrder;
      }
      return order;
    });
    this.notifyChangesToSubscribers();
  }

  async deleteOrder(orderNum: number): Promise<void> {
    this.ORDER_DATA = this.ORDER_DATA.filter(
      (order) => order.orderNumber !== orderNum
    );
    this.notifyChangesToSubscribers();
  }
}

const orderClient = new OrderClient();
export default orderClient;
