import { Employee } from '../models/employee';

class EmployeeClient {
  private EMPLOYEE_DATA: Employee[] = [
    {
      employeeNumber: 1,
      empFirstName: 'John',
      empLastName: 'Doe',
      empStreetAddress: '123 Main St',
      empCity: 'Anytown',
      empState: 'CA',
      empZipcode: '12345',
      empPhoneNumber: '555-1234',
      position: 'Manager',
      hourlyRate: 25,
      dateHired: new Date('2021-01-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 2,
      empFirstName: 'Jane',
      empLastName: 'Doe',
      empStreetAddress: '456 Oak St',
      empCity: 'Anycity',
      empState: 'NY',
      empZipcode: '67890',
      empPhoneNumber: '555-5678',
      position: 'Associate',
      hourlyRate: 15,
      dateHired: new Date('2021-02-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 3,
      empFirstName: 'Bob',
      empLastName: 'Smith',
      empStreetAddress: '789 Elm St',
      empCity: 'Anyvillage',
      empState: 'TX',
      empZipcode: '54321',
      empPhoneNumber: '555-9012',
      position: 'Assistant Manager',
      hourlyRate: 20,
      dateHired: new Date('2021-03-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 4,
      empFirstName: 'Alice',
      empLastName: 'Johnson',
      empStreetAddress: '234 Cedar St',
      empCity: 'Anyhamlet',
      empState: 'FL',
      empZipcode: '09876',
      empPhoneNumber: '555-3456',
      position: 'Associate',
      hourlyRate: 15,
      dateHired: new Date('2021-04-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 5,
      empFirstName: 'Michael',
      empLastName: 'Davis',
      empStreetAddress: '567 Pine St',
      empCity: 'Anytown',
      empState: 'CA',
      empZipcode: '12345',
      empPhoneNumber: '555-7890',
      position: 'Associate',
      hourlyRate: 15,
      dateHired: new Date('2021-05-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 6,
      empFirstName: 'Emily',
      empLastName: 'Wilson',
      empStreetAddress: '890 Maple St',
      empCity: 'Anycity',
      empState: 'NY',
      empZipcode: '67890',
      empPhoneNumber: '555-2345',
      position: 'Assistant Manager',
      hourlyRate: 20,
      dateHired: new Date('2021-06-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 7,
      empFirstName: 'David',
      empLastName: 'Anderson',
      empStreetAddress: '345 Oak St',
      empCity: 'Anyvillage',
      empState: 'TX',
      empZipcode: '54321',
      empPhoneNumber: '555-6789',
      position: 'Associate',
      hourlyRate: 15,
      dateHired: new Date('2021-07-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 8,
      empFirstName: 'Sarah',
      empLastName: 'Clark',
      empStreetAddress: '678 Elm St',
      empCity: 'Anyhamlet',
      empState: 'FL',
      empZipcode: '09876',
      empPhoneNumber: '555-1234',
      position: 'Manager',
      hourlyRate: 25,
      dateHired: new Date('2021-08-01T00:00:00.000Z'),
    },
    {
      employeeNumber: 9,
      empFirstName: 'David',
      empLastName: 'Brown',
      empStreetAddress: '123 Cedar St',
      empCity: 'Anytown',
      empState: 'CA',
      empZipcode: '12345',
      empPhoneNumber: '555-5678',
      position: 'Associate',
      hourlyRate: 15,
      dateHired: new Date('2021-09-01T00:00:00.000Z'),
    },
  ];
  private nextAvailableNumber: number = this.EMPLOYEE_DATA.length + 1;
  private observers: ((params?: any) => any)[] = [];

  constructor() {}

  subscribe(func: (params?: any) => any) {
    this.observers.push(func);
  }

  unsubscribe(func: () => {}) {
    this.observers = this.observers.filter((observer) => observer !== func());
  }

  notifyChangesToSubscribers() {
    this.observers.forEach((observer) => observer());
  }

  async createNewEmployee(newEmployee: Employee): Promise<void> {
    newEmployee.employeeNumber = this.nextAvailableNumber++;
    this.EMPLOYEE_DATA.push(newEmployee);
    this.notifyChangesToSubscribers();
  }

  async getEmployees(): Promise<Employee[]> {
    const employees = this.EMPLOYEE_DATA;
    return employees;
  }

  async getListOfEmployeeNumbers(): Promise<number[]> {
    const employeeNumbers = this.EMPLOYEE_DATA.map(
      (employee) => employee.employeeNumber
    );
    return employeeNumbers;
  }

  async updateEmployee(updatedEmp: Employee): Promise<void> {
    this.EMPLOYEE_DATA = this.EMPLOYEE_DATA.map((emp) =>
      emp.employeeNumber === updatedEmp.employeeNumber ? updatedEmp : emp
    );
    this.notifyChangesToSubscribers();
  }

  async deleteEmployee(employeeNumber: number): Promise<void> {
    this.EMPLOYEE_DATA = this.EMPLOYEE_DATA.filter(
      (employee) => employee.employeeNumber !== employeeNumber
    );
    this.notifyChangesToSubscribers();
  }
}

const employeeClient = new EmployeeClient();
export default employeeClient;
