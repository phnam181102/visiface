import { useMutation } from '@tanstack/react-query';

import { createStudent as createStudentApi } from '../../services/apiStudents';
import { toast } from 'react-hot-toast';

export function useCreateStudent() {
    const { mutate: createStudent, isLoading } = useMutation({
        mutationFn: (data) => {
            createStudentApi(data);
        },
        onSuccess: () => {
            toast.success('Student successfully created!');
        },
    });

    return { createStudent, isLoading };
}
