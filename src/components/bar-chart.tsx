import { Card, theme } from 'antd';
import React, { useEffect } from 'react';
import customerClient from '../api/customerClient';
import employeeClient from '../api/employeeClient';
import orderClient from '../api/orderClient';

const { useToken } = theme;

const BarChart = () => {
  const { token } = useToken();
  const [customers, setCustomers] = React.useState<number[]>([]);
  const [orders, setOrders] = React.useState<number[]>([]);
  const [employees, setEmployees] = React.useState<number[]>([]);
  const [chartData, setChartData] = React.useState<number[]>([]);

  useEffect(() => {
    customerClient
      .getCustomers()
      .then((data) =>
        setCustomers(data.map((customer) => customer.customerId))
      );
    orderClient
      .getOrders()
      .then((data) => setOrders(data.map((order) => order.orderNumber)));
    employeeClient
      .getEmployees()
      .then((data) =>
        setEmployees(data.map((employee) => employee.employeeNumber))
      );

    customerClient.subscribe(onCustomerDataChange);
    orderClient.subscribe(onOrderDataChange);
    employeeClient.subscribe(onEmployeeDataChange);
  }, []);

  useEffect(() => {
    setChartData([customers.length, orders.length, employees.length]);
  }, [customers, orders, employees]);

  function onCustomerDataChange() {
    customerClient
      .getCustomers()
      .then((data) =>
        setCustomers(data.map((customer) => customer.customerId))
      );
  }

  function onOrderDataChange() {
    orderClient
      .getOrders()
      .then((data) => setOrders(data.map((order) => order.orderNumber)));
  }

  function onEmployeeDataChange() {
    employeeClient
      .getEmployees()
      .then((data) =>
        setEmployees(data.map((employee) => employee.employeeNumber))
      );
  }

  const chartMaxHeight: number = Math.max(...chartData);
  const chartHeightScale: number = 300 / chartMaxHeight;

  return (
    <Card title='Bar Chart'>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30 }}>
        {chartData.map((data, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                height: data * chartHeightScale,
                width: '10em',
                backgroundColor:
                  i === 0
                    ? token.colorPrimaryActive
                    : i === 1
                      ? token.colorPrimaryText
                      : token.colorPrimaryHover,
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 10,
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{data}</span>
            </div>
            <span style={{ bottom: 0, fontSize: '1.0rem', fontWeight: 'bold' }}>
              {i === 0 ? 'Customers' : i === 1 ? 'Orders' : 'Employees'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BarChart;
