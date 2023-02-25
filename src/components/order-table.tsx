import {
    Button,
    DatePicker,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
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

  const columns: ColumnProps<Order>[] = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      sorter: (a: Order, b: Order) => a.orderNumber - b.orderNumber,
    },
    {
      title: 'Order ID',
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          name='search-bar'
          style={{ width: '15em' }}
          placeholder='search'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button type='primary' onClick={() => handleCreateBtnClick()}>
          Create new order
        </Button>
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
