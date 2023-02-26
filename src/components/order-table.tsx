import { DownOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table
} from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Search from 'antd/es/input/Search';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import customerClient from '../api/customerClient';
import employeeClient from '../api/employeeClient';
import orderClient from '../api/orderClient';
import { Order } from '../models/order';


function OrderTable() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Order[]>([]);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [formData] = Form.useForm();
  const [deleteOrderNumber, setDeleteOrderNumber] = useState<number | null>(
    null
  );
  const [customerIds, setCustomerIds] = useState<number[]>([]);
  const [employeeNumbers, setEmployeeNumbers] = useState<number[]>([]);
  const [columnsChecklist, setColumnsChecklist] = useState<string[]>([
    'orderNumber',
    'customerId',
    'orderDate',
    'shipDate',
    'employeeNumber',
  ]);
  const columnCheckboxes: { label: string; value: string }[] = [
    { label: 'Order Number', value: 'orderNumber' },
    { label: 'Customer ID', value: 'customerId' },
    { label: 'Order Date', value: 'orderDate' },
    { label: 'Ship Date', value: 'shipDate' },
    { label: 'Employee Number', value: 'employeeNumber' },
  ];

  const columns: ColumnProps<Order>[] = [
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
              handleEditBtnClick(record);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              handleDeleteBtnClick(record.orderNumber);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function reloadData() {
    orderClient
      .getOrders()
      .then((data) => {
        setData(data.map((order, index) => ({ ...order, key: index })));
        return data;
      })
      .then((data) => {
        setIsLoading(false);

        console.groupCollapsed('Order Data');
        console.log(data);
        console.groupEnd();
      });
  }

  useEffect(() => {
    setIsLoading(true);
    orderClient
      .getOrders()
      .then((data) => {
        setData(data.map((order, index) => ({ ...order, key: index })));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  function handleCreateBtnClick(): void {
    setModalMode('create');
    customerClient.getListOfCustomerIds().then((data) => {
      setCustomerIds(data);
    });
    employeeClient.getListOfEmployeeNumbers().then((data) => {
      setEmployeeNumbers(data);
    });

    formData.setFieldsValue({
      customerId: null,
      orderDate: dayjs(),
      shipDate: dayjs(),
      employeeNumber: null,
    });
    setIsFormModalVisible(true);
  }

  function handleEditBtnClick(record: Order) {
    setModalMode('edit');
    customerClient.getListOfCustomerIds().then((data) => {
      setCustomerIds(data);
    });
    employeeClient.getListOfEmployeeNumbers().then((data) => {
      setEmployeeNumbers(data);
    });

    formData.setFieldsValue({
      ...record,
      orderDate: dayjs(record.orderDate),
      shipDate: dayjs(record.shipDate),
    });
    setIsFormModalVisible(true);
  }

  function handleOkFormModal(): void {
    if (modalMode === 'create') {
      setIsLoading(true);
      orderClient
        .createNewOrder({
          ...formData.getFieldsValue(),
          shipDate: formData.getFieldValue('shipDate').toDate(),
          orderDate: formData.getFieldValue('orderDate').toDate(),
        })
        .then(() => {
          setIsFormModalVisible(false);
          reloadData();
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
    if (modalMode === 'edit') {
      setIsLoading(true);
      orderClient
        .updateOrder({
          ...formData.getFieldsValue(),
          shipDate: formData.getFieldValue('shipDate').toDate(),
          orderDate: formData.getFieldValue('orderDate').toDate(),
        })
        .then(() => {
          setIsFormModalVisible(false);
          reloadData();
          setIsLoading(true);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }

  function handleDeleteBtnClick(orderNumber: number) {
    setDeleteOrderNumber(orderNumber);
    setIsDeleteModalVisible(true);
  }

  function handleOkDelete() {
    setIsLoading(true);
    if (deleteOrderNumber === null) return;
    orderClient.deleteOrder(deleteOrderNumber).then(() => {
      setIsDeleteModalVisible(false);
      reloadData();
      setIsLoading(false);
    });
  }

  function executeSearch() {
    if (searchValue === '' || searchValue === undefined) {
      reloadData();
      return;
    }

    setIsLoading(true);
    setData(
      data.filter((cust) => {
        return Object.values(cust).some((value) =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        );
      })
    );
    setIsLoading(false);
  }

  function resetSearch() {
    setSearchValue('');
    reloadData();
  }

  function exportToXlsx(): void {
    if (columnsChecklist.length <= 0) {
      alert('Please select at least one column to export');
      return;
    }

    let headers: string[] = [];
    let rows: any[][] = [];

    // @ts-ignore
    headers = columnsChecklist.map(
      (col) => columns.find((c) => c.key === col)?.title || ''
    );
    // @ts-ignore
    rows = data.map((row) => columnsChecklist.map((col) => row[col]));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, 'customer.xlsx');
  }

  function exportToPdf() {
    if (columnsChecklist.length <= 0) {
      alert('Please select at least one column to export');
      return;
    }

    const headers = columnsChecklist.map(
      // @ts-ignore
      (col) => columns.find((c) => c.key === col).title
    );
    const body = data.map((row) =>
      // @ts-ignore
      columnsChecklist.map((col) => row[col])
    );
    const doc = new jsPDF();
    autoTable(doc, {
      // @ts-ignore
      head: [headers],
      body: body,
    });
    doc.save('customers.pdf');
  }

  function handleColumnsChecklistChange(values: CheckboxValueType[]) {
    setColumnsChecklist(values as string[]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{
            flexBasis: 'fit-content',
          }}
        >
          <Search
            style={{ width: '20em' }}
            allowClear
            enterButton
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={() => executeSearch()}
          />
          <Button type='link' onClick={() => resetSearch()}>
            Reset
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Button type='primary' onClick={() => handleCreateBtnClick()}>
            Create new order
          </Button>
          <Dropdown
            dropdownRender={() => (
              <Card
                bodyStyle={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Checkbox.Group
                  style={{ display: 'flex', flexDirection: 'column' }}
                  value={columnsChecklist}
                  onChange={handleColumnsChecklistChange}
                  options={columnCheckboxes}
                />
              </Card>
            )}
          >
            <Button>
              <Space>
                Select Columns to Export
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                if (key === 'xlsx') {
                  exportToXlsx();
                }
                if (key === 'pdf') {
                  exportToPdf();
                }
              },
              items: [
                {
                  label: 'XLSX',
                  key: 'xlsx',
                },
                {
                  label: 'PDF',
                  key: 'pdf',
                },
              ],
            }}
          >
            <Button type='primary'>
              <Space>
                Export as
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </div>
      <Table loading={isLoading} dataSource={data} columns={columns} />
      {/* CREATE/EDIT MODAL */}
      <Modal
        title={modalMode === 'create' ? 'Create Order' : 'Edit Order'}
        open={isFormModalVisible}
        onOk={handleOkFormModal}
        onCancel={() => setIsFormModalVisible(false)}
      >
        <Form form={formData}>
          {modalMode === 'edit' && (
            <Form.Item label='Order Number' name='orderNumber'>
              <Input disabled />
            </Form.Item>
          )}
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
      </Modal>
      {/* CONFIRM DELETE MODAL */}
      <Modal
        title='Are you sure you want to delete this order?'
        open={isDeleteModalVisible}
        onOk={handleOkDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      ></Modal>
    </div>
  );
}

export default OrderTable;
