import { ColumnDef, RowModel } from "@tanstack/react-table";
import { FormCheck } from "react-bootstrap";
import { into_readable_datetime } from "../../../utils/functions";
import { NoteInfo } from "../../../utils/types";

export type Props = {
    notes: NoteInfo[],
    onDelete?: (notes: RowModel<NoteInfo>) => void
}

export const columns: ColumnDef<NoteInfo>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <FormCheck
                checked={table.getIsAllRowsSelected()}
                ref={(ref: HTMLInputElement | null) => {
                    if (ref) {
                        ref.indeterminate = table.getIsSomeRowsSelected();
                    }

                    return ref;
                }}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <FormCheck
                checked={row.getIsSelected()}
                ref={(ref: HTMLInputElement | null) => {
                    if (ref) {
                        ref.indeterminate = row.getIsSomeSelected();
                    }

                    return ref;
                }}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
        size: 0,
    },
    {
        header: "Identifier",
        footer: props => props.column.id,
        columns: [
            {
                accessorKey: "id",
                header: "ID",
                cell: data => data.getValue(),
                footer: props => props.column.id,
            },
            {
                sortDescFirst: false,
                invertSorting: true,
                accessorKey: "title",
                header: "Title",
                cell: data => data.getValue(),
                footer: props => props.column.id,
            },
        ],
    },
    {
        header: "Time",
        footer: props => props.column.id,
        columns: [
            {
                sortDescFirst: false,
                invertSorting: true,
                accessorKey: "created_at",
                header: "Created at",
                accessorFn: r => r.created_at.secs_since_epoch,
                cell: data => into_readable_datetime(data.getValue()),
                footer: props => props.column.id,
            },
            {
                sortDescFirst: false,
                invertSorting: true,
                accessorKey: "expires_at",
                header: "Expiration",
                accessorFn: r => r.expires_at?.secs_since_epoch,
                cell: data => data.getValue() ? into_readable_datetime(data.getValue()) : "Never",
                footer: props => props.column.id,
            },
        ],
    },
];
