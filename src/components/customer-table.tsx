import { Button, Form, Input, Modal, Space, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import customerClient from '../api/customerClient';
import { Customer } from '../models/customer';

function CustomerTable() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [formData] = Form.useForm();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns: ColumnProps<Customer>[] = [
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
          <Button type='primary' onClick={() => handleEditBtnClick(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDeleteBtnClick(record.customerId)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function reloadData() {
    customerClient
      .getCustomers()
      .then((data) => {
        setData(data.map((cust, index) => ({ ...cust, key: index })));
        return data;
      })
      .then((data) => {
        setIsLoading(false);

        console.groupCollapsed('Customer Data');
        console.log(data);
        console.groupEnd();
      });
  }

  useEffect(() => {
    setIsLoading(true);
    customerClient
      .getCustomers()
      .then((data) => {
        setData(data.map((cust, index) => ({ ...cust, key: index })));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  function handleCreateBtnClick(): void {
    setModalMode('create');
    formData.setFieldsValue({
      customerId: '',
      custFirstName: '',
      custLastName: '',
      custCity: '',
      custState: '',
      custZipcode: '',
      custPhone: '',
      custEmailAddress: '',
    });
    setIsFormModalVisible(true);
  }

  function handleEditBtnClick(record: Customer) {
    setModalMode('edit');
    formData.setFieldsValue(record);
    setIsFormModalVisible(true);
  }

  function handleOkFormModal(): void {
    if (modalMode === 'create') {
      setIsLoading(true);
      customerClient
        .createNewCustomer(formData.getFieldsValue())
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
      customerClient
        .updateCustomer(formData.getFieldsValue())
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

  function handleDeleteBtnClick(customerId: number) {
    setDeleteId(customerId);
    setIsDeleteModalVisible(true);
  }

  function handleOkDelete() {
    setIsLoading(true);
    if (deleteId === null) return;
    customerClient.deleteCustomer(deleteId).then(() => {
      setIsLoading(false);
      setIsDeleteModalVisible(false);
      reloadData();
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
          Create new customer
        </Button>
      </div>
      <Table loading={isLoading} dataSource={data} columns={columns} />
      {/* CREATE/EDIT MODAL */}
      <Modal
        title={modalMode === 'create' ? 'Create Customer' : 'Edit Customer'}
        open={isFormModalVisible}
        onOk={handleOkFormModal}
        onCancel={() => setIsFormModalVisible(false)}
      >
        <Form form={formData}>
          {modalMode === 'edit' && (
            <Form.Item label='Customer ID' name='customerId'>
              <Input disabled />
            </Form.Item>
          )}
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
      </Modal>
      {/* CONFIRM DELETE MODAL */}
      <Modal
        title='Are you sure you want to delete this customer?'
        open={isDeleteModalVisible}
        onOk={handleOkDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      ></Modal>
    </div>
  );
}

export default CustomerTable;
