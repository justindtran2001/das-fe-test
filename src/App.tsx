import { useEffect, useState } from "react";
import { CUSTOMER_DATA, ORDER_DATA } from "./data";
import { Customer } from "./models/customer";
import { Order } from "./models/order";
import { Button, Space } from 'antd';
import Table, { ColumnsType } from "antd/es/table";

enum DATA_ENTITIES {
  CUSTOMER,
  ORDER,
  EMPLOYEE
}

const columns: ColumnsType<Customer> = [
  {
    title: 'Customer ID',
    dataIndex: 'customerId',
    key: 'customerId',
  },
  {
    title: 'Customer First Name',
    dataIndex: 'custFirstName',
    key: 'custFirstName',
  },
  {
    title: 'Customer Last Name',
    dataIndex: 'custLastName',
    key: 'custLastName',
  },
  {
    title: 'Customer City',
    dataIndex: 'custCity',
    key: 'custCity',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

function App() {
  const [tableData, setTableData] = useState<Customer[] | Order[]>([]);
  const [currentDataEntity, setCurrentDataEntity] = useState<DATA_ENTITIES>(DATA_ENTITIES.CUSTOMER);

  useEffect(() => {
    setTableData(ORDER_DATA);
  }, [])

  useEffect(() => {
    if (currentDataEntity === DATA_ENTITIES.CUSTOMER)
      setTableData(CUSTOMER_DATA);
    else if (currentDataEntity === DATA_ENTITIES.ORDER)
      setTableData(ORDER_DATA);
  }, [currentDataEntity])

  const changeList = (targetData: DATA_ENTITIES) => {
    setCurrentDataEntity(targetData);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex", padding: 10, gap: 10 }}>
        <div id="side-btns" style={{ display: "flex", flexDirection: "column", width: "20%", gap: 10 }}>
          <Button
            type={currentDataEntity === DATA_ENTITIES.CUSTOMER ? "primary" : "default"}
            onClick={() => changeList(DATA_ENTITIES.CUSTOMER)}>
            View Customers
          </Button>
          <Button
            type={currentDataEntity === DATA_ENTITIES.ORDER ? "primary" : "default"}
            onClick={() => changeList(DATA_ENTITIES.ORDER)}>
            View Orders
          </Button>
          <Button
            type={currentDataEntity === DATA_ENTITIES.EMPLOYEE ? "primary" : "default"}
            onClick={() => changeList(DATA_ENTITIES.EMPLOYEE)}>
            View Employees
          </Button>
        </div>
        <Table columns={columns} dataSource={tableData as Customer[]} />
      </div>
    </div>
  )
}

export default App
