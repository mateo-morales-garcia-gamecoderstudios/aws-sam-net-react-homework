import { CreateDialog, useCreateDialog } from '@/components/CreateDialog';
import { DeleteDialog, useDeleteDialog } from '@/components/DeleteDialog';
import { RewardsTable } from '@/components/RewardsTableComponent';
import { UpdateDialog, useUpdateDialog } from '@/components/UpdateDialog';
import { RewardSchema, RewardsSearchParams } from '@/data/rewards-data';
import { useRewardsColumnFilters, useRewardsPagination, useRewardsSorting } from '@/hooks/rewards-table';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
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
  const navigate = useNavigate({ from: Route.fullPath });

  const deleteDialog = useDeleteDialog({ navigate });
  const updateDialog = useUpdateDialog({ navigate });
  const createDialog = useCreateDialog({ navigate });

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
      {
        id: 'manage-buttons',
        cell: ({ row }) => {
          return <div className='flex justify-evenly w-20 h-8'>
            <PencilIcon className="size-8 rounded-md p-1 bg-blue-400 text-yellow-50 hover:bg-blue-500 transition-colors"
              onClick={() => updateDialog.openUpdateDialog(row.original)} />
            <Trash2Icon className="size-8 rounded-md p-1 bg-red-400 text-yellow-50 hover:bg-red-500 transition-colors"
              onClick={() => deleteDialog.openDeleteDialog(row.original.Id)} />
          </div>
        },
        header: () => (<div className='flex justify-center'>
          <PlusIcon className="size-8 rounded-md p-1 bg-green-400 text-yellow-50 hover:bg-green-500 transition-colors"
            onClick={() => createDialog.openUpdateDialog()} />
        </div>),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [],
  );


  const { pagination, onPaginationChange } = useRewardsPagination({ navigate, page: data });
  const { sorting, onSortingChange } = useRewardsSorting({ navigate, search });
  const { columnFilters, onColumnFiltersChange } = useRewardsColumnFilters({ navigate });

  return (
    <div className='text-center'>
      <header className='flex flex-row justify-around bg-[#c15517] text-white text-[calc(10px+2vmin)]'>
        <h1><span className='text-yellow-300'>Manage</span> Rewards List</h1>
      </header>
      <main>
        <RewardsTable
          columns={columns}
          paginatedRewards={data}
          pagination={pagination} onPaginationChange={onPaginationChange}
          sorting={sorting} onSortingChange={onSortingChange}
          columnFilters={columnFilters} onColumnFiltersChange={onColumnFiltersChange}
        />

        <DeleteDialog isOpen={deleteDialog.isOpen} onDelete={deleteDialog.onDelete} onOpenChange={deleteDialog.onOpenChange} />
        <UpdateDialog
          isOpen={updateDialog.isOpen}
          onUpdate={updateDialog.onUpdate}
          onOpenChange={updateDialog.onOpenChange}
          initialRewardData={updateDialog.initialRewardData}
        ></UpdateDialog>
        <CreateDialog
          isOpen={createDialog.isOpen}
          onCreate={createDialog.onCreate}
          onOpenChange={createDialog.onOpenChange}
        />
      </main>
    </div>
  );
}
