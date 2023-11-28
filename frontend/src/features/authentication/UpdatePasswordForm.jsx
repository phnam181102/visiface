import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUpdateUser } from './useUpdateUser';

function UpdatePasswordForm() {
    const { register, handleSubmit, formState, getValues, reset } = useForm();
    const { errors } = formState;

    const { updateUser, isUpdating } = useUpdateUser();

    function onSubmit(data) {
        updateUser(data, { onSuccess: reset() });
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow
                label="Current password"
                error={errors?.passwordCurrent?.message}
            >
                <Input
                    type="password"
                    id="passwordCurrent"
                    autoComplete="current-password"
                    disabled={isUpdating}
                    {...register('passwordCurrent', {
                        required: 'This field is required',
                    })}
                />
            </FormRow>

            <FormRow
                label="New password (min 8 chars)"
                error={errors?.password?.message}
            >
                <Input
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    disabled={isUpdating}
                    {...register('password', {
                        required: 'This field is required',
                        minLength: {
                            value: 8,
                            message: 'Password needs a minimum of 8 characters',
                        },
                        validate: (value) =>
                            value !== getValues('passwordCurrent') ||
                            'New password must be different from current password',
                    })}
                />
            </FormRow>

            <FormRow
                label="Confirm new password"
                error={errors?.passwordConfirm?.message}
            >
                <Input
                    type="password"
                    autoComplete="new-password"
                    id="passwordConfirm"
                    disabled={isUpdating}
                    {...register('passwordConfirm', {
                        required: 'This field is required',
                        validate: (value) =>
                            getValues().password === value ||
                            'Passwords need to match',
                    })}
                />
            </FormRow>

            <FormRow>
                <Button onClick={reset} type="reset" variation="secondary">
                    Cancel
                </Button>
                <Button disabled={isUpdating}>Update password</Button>
            </FormRow>
        </Form>
    );
}

export default UpdatePasswordForm;
