import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tabs,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import customerClient from './api/customerClient';
import employeeClient from './api/employeeClient';
import orderClient from './api/orderClient';
import { Customer } from './models/customer';
import { Employee } from './models/employee';
import { Order } from './models/order';

enum DATA_ENTITIES {
  CUSTOMER,
  ORDER,
  EMPLOYEE,
}

function App() {
  // antd table states
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [tableData, setTableData] = useState<Customer[] | Order[] | Employee[]>(
    []
  );
  const [tableColumns, setTableColumns] = useState<
    ColumnsType<Customer> | ColumnsType<Order> | ColumnsType<Employee>
  >([]);

  // Current data entity being displayed
  const [currentDataEntity, setCurrentDataEntity] =
    useState<DATA_ENTITIES | null>(null);

  // Form states
  const [searchValue, setSearchValue] = useState('');
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [confirmDeleteIdNumber, setConfirmDeleteIdNumber] = useState<number>(0);
  const [customerIds, setCustomerIds] = useState<number[]>([]);
  const [employeeNumbers, setEmployeeNumbers] = useState<number[]>([]);
  const [dataCreateForm] = Form.useForm();
  const [dataUpdateForm] = Form.useForm();

  useEffect(() => {
    setCurrentDataEntity(DATA_ENTITIES.CUSTOMER);
  }, []);

  useEffect(() => {
    reloadTableData();
  }, [currentDataEntity]);

  const handleTabChange = (activeKey: string) => {
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

  /**
   * DATA OPERATIONS
   */
  const reloadTableData = () => {
    switch (currentDataEntity) {
      case DATA_ENTITIES.CUSTOMER:
        console.log('Reload customer data');
        customerClient
          .getCustomers()
          .then((data) => {
            setTableData(data.map((cust, index) => ({ ...cust, key: index })));
            setTableColumns(TableColumns.CUSTOMER);
            return data;
          })
          .then((data) => {
            setIsLoadingData(false);

            console.groupCollapsed('Customer Data');
            console.log(data);
            console.groupEnd();
          });
        break;
      case DATA_ENTITIES.ORDER:
        console.log('Reload order data');
        orderClient
          .getOrders()
          .then((data) => {
            setTableData(
              data.map((order, index) => ({ ...order, key: index }))
            );
            setTableColumns(TableColumns.ORDER);
            return data;
          })
          .then((data) => {
            setIsLoadingData(false);

            console.groupCollapsed('Order Data');
            console.log(data);
            console.groupEnd();
          });

        break;
      case DATA_ENTITIES.EMPLOYEE:
        console.log('Reload employee data');
        employeeClient
          .getEmployees()
          .then((data) => {
            setTableData(data.map((emp, index) => ({ ...emp, key: index })));
            setTableColumns(TableColumns.EMPLOYEE);
            return data;
          })
          .then((data) => {
            setIsLoadingData(false);

            console.groupCollapsed('Employee Data');
            console.log(data);
            console.groupEnd();
          });

        break;
      default:
        break;
    }
  };

  const deleteRowWithIdNumber = (idNumber: number) => {
    switch (currentDataEntity) {
      case DATA_ENTITIES.CUSTOMER:
        setIsLoadingData(true);
        console.log('Delete customer with id: ', idNumber);
        customerClient.deleteCustomer(idNumber).then(() => {
          reloadTableData();
          setIsLoadingData(false);
        });
        break;
      case DATA_ENTITIES.ORDER:
        console.log('Delete order with id: ', idNumber);
        orderClient.deleteOrder(idNumber).then(() => {
          reloadTableData();
          setIsLoadingData(false);
        });
        break;
      case DATA_ENTITIES.EMPLOYEE:
        console.log('Delete employee with id: ', idNumber);
        employeeClient.deleteEmployee(idNumber).then(() => {
          reloadTableData();
          setIsLoadingData(false);
        });
        break;
      default:
        break;
    }
  };

  const getAllCustomerIds = () => {
    customerClient.getListOfCustomerIds().then((data) => setCustomerIds(data));
  };

  const getAllEmployeeNumbers = () => {
    employeeClient
      .getListOfEmployeeNumbers()
      .then((data) => setEmployeeNumbers(data));
  };

  /**
   * Handlers for the CREATE modal
   */
  const openCreateNewModal = (): void => {
    switch (currentDataEntity) {
      case DATA_ENTITIES.CUSTOMER:
        dataCreateForm.setFieldsValue({
          custFirstName: '',
          custLastName: '',
          custCity: '',
          custState: '',
          custZipcode: '',
          custPhone: '',
          custEmailAddress: '',
        });
        break;

      case DATA_ENTITIES.ORDER:
        getAllCustomerIds();
        getAllEmployeeNumbers();
        dataCreateForm.setFieldsValue({
          orderDate: dayjs(),
          shipDate: dayjs(),
          customerId: undefined,
          employeeNumber: undefined,
        });
        break;

      case DATA_ENTITIES.EMPLOYEE:
        dataCreateForm.setFieldsValue({
          empFirstName: '',
          empLastName: '',
          empStreetAddress: '',
          empCity: '',
          empState: '',
          empZipcode: '',
          empPhoneNumber: '',
          position: '',
          hourlyRate: undefined,
          dateHired: dayjs(),
        });
        break;

      default:
        break;
    }
    setCreateModalIsOpen(true);
  };

  const handleCreateNew = () => {
    dataCreateForm
      .validateFields()
      .then((values) => {
        setIsLoadingData(true);

        console.log('Received values of create-form: ', values);

        switch (currentDataEntity) {
          case DATA_ENTITIES.CUSTOMER:
            customerClient.createNewCustomer(values).then(() => {
              reloadTableData();
              setIsLoadingData(false);
            });
            break;
          case DATA_ENTITIES.ORDER:
            let order: Order = {
              ...values,
              orderDate: dayjs(values.orderDate).toDate(),
              shipDate: dayjs(values.shipDate).toDate(),
            };

            orderClient.createNewOrder(order).then(() => {
              reloadTableData();
              setIsLoadingData(false);
            });
            break;
          case DATA_ENTITIES.EMPLOYEE:
            let employee: Employee = {
              ...values,
              dateHired: dayjs(values.dateHired).toDate(),
            };

            employeeClient.createNewEmployee(employee).then(() => {
              reloadTableData();
              setIsLoadingData(false);
            });
            break;
          default:
            break;
        }
      })
      .then(() => {
        setCreateModalIsOpen(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);

        setIsLoadingData(false);
      });
  };

  const handleDiscardCreateNew = (): void => {
    setCreateModalIsOpen(false);
  };

  /**
   * Handlers for the EDIT modal
   */
  const openEditModal = (
    type: DATA_ENTITIES,
    record: Customer | Order | Employee
  ) => {
    dataUpdateForm.resetFields();
    if (type === DATA_ENTITIES.ORDER) {
      dataUpdateForm.setFieldsValue({
        ...record,
        orderDate: dayjs((record as Order).orderDate),
        shipDate: dayjs((record as Order).shipDate),
      });
    } else {
      dataUpdateForm.setFieldsValue(record);
    }
    setEditModalIsOpen(true);
  };

  const handleConfirmEdit = () => {
    dataUpdateForm
      .validateFields()
      .then((values) => {
        setIsLoadingData(true);

        console.log('Received values of edit-form: ', values);

        if (currentDataEntity === DATA_ENTITIES.CUSTOMER) {
          customerClient.updateCustomer(values as Customer).then(() => {
            setEditModalIsOpen(false);
            reloadTableData();
            setIsLoadingData(true);
          });
        } else if (currentDataEntity === DATA_ENTITIES.ORDER) {
          let order: Order = {
            ...values,
            orderDate: dayjs(values.orderDate).toDate(),
            shipDate: dayjs(values.shipDate).toDate(),
          };

          orderClient.updateOrder(order).then(() => {
            setEditModalIsOpen(false);
            reloadTableData();
            setIsLoadingData(true);
          });
        } else if (currentDataEntity === DATA_ENTITIES.EMPLOYEE) {
          employeeClient.updateEmployee(values as Employee).then(() => {
            setEditModalIsOpen(false);
            reloadTableData();
            setIsLoadingData(true);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDiscardEdit = () => {
    dataUpdateForm.resetFields();
    setEditModalIsOpen(false);
  };

  /**
   * Handlers for the DELETE modal
   */
  const openDeleteModal = (idNumber: number): void => {
    setConfirmDeleteIdNumber(idNumber);
    setDeleteModalIsOpen(true);
  };

  const handleConfirmDelete = (): void => {
    deleteRowWithIdNumber(confirmDeleteIdNumber);
    setDeleteModalIsOpen(false);
  };

  const handleCancelDelete = (): void => {
    setDeleteModalIsOpen(false);
  };

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
        render: (_, record) => (
          <Space size='middle'>
            <Button
              type='primary'
              onClick={() => {
                openEditModal(DATA_ENTITIES.CUSTOMER, record);
              }}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => {
                openDeleteModal(record.customerId);
              }}
            >
              Delete
            </Button>
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
        render: (_, record) => record.shipDate.toDateString(),
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
        render: (_, record) => (
          <Space size='middle'>
            <Button
              type='primary'
              onClick={() => {
                openEditModal(DATA_ENTITIES.ORDER, record);
              }}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => {
                openDeleteModal(record.orderNumber);
              }}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    EMPLOYEE: [
      {
        title: 'Employee Number',
        dataIndex: 'employeeNumber',
        key: 'employeeNumber',
        sorter: (a: Employee, b: Employee) =>
          a.employeeNumber - b.employeeNumber,
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
        sorter: (a: Employee, b: Employee) =>
          a.empCity.localeCompare(b.empCity),
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
        title: 'Employee Phone',
        dataIndex: 'empPhoneNumber',
        key: 'empPhoneNumber',
        sorter: (a: Employee, b: Employee) =>
          a.empPhoneNumber.localeCompare(b.empPhoneNumber),
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        sorter: (a: Employee, b: Employee) =>
          a.position.localeCompare(b.position),
      },
      {
        title: 'Hourly Rate',
        dataIndex: 'hourlyRate',
        key: 'hourlyRate',
        sorter: (a: Employee, b: Employee) => a.hourlyRate - b.hourlyRate,
      },
      {
        title: 'Date Hired',
        dataIndex: 'dateHired',
        key: 'dateHired',
        sorter: (a: Employee, b: Employee) =>
          a.dateHired.getTime() - b.dateHired.getTime(),
        render: (_, record) => record.dateHired.toDateString(),
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size='middle'>
            <Button
              type='primary'
              onClick={() => {
                openEditModal(DATA_ENTITIES.EMPLOYEE, record);
              }}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => {
                openDeleteModal(record.employeeNumber);
              }}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
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
                className='data-table-container'
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Input
                    name='search-bar'
                    style={{ width: '15em' }}
                    placeholder='search'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button type='primary' onClick={() => openCreateNewModal()}>
                    Create new customer
                  </Button>
                </div>
                <Table
                  loading={isLoadingData}
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
              <div
                className='data-table-container'
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Input
                    name='search-bar'
                    style={{ width: '15em' }}
                    placeholder='search'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button type='primary' onClick={() => openCreateNewModal()}>
                    Create new order
                  </Button>
                </div>
                <Table
                  loading={isLoadingData}
                  dataSource={tableData as Order[]}
                  columns={tableColumns as ColumnsType<Order>}
                />
              </div>
            ),
          },
          {
            key: '3',
            label: `Employee`,
            children: (
              <div
                className='data-table-container'
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Input
                    name='search-bar'
                    style={{ width: '15em' }}
                    placeholder='search'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button type='primary' onClick={() => openCreateNewModal()}>
                    Create new employee
                  </Button>
                </div>
                <Table
                  loading={isLoadingData}
                  dataSource={tableData as Employee[]}
                  columns={tableColumns as ColumnsType<Employee>}
                />
              </div>
            ),
          },
        ]}
        onChange={handleTabChange}
      />
      {/* CREATE MODAL */}
      <Modal
        title={`Create a new ${
          currentDataEntity === DATA_ENTITIES.CUSTOMER
            ? 'Customer'
            : currentDataEntity === DATA_ENTITIES.ORDER
            ? 'Order'
            : 'Employee'
        }`}
        open={createModalIsOpen}
        onOk={handleCreateNew}
        onCancel={handleDiscardCreateNew}
      >
        {currentDataEntity === DATA_ENTITIES.CUSTOMER ? (
          <Form form={dataCreateForm}>
            <Form.Item label='Customer First Name' name='custFirstName'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Last Name' name='custLastName'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer City' name='custCity'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer State' name='custState'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Zipcode' name='custZipcode'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Phone' name='custPhone'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Email Address' name='custEmailAddress'>
              <Input />
            </Form.Item>
          </Form>
        ) : currentDataEntity === DATA_ENTITIES.ORDER ? (
          <Form form={dataCreateForm}>
            <Form.Item label='Customer ID' name='customerId'>
              <Select>
                {customerIds.map((id, index) => (
                  <Select.Option key={index} value={id}>
                    {id}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label='Order Date' name='orderDate'>
              <DatePicker />
            </Form.Item>
            <Form.Item label='Ship Date' name='shipDate'>
              <DatePicker />
            </Form.Item>
            <Form.Item label='Employee Number' name='employeeNumber'>
              <Select>
                {employeeNumbers.map((empNum, index) => (
                  <Select.Option key={index} value={empNum}>
                    {empNum}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        ) : (
          <Form form={dataCreateForm}>
            <Form.Item label='Employee First Name' name='empFirstName'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee Last Name' name='empLastName'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee Street Address' name='empStreetAddress'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee City' name='empCity'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee State' name='empState'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee Zipcode' name='empZipcode'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee Phone Number' name='empPhoneNumber'>
              <Input />
            </Form.Item>
            <Form.Item label='Position' name='position'>
              <Input />
            </Form.Item>
            <Form.Item label='Hourly Rate' name='hourlyRate'>
              <InputNumber />
            </Form.Item>
            <Form.Item label='Date Hired' name='dateHired'>
              <DatePicker />
            </Form.Item>
          </Form>
        )}
      </Modal>
      {/* EDIT MODAL */}
      <Modal
        title={
          currentDataEntity === DATA_ENTITIES.CUSTOMER
            ? 'Edit Customer'
            : currentDataEntity === DATA_ENTITIES.ORDER
            ? 'Edit Order'
            : 'Edit Employee'
        }
        open={editModalIsOpen}
        onOk={handleConfirmEdit}
        onCancel={handleDiscardEdit}
      >
        {currentDataEntity === DATA_ENTITIES.CUSTOMER ? (
          <Form form={dataUpdateForm}>
            <Form.Item label='Customer ID' name='customerId'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Customer First Name' name='custFirstName'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Last Name' name='custLastName'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer City' name='custCity'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer State' name='custState'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Zipcode' name='custZipcode'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Phone' name='custPhone'>
              <Input />
            </Form.Item>
            <Form.Item label='Customer Email Address' name='custEmailAddress'>
              <Input />
            </Form.Item>
          </Form>
        ) : currentDataEntity === DATA_ENTITIES.ORDER ? (
          <Form form={dataUpdateForm}>
            <Form.Item label='Order Number' name='orderNumber'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Order Customer ID' name='customerId'>
              <Input />
            </Form.Item>
            <Form.Item
              label='Order Date'
              name='orderDate'
              rules={[{ type: 'date' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label='Ship Date'
              name='shipDate'
              rules={[{ type: 'date' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item label='Order Employee ID' name='employeeNumber'>
              <Input />
            </Form.Item>
          </Form>
        ) : (
          // EMPLOYEE
          <Form form={dataUpdateForm}>
            <Form.Item label='Employee Number' name='employeeNumber'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Employee First Name' name='empFirstName'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee Last Name' name='empLastName'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee Street Address' name='empStreetAddress'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee City' name='empCity'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee State' name='empState'>
              <Input />
            </Form.Item>
            <Form.Item label='Employee Zipcode' name='empZipcode'>
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
      {/* CONFIRM DELETE MODAL */}
      <Modal
        title={`Are you sure you want to delete this ${
          currentDataEntity === DATA_ENTITIES.CUSTOMER
            ? 'Customer'
            : currentDataEntity === DATA_ENTITIES.ORDER
            ? 'Order'
            : 'Employee'
        }`}
        open={deleteModalIsOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      ></Modal>
    </div>
  );
}

export default App;
