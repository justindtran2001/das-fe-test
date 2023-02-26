import { DownOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Form,
  Input,
  Modal,
  Space,
  Table
} from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Search from 'antd/es/input/Search';
import { ColumnProps } from 'antd/es/table';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import customerClient from '../api/customerClient';
import { Customer } from '../models/customer';

interface PropsType {
  onDataChange?: () => void;
}

function CustomerTable({ onDataChange }: PropsType) {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [formData] = Form.useForm();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [columnsChecklist, setColumnsChecklist] = useState<string[]>([
    'customerId',
    'custFirstName',
    'custLastName',
    'custCity',
    'custState',
    'custZipcode',
    'custPhone',
    'custEmailAddress',
  ]);
  const columnCheckboxes: { label: string; value: string }[] = [
    { label: 'Customer ID', value: 'customerId' },
    { label: 'Customer First Name', value: 'custFirstName' },
    { label: 'Customer Last Name', value: 'custLastName' },
    { label: 'Customer City', value: 'custCity' },
    { label: 'Customer State', value: 'custState' },
    { label: 'Customer Zipcode', value: 'custZipcode' },
    { label: 'Customer Phone', value: 'custPhone' },
    { label: 'Customer Email address', value: 'custEmailAddress' },
  ];

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
            Create new customer
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
