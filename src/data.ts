import { Order } from './models/order';
import { Customer } from './models/customer';

export const CUSTOMER_DATA: Customer[] = [
  {
    customerId: 1,
    custFirstName: 'Justin',
    custLastName: 'Tran',
    custCity: 'Ho Chi Minh City',
  },
  {
    customerId: 2,
    custFirstName: 'Justin',
    custLastName: 'Tran',
    custCity: 'Ho Chi Minh City',
  },
  {
    customerId: 3,
    custFirstName: 'Justin',
    custLastName: 'Tran',
    custCity: 'Ho Chi Minh City',
  },
];

export const ORDER_DATA: Order[] = [
  {
    orderNumber: 100000,
    customerId: 1,
    employeeId: 1,
  },
  {
    orderNumber: 100001,
    customerId: 2,
    employeeId: 1,
  },
  {
    orderNumber: 100002,
    customerId: 3,
    employeeId: 1,
  },
  {
    orderNumber: 100003,
    customerId: 1,
    employeeId: 1,
  },
];
