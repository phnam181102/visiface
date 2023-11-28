import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '../../services/apiStudents';

export function useSubjects() {
    const {
        isLoading,
        data: subjects,
        error,
    } = useQuery({
        queryKey: ['subjects'],
        queryFn: getSubjects,
    });

    return { isLoading, subjects, error };
}
