import { useState } from "react";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button, Table } from "react-bootstrap";
import SimpleConfirmationModal from "../../../components/modal/SimpleConfirmationModal";
import { NoteInfo } from "../../../utils/types";
import { columns } from "./utils";
import { local_storage } from "../../../utils/functions";

type Props = {
  notes: NoteInfo[],
  onDelete?: () => void,
}

const NoteTable = ({
  notes: data,
  onDelete = () => { },
}: Props) => {
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

  const [modal, setModal] = useState(false);

  return (
    <>
      <SimpleConfirmationModal
        title={"Delete note" + (table.getSelectedRowModel()?.rows.length > 1 ? "s" : "")}
        text={(
          table.getSelectedRowModel().rows.length > 1
            ? "This will delete all the selected notes"
            : "This will delete \"" + table.getSelectedRowModel()?.rows[0]?.original?.id + "\""
        ) + " from your saved note"}
        show={modal}
        onHide={() => setModal(false)}
        doDecide={k => {
          if (k) {
            const ns = local_storage.get("notes");
            if (ns) {
              table.getSelectedRowModel().rows.forEach((r, i) => {
                ns.splice(r.index - i, 1);
              });
              local_storage.set("notes", ns);
              table.resetRowSelection();
              onDelete();
            }
          }

          setModal(false);
        }}
        centered
      />
      <Button className="ms-auto mb-3" variant="danger" disabled={!table.getSelectedRowModel().rows.length} onClick={() => setModal(true)}>
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
      </Table>
    </>
  );
};

export default NoteTable;
