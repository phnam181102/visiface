import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUser } from './useUser';
import { useUpdateUser } from './useUpdateUser';
import { useForm } from 'react-hook-form';

function UpdateUserDataForm() {
    // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
    const { user, isLoading } = useUser();

    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: user,
    });
    const { errors } = formState;

    const { updateUser, isUpdating } = useUpdateUser();

    const isWorking = isUpdating || isLoading;

    function onSubmit(data) {
        if (data && data.photo?.[0] && data.photo[0] instanceof Blob) {
            const photoFile = data.photo[0];

            const reader = new FileReader();

            reader.onload = function (e) {
                const photo = e.target.result.split(',')[1];
                updateUser(
                    { ...data, photo },
                    {
                        onSuccess: (data) => {
                            data.photo = null; // Set null to clear image
                            reset(data);
                        },
                    }
                );
            };

            reader.readAsDataURL(photoFile);
        } else {
            updateUser(
                { ...data },
                {
                    onSuccess: (data) => {
                        reset(data);
                    },
                }
            );
        }
    }

    function onError(errors) {
        // console.log(errors);
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormRow label="Name" error={errors?.name?.message}>
                <Input type="text" id="name" disabled {...register('name')} />
            </FormRow>

            <FormRow label="Email address" error={errors?.email?.message}>
                <Input
                    type="text"
                    id="email"
                    disabled={isWorking}
                    {...register('email', {
                        required: 'This field is required!',
                    })}
                />
            </FormRow>

            <FormRow label="Phone number" error={errors?.phoneNumber?.message}>
                <Input
                    type="text"
                    id="phoneNumber"
                    disabled={isWorking}
                    {...register('phoneNumber', {
                        required: 'This field is required!',
                    })}
                />
            </FormRow>

            <FormRow label="Avatar image">
                <FileInput id="photo" accept="image/*" {...register('photo')} />
            </FormRow>

            <FormRow>
                <Button disabled={isUpdating}>Update account</Button>
            </FormRow>
        </Form>
    );
}

export default UpdateUserDataForm;
