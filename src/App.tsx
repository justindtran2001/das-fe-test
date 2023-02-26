import { Card, Tabs } from 'antd';
import BarChart from './components/bar-chart';
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
        alignItems: 'flex-start',
        padding: 50,
        gap: 30,
      }}
    >
      <Card title='Data Tables'>
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
      </Card>
      <BarChart
      />
    </div>
  );
}

export default App;
