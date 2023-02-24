export type Order = {
  key?: number, // for Ant Design table compatibility
  orderNumber: number,
  customerId: number,
  orderDate: Date,
  shipDate: Date,
  employeeNumber: number,
};
