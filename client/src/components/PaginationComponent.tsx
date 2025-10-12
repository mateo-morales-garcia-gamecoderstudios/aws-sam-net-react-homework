import type { RewardSchema } from "@/data/rewards-data";
import type { Table } from "@tanstack/react-table";

export function Pagination({ table }: { table: Table<RewardSchema> }) {
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
