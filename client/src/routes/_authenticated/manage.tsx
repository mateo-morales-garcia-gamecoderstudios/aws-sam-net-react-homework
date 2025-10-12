import { RewardsTable } from '@/components/RewardsTableComponent';
import { RewardSchema, RewardsSearchParams } from '@/data/rewards-data';
import { useRewardsColumnFilters, useRewardsPagination, useRewardsSorting } from '@/hooks/rewards-table';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { DeleteIcon } from 'lucide-react';
import React from 'react';

export const Route = createFileRoute('/_authenticated/manage')({
  validateSearch: RewardsSearchParams,
  loaderDeps: (opts) => opts.search,
  loader: ({ context: { fetchRewards }, deps: search }) => fetchRewards(search),
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  const columns = React.useMemo<ColumnDef<RewardSchema, any>[]>(
    () => [
      {
        id: 'delete', // todo: add delete button to table
        header: '',
        cell: ({ row }) => {
          return <DeleteIcon className="size-4" />
        },
        filterFn: 'includesString',
        enableColumnFilter: true,
        enableSorting: false,
      },
      {
        // todo maybe add a form to update the field, or add an update button for the rows
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

  const navigate = useNavigate({ from: Route.fullPath });

  const { pagination, onPaginationChange } = useRewardsPagination({ navigate, page: data });
  const { sorting, onSortingChange } = useRewardsSorting({ navigate, search });
  const { columnFilters, onColumnFiltersChange } = useRewardsColumnFilters({ navigate });

  return (
    <div className='text-center'>
      <header className='flex flex-row justify-around bg-[#c15517] text-white text-[calc(10px+2vmin)] animate-pulse'>
        <h1>Manage Rewards List</h1>
      </header>
      <main>
        <RewardsTable
          columns={columns}
          paginatedRewards={data}
          pagination={pagination} onPaginationChange={onPaginationChange}
          sorting={sorting} onSortingChange={onSortingChange}
          columnFilters={columnFilters} onColumnFiltersChange={onColumnFiltersChange}
        />
      </main>
    </div>
  );
}