import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import CameraViewer from '../../ui/CameraViewer';
import Input from '../../ui/Input';
import { useCreateStudent } from './useCreateStudent';
import FormRowVertical from '../../ui/FormRowVertical';

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 0.8fr 1fr;
    gap: 5rem;
`;

const LeftSide = styled.div`
    margin-bottom: -1rem;
    padding-bottom: 1.5rem;
`;

const RightSide = styled.div`
    padding-top: 38px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 3rem;

    & > * {
        width: 100%;
    }
`;

const RequiredLabel = styled.span`
    &::after {
        content: '*';
        padding-left: 5px;
        color: #d53d3d;
    }
`;

function CreateStudentForm() {
    const { createStudent, isLoading } = useCreateStudent();

    const { register, formState, getValues, handleSubmit, reset } = useForm();
    const { errors } = formState;

    const [photo, setPhoto] = useState('');

    function onSubmit(student) {
        if (!photo) return;
        createStudent(
            { photo, ...student },
            {
                onSuccess: reset,
            }
        );
    }

    function handlePhotoCapture(base64Image) {
        setPhoto(base64Image);
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} column={2}>
            <Wrapper>
                <LeftSide>
                    <FormRowVertical
                        type="narrow"
                        label={<RequiredLabel>Full name</RequiredLabel>}
                        error={errors?.fullName?.message}
                    >
                        <Input
                            disabled={isLoading}
                            type="text"
                            id="fullName"
                            {...register('fullName', {
                                required: 'This field is required!',
                            })}
                        />
                    </FormRowVertical>

                    <Row>
                        <FormRowVertical
                            type="narrow"
                            label={<RequiredLabel>ID</RequiredLabel>}
                            error={errors?.id?.message}
                        >
                            <Input
                                disabled={isLoading}
                                type="text"
                                id="id"
                                {...register('id', {
                                    required: 'This field is required!',
                                    pattern: {
                                        value: /^\d{5}$/,
                                        message:
                                            'Student ID must be a 5-digit number.',
                                    },
                                })}
                            />
                        </FormRowVertical>
                        <FormRowVertical
                            type="narrow"
                            label="Birthday"
                            error={errors?.birthday?.message}
                        >
                            <Input
                                type="text"
                                disabled={isLoading}
                                id="birthday"
                                {...register('birthday', {
                                    pattern: {
                                        value: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
                                        message:
                                            'Please provide a valid birthday',
                                    },
                                })}
                            />
                        </FormRowVertical>
                    </Row>

                    <FormRowVertical
                        type="narrow"
                        label={<RequiredLabel>Class ID</RequiredLabel>}
                        error={errors?.classId?.message}
                    >
                        <Input
                            type="text"
                            disabled={isLoading}
                            id="classId"
                            {...register('classId', {
                                required: 'This field is required!',
                                pattern: {
                                    value: /^[a-zA-Z0-9]{7}$/,
                                    message: 'Please provide a valid class ID.',
                                },
                            })}
                        />
                    </FormRowVertical>

                    <FormRowVertical
                        type="narrow"
                        label={<RequiredLabel>Phone number</RequiredLabel>}
                        error={errors?.phoneNumber?.message}
                    >
                        <Input
                            type="text"
                            disabled={isLoading}
                            id="phoneNumber"
                            {...register('phoneNumber', {
                                required: 'This field is required!',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message:
                                        'Please provide a valid phone number.',
                                },
                            })}
                        />
                    </FormRowVertical>

                    <FormRowVertical
                        type="narrow"
                        label="Email address"
                        error={errors?.email?.message}
                    >
                        <Input
                            type="email"
                            disabled={isLoading}
                            id="email"
                            {...register('email', {
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message:
                                        'Please provide a valid email address',
                                },
                            })}
                        />
                    </FormRowVertical>

                    <FormRowVertical
                        type="narrow"
                        label={
                            <RequiredLabel>
                                PIN Code (6 characters)
                            </RequiredLabel>
                        }
                        error={errors?.pinCode?.message}
                    >
                        <Input
                            type="password"
                            disabled={isLoading}
                            id="pinCode"
                            {...register('pinCode', {
                                required: 'This field is required!',
                                validate: (value) =>
                                    value.length === 6 ||
                                    'Pin code must be 6 characters long.',
                            })}
                        />
                    </FormRowVertical>

                    <FormRowVertical
                        type="narrow"
                        label={<RequiredLabel>Repeat PIN Code</RequiredLabel>}
                        error={errors?.pinCodeConfirm?.message}
                    >
                        <Input
                            type="password"
                            disabled={isLoading}
                            id="pinCodeConfirm"
                            {...register('pinCodeConfirm', {
                                required: 'This field is required!',
                                validate: (value) =>
                                    value === getValues().pinCode ||
                                    'PIN code need to match',
                            })}
                        />
                    </FormRowVertical>
                </LeftSide>

                <RightSide>
                    <CameraViewer onPhotoCapture={handlePhotoCapture} />

                    <FormRow>
                        {/* type is an HTML attribute! */}
                        <Button
                            variation="secondary"
                            type="reset"
                            disabled={isLoading}
                            onClick={reset}
                        >
                            Cancel
                        </Button>
                        <Button disabled={isLoading}>Create new student</Button>
                    </FormRow>
                </RightSide>
            </Wrapper>
        </Form>
    );
}

export default CreateStudentForm;
