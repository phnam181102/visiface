import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createEditUser } from '../../services/apiUsers';

export function useEditUser() {
    const queryClient = useQueryClient();

    const { mutate: editUser, isLoading: isEditing } = useMutation({
        mutationFn: ({ newUserData, id }) => createEditUser(newUserData, id),
        onSuccess: () => {
            toast.success('User successfully edited');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { editUser, isEditing };
}
