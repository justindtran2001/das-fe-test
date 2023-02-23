import "./data-table.css"
import { useState } from "react";

export type DataTableColumn<T> = {
  field: keyof T;
  label: string;
};

type Props<T> = {
  data: T[],
  columns: DataTableColumn<T>[]
}

function DataTable<T extends object>({ data, columns }: Props<T>) {
  const [dataRows, setDataRows] = useState<T[]>([]);

  return (
    <table>
      <thead>
        <tr>
          {columns.map(({ field, label }) => (
            <th key={field as string}>
              {label}
              <span className="material-symbols-outlined icon-arrow">
                arrow_drop_down
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataRows.map((row, index) => (
          <tr key={index}>
            {columns.map(({ field }) => (
              <td key={field as string}>
                {row.hasOwnProperty(field) ? row[field as keyof T] : ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table >
  )
}

export default DataTable