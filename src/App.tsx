import { Input, Space, Tabs } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { CUSTOMER_DATA, EMPLOYEE_DATA, ORDER_DATA } from './data';
import { Customer } from './models/customer';
import { Employee } from './models/employee';
import { Order } from './models/order';

enum DATA_ENTITIES {
  CUSTOMER,
  ORDER,
  EMPLOYEE,
}

const TableColumns: {
  CUSTOMER: ColumnsType<Customer>;
  ORDER: ColumnsType<Order>;
  EMPLOYEE: ColumnsType<Employee>;
} = {
  CUSTOMER: [
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      sorter: (a: Customer, b: Customer) => a.customerId - b.customerId,
    },
    {
      title: 'Customer First Name',
      dataIndex: 'custFirstName',
      key: 'custFirstName',
      sorter: (a: Customer, b: Customer) =>
        a.custFirstName.localeCompare(b.custFirstName),
    },
    {
      title: 'Customer Last Name',
      dataIndex: 'custLastName',
      key: 'custLastName',
      sorter: (a: Customer, b: Customer) =>
        a.custLastName.localeCompare(b.custLastName),
    },
    {
      title: 'Customer City',
      dataIndex: 'custCity',
      key: 'custCity',
      sorter: (a: Customer, b: Customer) =>
        a.custCity.localeCompare(b.custCity),
    },
    {
      title: 'Customer State',
      dataIndex: 'custState',
      key: 'custState',
      sorter: (a: Customer, b: Customer) =>
        a.custState.localeCompare(b.custState),
    },
    {
      title: 'Customer Zipcode',
      dataIndex: 'custZipcode',
      key: 'custZipcode',
      sorter: (a: Customer, b: Customer) =>
        a.custZipcode.localeCompare(b.custZipcode),
    },
    {
      title: 'Customer Phone',
      dataIndex: 'custPhone',
      key: 'custPhone',
      sorter: (a: Customer, b: Customer) =>
        a.custPhone.localeCompare(b.custPhone),
    },
    {
      title: 'Customer Email address',
      dataIndex: 'custEmailAddress',
      key: 'custEmailAddress',
      sorter: (a: Customer, b: Customer) =>
        a.custEmailAddress.localeCompare(b.custEmailAddress),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size='middle'>
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ],
  ORDER: [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      sorter: (a: Order, b: Order) => a.orderNumber - b.orderNumber,
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      sorter: (a: Order, b: Order) => a.customerId - b.customerId,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a: Order, b: Order) =>
        a.orderDate.getTime() - b.orderDate.getDate(),
      render: (_, record) => record.orderDate.toDateString(),
    },
    {
      title: 'Ship Date',
      dataIndex: 'shipDate',
      key: 'shipDate',
      sorter: (a: Order, b: Order) =>
        a.shipDate.getTime() - b.shipDate.getTime(),
      render: (_, record) => record.orderDate.toDateString(),
    },
    {
      title: 'Employee Number',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      sorter: (a: Order, b: Order) => a.employeeNumber - b.employeeNumber,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size='middle'>
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ],
  EMPLOYEE: [
    {
      title: 'Employee Number',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      sorter: (a: Employee, b: Employee) => a.employeeNumber - b.employeeNumber,
    },
    {
      title: 'Employee First Name',
      dataIndex: 'empFirstName',
      key: 'empFirstName',
      sorter: (a: Employee, b: Employee) =>
        a.empFirstName.localeCompare(b.empFirstName),
    },
    {
      title: 'Employee Last Name',
      dataIndex: 'empLastName',
      key: 'empLastName',
      sorter: (a: Employee, b: Employee) =>
        a.empLastName.localeCompare(b.empLastName),
    },
    {
      title: 'Employee Street Address',
      dataIndex: 'empStreetAddress',
      key: 'empStreetAddress',
      sorter: (a: Employee, b: Employee) =>
        a.empStreetAddress.localeCompare(b.empStreetAddress),
    },
    {
      title: 'Employee City',
      dataIndex: 'empCity',
      key: 'empCity',
      sorter: (a: Employee, b: Employee) => a.empCity.localeCompare(b.empCity),
    },
    {
      title: 'Employee State',
      dataIndex: 'empState',
      key: 'empState',
      sorter: (a: Employee, b: Employee) =>
        a.empState.localeCompare(b.empState),
    },
    {
      title: 'Employee Zipcode',
      dataIndex: 'empZipcode',
      key: 'empZipcode',
      sorter: (a: Employee, b: Employee) =>
        a.empZipcode.localeCompare(b.empZipcode),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size='middle'>
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ],
};

function App() {
  const [tableData, setTableData] = useState<Customer[] | Order[] | Employee[]>(
    []
  );
  const [tableColumns, setTableColumns] = useState<
    ColumnsType<Customer> | ColumnsType<Order> | ColumnsType<Employee>
  >([]);
  const [currentDataEntity, setCurrentDataEntity] = useState<DATA_ENTITIES>(
    DATA_ENTITIES.CUSTOMER
  );
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    updateTableData();
  }, []);

  useEffect(() => {
    updateTableData();
  }, [currentDataEntity]);

  useEffect(() => {
    // TODO: If the previous search value is shorter than the current search value, we can just filter the existing tableData
    if (searchValue.length !== 0) {
      updateTableData();
    } else {
      setTableData(
        tableData.filter((row: Customer | Order | Employee) =>
          Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchValue.toLowerCase())
          )
        )
      );
    }
  }, [searchValue]);

  const changeTab = (activeKey: string) => {
    switch (activeKey) {
      case '1':
        setCurrentDataEntity(DATA_ENTITIES.CUSTOMER);
        break;
      case '2':
        setCurrentDataEntity(DATA_ENTITIES.ORDER);
        break;
      case '3':
        setCurrentDataEntity(DATA_ENTITIES.EMPLOYEE);
        break;
      default:
        break;
    }
  };

  const updateTableData = () => {
    switch (currentDataEntity) {
      case DATA_ENTITIES.CUSTOMER:
        setTableData(
          CUSTOMER_DATA.map((customer) => {
            customer.key = customer.customerId;
            return customer;
          })
        );
        setTableColumns(TableColumns.CUSTOMER);
        break;
      case DATA_ENTITIES.ORDER:
        setTableData(
          ORDER_DATA.map((order) => {
            order.key = order.orderNumber;
            return order;
          })
        );
        setTableColumns(TableColumns.ORDER);
        break;
      case DATA_ENTITIES.EMPLOYEE:
        setTableData(
          EMPLOYEE_DATA.map((emp) => {
            emp.key = emp.employeeNumber;
            return emp;
          })
        );
        setTableColumns(TableColumns.EMPLOYEE);
        break;
      default:
        break;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 50,
      }}
    >
      <Tabs
        defaultActiveKey='1'
        items={[
          {
            key: '1',
            label: `Customer`,
            children: (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Input
                    style={{ width: '15em' }}
                    placeholder='search'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <Table
                  dataSource={tableData as Customer[]}
                  columns={tableColumns as ColumnsType<Customer>}
                />
              </div>
            ),
          },
          {
            key: '2',
            label: `Order`,
            children: (
              <Table
                dataSource={tableData as Order[]}
                columns={tableColumns as ColumnsType<Order>}
              />
            ),
          },
          {
            key: '3',
            label: `Employee`,
            children: (
              <Table
                dataSource={tableData as Employee[]}
                columns={tableColumns as ColumnsType<Employee>}
              />
            ),
          },
        ]}
        onChange={changeTab}
      />
    </div>
  );
}

export default App;
