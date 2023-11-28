import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { login as loginApi } from '../../services/apiAuth';

export function useLogin() {
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const { mutate: login, isLoading } = useMutation({
        mutationFn: ({ email, password }) => loginApi({ email, password }),
        onSuccess: (data) => {
            navigate('/my-classes', { replace: true });
            queryClient.setQueryData(['user'], data.user);
        },
        onError: (err) => {
            console.error('ERROR', err);
            toast.error('Provided email or password is incorrect');
        },
    });

    return { login, isLoading };
}
