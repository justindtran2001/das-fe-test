export type Employee = {
    key?: number, // for Ant Design table compatibility
    employeeNumber: number,
    empFirstName: string,
    empLastName: string,
    empStreetAddress: string,
    empCity: string,
    empState: string,
    empZipcode: string,
    empPhoneNumber: string,
    position: string,
    hourlyRate: number,
    dateHired: Date
}