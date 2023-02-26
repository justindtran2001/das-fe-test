import { Customer } from '../models/customer';

class CustomerClient {
  private CUSTOMER_DATA: Customer[] = [
    {
      customerId: 1,
      custFirstName: 'John',
      custLastName: 'Doe',
      custCity: 'New York',
      custState: 'NY',
      custZipcode: '10001',
      custPhone: '555-555-5555',
      custEmailAddress: 'johndoe@example.com',
    },
    {
      customerId: 2,
      custFirstName: 'Jane',
      custLastName: 'Doe',
      custCity: 'San Francisco',
      custState: 'CA',
      custZipcode: '94102',
      custPhone: '555-555-5555',
      custEmailAddress: 'janedoe@example.com',
    },
    {
      customerId: 3,
      custFirstName: 'Bob',
      custLastName: 'Smith',
      custCity: 'Chicago',
      custState: 'IL',
      custZipcode: '60601',
      custPhone: '555-555-5555',
      custEmailAddress: 'bobsmith@example.com',
    },
    {
      customerId: 4,
      custFirstName: 'Alice',
      custLastName: 'Johnson',
      custCity: 'Seattle',
      custState: 'WA',
      custZipcode: '98101',
      custPhone: '555-555-5555',
      custEmailAddress: 'alicejohnson@example.com',
    },
    {
      customerId: 5,
      custFirstName: 'Michael',
      custLastName: 'Brown',
      custCity: 'Los Angeles',
      custState: 'CA',
      custZipcode: '90001',
      custPhone: '555-555-5555',
      custEmailAddress: 'michaelbrown@example.com',
    },
    {
      customerId: 6,
      custFirstName: 'Karen',
      custLastName: 'Wilson',
      custCity: 'Houston',
      custState: 'TX',
      custZipcode: '77001',
      custPhone: '555-555-5555',
      custEmailAddress: 'karenwilson@example.com',
    },
    {
      customerId: 7,
      custFirstName: 'David',
      custLastName: 'Lee',
      custCity: 'Miami',
      custState: 'FL',
      custZipcode: '33101',
      custPhone: '555-555-5555',
      custEmailAddress: 'davidlee@example.com',
    },
  ];
  private nextAvailableId = this.CUSTOMER_DATA.length + 1;
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

  async createNewCustomer(newCust: Customer): Promise<void> {
    newCust.customerId = this.nextAvailableId++;
    this.CUSTOMER_DATA.push(newCust);
    this.notifyChangesToSubscribers();
  }

  async getCustomers(): Promise<Customer[]> {
    const customers = this.CUSTOMER_DATA;
    return customers;
  }

  async getListOfCustomerIds(): Promise<number[]> {
    const customerIds = this.CUSTOMER_DATA.map((cust) => cust.customerId);
    return customerIds;
  }

  async updateCustomer(updatedCust: Customer): Promise<void> {
    this.CUSTOMER_DATA = this.CUSTOMER_DATA.map((cust: Customer) => {
      if (cust.customerId === updatedCust.customerId) {
        return updatedCust;
      }
      return cust;
    });
    this.notifyChangesToSubscribers();
  }

  async deleteCustomer(customerId: number): Promise<void> {
    this.CUSTOMER_DATA = this.CUSTOMER_DATA.filter(
      (c) => c.customerId !== customerId
    );
    this.notifyChangesToSubscribers();
  }
}

const customerClient = new CustomerClient();
export default customerClient;
