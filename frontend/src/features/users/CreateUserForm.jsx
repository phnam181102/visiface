import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import FormRow from '../../ui/FormRow';

import { useCreateUser } from './useCreateUser';
import { useEditUser } from './useEditUser';

function CreateUserForm({ userToEdit = {}, onCloseModal }) {
    const { _id: editId, ...editValues } = userToEdit;

    const isEditSession = Boolean(editId);

    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: isEditSession ? editValues : {},
    });
    const { errors } = formState;

    const { createUser, isCreating } = useCreateUser();

    const { editUser, isEditing } = useEditUser();

    const isWorking = isCreating || isEditing;

    function onSubmit(data) {
        if (typeof data.photo === 'string') {
            handleUserData(data, data.photo);
        } else if (!data.photo?.length) {
            handleUserData(data, undefined);
        } else if (
            data.photo &&
            data.photo[0] &&
            data.photo[0] instanceof Blob
        ) {
            const photoFile = data.photo[0];

            const reader = new FileReader();

            reader.onload = function (e) {
                const photo = e.target.result.split(',')[1];
                handleUserData(data, photo);
            };

            reader.readAsDataURL(photoFile);
        }
    }

    function handleUserData(data, photo) {
        if (isEditSession) {
            editUser(
                { newUserData: { ...data, photo }, id: editId },
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            );
        } else {
            createUser(
                { ...data, photo },
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            );
        }
    }

    function onError(errors) {
        // console.log(errors);
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={onCloseModal ? 'modal' : 'regular'}
        >
            <FormRow label="Name" error={errors?.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
                    {...register('name', {
                        required: 'This field is required!',
                    })}
                />
            </FormRow>

            <FormRow label="Email" error={errors?.email?.message}>
                <Input
                    type="text"
                    id="email"
                    disabled={isWorking}
                    {...register('email', {
                        required: 'This field is required!',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email format',
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Phone number" error={errors?.phoneNumber?.message}>
                <Input
                    type="number"
                    id="phoneNumber"
                    disabled={isWorking}
                    {...register('phoneNumber', {
                        required: 'This field is required!',
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Invalid phone number format',
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label="Teacher ID (optional)"
                error={errors?.teacherId?.message}
            >
                <Input
                    type="text"
                    id="teacherId"
                    disabled={isWorking}
                    {...register('teacherId')}
                />
            </FormRow>

            <FormRow label="User photo">
                <FileInput
                    id="photo"
                    accept="image/*"
                    {...register('photo', {
                        required: isEditSession
                            ? false
                            : 'This field is required!',
                    })}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button
                    variation="secondary"
                    type="reset"
                    onClick={() => onCloseModal?.()}
                >
                    Cancel
                </Button>
                <Button disabled={isWorking}>
                    {isEditSession ? 'Edit user' : 'Add user'}
                </Button>
            </FormRow>
        </Form>
    );
}

Form.defaultProps = {
    type: 'regular',
};

export default CreateUserForm;
