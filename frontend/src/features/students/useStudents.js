import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../../services/apiStudents';
import { useSearchParams } from 'react-router-dom';

export function useStudents(subjectId, classId) {
    const [searchParams] = useSearchParams();

    // 1. FILTER
    const filterValue = searchParams.get('status');
    const filter =
        !filterValue || filterValue === 'all'
            ? null
            : { field: 'status', value: filterValue };

    // 2. SORT
    const sortByRaw = searchParams.get('sortBy') || 'name-asc';
    const [field, direction] = sortByRaw.split('-');
    const sortBy = { field, direction };

    const {
        isLoading,
        data: students,
        error,
    } = useQuery({
        queryKey: ['students', subjectId, classId, sortBy, filter],
        queryFn: () => getStudents(subjectId, classId, sortBy, filter),
    });

    return { isLoading, students, error };
}
