import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Space,
    Table
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import employeeClient from '../api/employeeClient';
import { Employee } from '../models/employee';

function EmployeeTable() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Employee[]>([]);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [formData] = Form.useForm();
  const [deleteEmpNumber, setDeleteEmpNumber] = useState<number | null>(null);

  const columns: ColumnProps<Employee>[] = [
    {
      title: 'Employee Number',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      sorter: (a: Employee, b: Employee) => a.employeeNumber - b.employeeNumber,
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
      sorter: (a: Employee, b: Employee) => a.empCity.localeCompare(b.empCity),
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
              handleEditBtnClick(record);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              handleDeleteBtnClick(record.employeeNumber);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function reloadData() {
    employeeClient
      .getEmployees()
      .then((data) => {
        setData(data.map((emp, index) => ({ ...emp, key: index })));
        return data;
      })
      .then((data) => {
        setIsLoading(false);

        console.groupCollapsed('Employee Data');
        console.log(data);
        console.groupEnd();
      });
  }

  useEffect(() => {
    setIsLoading(true);
    employeeClient
      .getEmployees()
      .then((data) => {
        setData(data.map((emp, index) => ({ ...emp, key: index })));
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
      empFirstName: '',
      empLastName: '',
      empStreetAddress: '',
      empCity: '',
      empState: '',
      empZipcode: '',
      empPhoneNumber: '',
      position: '',
      hourlyRate: 0,
      dateHired: dayjs(),
    });
    setIsFormModalVisible(true);
  }

  function handleEditBtnClick(record: Employee) {
    setModalMode('edit');
    formData.setFieldsValue({
      ...record,
      dateHired: dayjs(record.dateHired),
    });
    setIsFormModalVisible(true);
  }

  function handleOkFormModal(): void {
    if (modalMode === 'create') {
      setIsLoading(true);
      employeeClient
        .createNewEmployee({
          ...formData.getFieldsValue(),
          dateHired: formData.getFieldValue('dateHired').toDate(),
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
      employeeClient
        .updateEmployee({
          ...formData.getFieldsValue(),
          dateHired: formData.getFieldValue('dateHired').toDate(),
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

  function handleDeleteBtnClick(employeeNumber: number) {
    setDeleteEmpNumber(employeeNumber);
    setIsDeleteModalVisible(true);
  }

  function handleOkDelete() {
    setIsLoading(true);
    if (deleteEmpNumber === null) return;
    employeeClient.deleteEmployee(deleteEmpNumber).then(() => {
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
          Create new Employee
        </Button>
      </div>
      <Table loading={isLoading} dataSource={data} columns={columns} />
      {/* CREATE/EDIT MODAL */}
      <Modal
        title={modalMode === 'create' ? 'Create Employee' : 'Edit Employee'}
        open={isFormModalVisible}
        onOk={handleOkFormModal}
        onCancel={() => setIsFormModalVisible(false)}
      >
        <Form form={formData}>
          {modalMode === 'edit' && (
            <Form.Item label='Employee Number' name='employeeNumber'>
              <Input disabled />
            </Form.Item>
          )}
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
      </Modal>
      {/* CONFIRM DELETE MODAL */}
      <Modal
        title='Are you sure you want to delete this employee?'
        open={isDeleteModalVisible}
        onOk={handleOkDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      ></Modal>
    </div>
  );
}

export default EmployeeTable;
