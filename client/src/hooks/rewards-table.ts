import { RewardsResponseSchema, RewardsSearchCategoryParam, RewardsSearchNameParam, type RewardsSearchParams as RewardsSearchParamsType } from "@/data/rewards-data";
import type { UseNavigateResult } from "@tanstack/react-router";
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import React from "react";

export function useRewardsSorting({ navigate, search }: { navigate: UseNavigateResult<'/'>, search: Pick<RewardsSearchParamsType, 'priceSort'> }) {
    const [sorting, onSortingChange] = React.useState<SortingState>([
        { id: 'Price', desc: search.priceSort === -1 }
    ]);
    React.useEffect(() => {
        navigate({
            search: (prev) => ({
                ...prev,
                priceSort: sorting[0] ? sorting[0].desc ? -1 : 1 : 0,
            }),
        })
    }, [sorting]);
    return { sorting, onSortingChange };
}

export function useRewardsPagination({ navigate, page }: { navigate: UseNavigateResult<'/'>, page: Pick<RewardsResponseSchema, 'PageSize' | 'PageNumber'> }) {
    const [pagination, onPaginationChange] = React.useState<PaginationState>({
        pageSize: page.PageSize,
        pageIndex: page.PageNumber - 1,
    });
    React.useEffect(() => {
        navigate({
            search: (prev) => ({
                ...prev,
                // internally it starts at index 0 instead of 1
                page: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
            }),
        })
    }, [pagination]);

    return { pagination, onPaginationChange };
}

export function useRewardsColumnFilters({ navigate }: { navigate: UseNavigateResult<'/'> }) {
    const [columnFilters, onColumnFiltersChange] = React.useState<ColumnFiltersState>([]);

    React.useEffect(() => {
        const filters = new Map(columnFilters.map(({ id, value }) => ([id, value])));
        const { data: name } = RewardsSearchNameParam.safeParse(filters.get('Name'));
        const { data: category } = RewardsSearchCategoryParam.safeParse(filters.get('Category'));
        navigate({
            search: (prev) => ({
                ...prev,
                name,
                category,
            }),
        })
    }, [columnFilters]);

    return { columnFilters, onColumnFiltersChange };
}
