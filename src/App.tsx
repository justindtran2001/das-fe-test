import { Tabs } from 'antd';
import CustomerTable from './components/customer-table';
import EmployeeTable from './components/employee-table';
import OrderTable from './components/order-table';

function App() {
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
            children: <CustomerTable />,
          },
          {
            key: '2',
            label: `Order`,
            children: <OrderTable />,
          },
          {
            key: '3',
            label: `Employee`,
            children: <EmployeeTable />,
          },
        ]}
      />
    </div>
  );
}

export default App;
