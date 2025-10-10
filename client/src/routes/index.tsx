import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RewardSchema, RewardsSearchParams } from '@/data/rewards-data';
import { rankItem } from '@tanstack/match-sorter-utils';
import { createFileRoute } from '@tanstack/react-router';
import { flexRender, getCoreRowModel, useReactTable, type Column, type ColumnDef, type FilterFn, type Table as TanstackTable } from '@tanstack/react-table';
import React from 'react';

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const Route = createFileRoute('/')({
  validateSearch: RewardsSearchParams,
  loaderDeps: (opts) => opts.search,
  loader: ({ context: { fetchRewards }, deps: search }) => fetchRewards(search),
  component: App,
});

function App() {
  const data = Route.useLoaderData();

  const columns = React.useMemo<ColumnDef<RewardSchema, any>[]>(
    () => [
      {
        accessorKey: 'Name',
        cell: (info) => info.getValue(),
        filterFn: 'includesString',
        enableColumnFilter: true,
        enableSorting: false,
      },
      {
        accessorKey: 'Description',
        cell: ({ row }) => {
          return <div className='text-wrap max-h-40 overflow-y-auto'>{row.original.Description}</div>
        },
        filterFn: 'includesString',
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: 'Price',
        cell: (info) => info.getValue(),
        filterFn: 'includesString',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        accessorKey: 'Category',
        cell: (info) => info.getValue(),
        filterFn: 'includesString',
        enableColumnFilter: true,
        enableSorting: false,
      },
      {
        accessorKey: 'Image',
        cell: ({ row }) => {
          return <img src={row.original.ImageUrl} alt={`${row.original.Name} image`} />
        },
        filterFn: 'includesString',
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data.Items,
    columns,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter
    },
  });

  return (
    <div className='text-center'>
      <header className='flex flex-row justify-around bg-[#c18817] text-white text-[calc(10px+2vmin)]'>
        <h1>Rewards List</h1>
      </header>
      <main>
        <section className='flex justify-center flex-col'>
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
                    className='hover:bg-yellow-200 transition-colors'
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id} className='px-4 py-3' style={{ width: cell.column.getSize() }}>
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
      </main>
    </div>
  );
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

function Pagination({ table }: { table: TanstackTable<RewardSchema> }) {
  return <div className="flex flex-wrap items-center gap-2 text-gray-200 bg-black w-full p-3">
    <button
      type="button"
      className="px-3 py-1 bg-yellow-800 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => table.setPageIndex(0)}
      disabled={!table.getCanPreviousPage()}
    >
      {'<<'}
    </button>
    <button
      type="button"
      className="px-3 py-1 bg-yellow-800 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      {'<'}
    </button>
    <button
      type="button"
      className="px-3 py-1 bg-yellow-800 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      {'>'}
    </button>
    <button
      type="button"
      className="px-3 py-1 bg-yellow-800 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
      disabled={!table.getCanNextPage()}
    >
      {'>>'}
    </button>
    <span className="flex items-center gap-1">
      <div>Page</div>
      <strong>
        {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </strong>
    </span>
    <span className="flex items-center gap-1">
      | Go to page:
      <input
        type="number"
        defaultValue={table.getState().pagination.pageIndex + 1}
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          table.setPageIndex(page);
        }}
        className="w-16 px-2 py-1 bg-yellow-800 rounded-md border border-yellow-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </span>
    <select
      value={table.getState().pagination.pageSize}
      onChange={(e) => {
        table.setPageSize(Number(e.target.value));
      }}
      className="px-2 py-1 bg-yellow-800 rounded-md border border-yellow-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
    >
      {[5, 10, 20, 30, 40, 50, 100].map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
    </select>
  </div>
}
