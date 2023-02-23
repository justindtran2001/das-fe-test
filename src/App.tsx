import DataTable, { DataTableColumn } from "./components/data-table"
import "./App.css"
import { useEffect, useState } from "react";
import { CUSTOMER_DATA, ORDER_DATA } from "./data";
import { Customer } from "./models/customer";
import { Order } from "./models/order";

enum DATA_ENTITIES {
  CUSTOMER,
  ORDER,
  EMPLOYEE
}

// const headersType = {
//   CUSTOMER: [
//     "Customer ID",
//     "Customer First Name",
//     "Customer Last Name",
//     "Customer City"
//   ],
//   ORDER: [
//     "Order Number",
//     "Customer ID",
//     "Employee ID",
//   ]
// }

const tableColumns = [
  {
    label: "Customer ID",
    field: "customerId"
  },
  {
    label: "Customer First name",
    field: "custFirstName"
  },
  {
    label: "Customer Last name",
    field: "custLastName"
  },
  {
    label: "Customer City",
    field: "custCity"
  },

];

function App() {
  const [tableData, setTableData] = useState<Customer[] | Order[]>([]);

  useEffect(() => {
    setTableData(ORDER_DATA);
  }, [])

  const changeList = (targetData: DATA_ENTITIES) => {
    if (targetData === DATA_ENTITIES.CUSTOMER)
      setTableData(CUSTOMER_DATA);
    else if (targetData === DATA_ENTITIES.ORDER)
      setTableData(ORDER_DATA);
  }

  return (
    <div className="App">
      <div style={{ display: "flex", padding: 50, gap: 50, alignItems: "start" }}>
        <div className="sidebar">
          <button
            className="view-list-button"
            id="view-customer-btn"
            onClick={() => changeList(DATA_ENTITIES.CUSTOMER)}>
            View Customers
          </button>
          <button
            className="view-list-button"
            id="view-orders-btn"
            onClick={() => changeList(DATA_ENTITIES.ORDER)}>
            View Orders
          </button>
          <button
            className="view-list-button"
            id="view-employees-btn"
            onClick={() => changeList(DATA_ENTITIES.EMPLOYEE)}>
            View Employees
          </button>
        </div>
        <DataTable data={tableData} columns={tableColumns} />
      </div>
    </div>
  )
}

export default App
