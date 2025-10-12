import type { RewardSchema, RewardsResponseSchema } from "@/data/rewards-data";
import { flexRender, getCoreRowModel, useReactTable, type Column, type ColumnDef, type ColumnFiltersState, type OnChangeFn, type PaginationState, type SortingState } from "@tanstack/react-table";
import React from "react";
import { Pagination } from "./PaginationComponent";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface IRewardsTableProps {
    columns: ColumnDef<RewardSchema, any>[];
    paginatedRewards: RewardsResponseSchema;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
}
export function RewardsTable({
    columns, paginatedRewards,
    pagination, onPaginationChange,
    sorting, onSortingChange,
    columnFilters, onColumnFiltersChange,
}: IRewardsTableProps) {

    const table = useReactTable({
        data: paginatedRewards.Items,
        columns,
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        rowCount: paginatedRewards.TotalCount,
        state: { pagination, sorting, columnFilters },
        onPaginationChange,
        onSortingChange,
        onColumnFiltersChange,
        getCoreRowModel: getCoreRowModel(),
    });

    return <section className='flex justify-center flex-col'>
        <Table className='w-full text-sm'>
            <TableCaption>All rewards list.</TableCaption>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => {
                    return <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return <TableHead key={header.id} className='bg-black text-gray-100 p-3 align-top'>
                                {header.isPlaceholder ? null : (
                                    <>
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none hover:text-yellow-400 transition-colors'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                            <div className='mt-2'>
                                                <Filter column={header.column} />
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </TableHead>
                        })}
                    </TableRow>
                })}
            </TableHeader>
            <TableBody className='divide-y '>
                {table.getRowModel().rows.map((row) => {
                    return (
                        <TableRow
                            key={row.id}
                            className='hover:bg-yellow-100 transition-colors'
                        >
                            {row.getVisibleCells().map((cell) => {
                                return (
                                    <TableCell key={cell.id} className='px-4 py-3' /* style={{ width: cell.column.getSize() }} */>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
        <div className='w-full h-full'>
            <Pagination table={table}></Pagination>
        </div>
    </section>
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue();

    return (
        <DebouncedInput
            type='text'
            value={(columnFilterValue ?? '') as string}
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search...`}
            className='w-full px-2 py-1 bg-yellow-100 text-black rounded-md border border-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none'
        />
    );
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
