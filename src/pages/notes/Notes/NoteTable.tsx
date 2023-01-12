import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button, Table } from "react-bootstrap";
import { columns, Props } from "./utils";

const NoteTable = ({ notes: data, onDelete }: Props) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onEnd",
    enableColumnResizing: true,
    enableSorting: true,
  });

  return (
    <>
      <Button className="ms-auto mb-3" variant="danger" onClick={() => {
        onDelete && onDelete(table.getSelectedRowModel());
        table.resetRowSelection();
      }}>
        Delete
      </Button>
      <Table
        className="dark overflow-scroll"
        size="sm"
        responsive
        striped
        bordered
        hover
      >
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  className="user-select-none"
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : undefined,
                    width: header.id === "select" ? header.getSize() : undefined,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  } {{
                    asc: <i className="bi bi-caret-up-fill" />,
                    desc: <i className="bi bi-caret-down-fill" />,
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table >
    </>
  );
};

export default NoteTable;
