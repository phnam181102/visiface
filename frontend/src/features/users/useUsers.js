import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from '../../services/apiUsers';
import { useSearchParams } from 'react-router-dom';
import { ITEM_PER_PAGE } from '../../utils/constants';

export function useUsers() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    // 1. FILTER
    const filterValue = searchParams.get('role');
    const filter =
        !filterValue || filterValue === 'all'
            ? null
            : { field: 'role', value: filterValue };

    // 2. SORT
    const sortByRaw = searchParams.get('sortBy') || 'name-asc';
    const [field, direction] = sortByRaw.split('-');
    const sortBy = { field, direction };

    // PAGINATION
    const page = !searchParams.get('page')
        ? 1
        : Number(searchParams.get('page'));

    const {
        isLoading,
        data: { data: users, count } = {},
        error,
    } = useQuery({
        queryKey: ['users', filter, sortBy, page],
        queryFn: () => getUsers({ filter, sortBy, page }),
    });

    // PRE-FETCHING
    if (page + 1 <= Math.ceil(count / ITEM_PER_PAGE))
        queryClient.prefetchQuery({
            queryKey: ['users', filter, sortBy, page + 1],
            queryFn: () => getUsers({ filter, sortBy, page: page + 1 }),
        });
    if (page - 1 > 0)
        queryClient.prefetchQuery({
            queryKey: ['users', filter, sortBy, page - 1],
            queryFn: () => getUsers({ filter, sortBy, page: page - 1 }),
        });

    return { isLoading, users, count, error };
}
