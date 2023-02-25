import { Card, Tabs } from 'antd';
import { useState } from 'react';
import BarChart from './components/bar-chart';
import CustomerTable from './components/customer-table';
import EmployeeTable from './components/employee-table';
import OrderTable from './components/order-table';

function App() {
  const [newDataAlert, setNewDataAlert] = useState(false);

  const handleDataChange = () => {
    console.log('data changed');
    setNewDataAlert(true);
  };

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
              children: <CustomerTable onDataChange={handleDataChange} />,
            },
            {
              key: '2',
              label: `Order`,
              children: <OrderTable onDataChange={handleDataChange} />,
            },
            {
              key: '3',
              label: `Employee`,
              children: <EmployeeTable onDataChange={handleDataChange} />,
            },
          ]}
        />
      </Card>
      <BarChart
        newDataAlert={newDataAlert}
        turnOffNewDataAlert={() => setNewDataAlert(false)}
      />
    </div>
  );
}

export default App;
