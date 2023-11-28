import styled from 'styled-components';

import CreateUserForm from './CreateUserForm';
import Tag from '../../ui/Tag';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';

import { HiPencil, HiTrash } from 'react-icons/hi2';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteUser } from './useDeleteUser';

const Field = styled.div`
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-grey-600);
    font-family: 'Sono';
`;

const Img = styled.img`
    display: block;
    height: 5rem;
    width: 5rem;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Stacked = styled.div`
    display: flex;
    align-items: center;
    gap: 1.4rem;

    & span:first-child {
        font-size: 1.65rem;
    }

    & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.3rem;
    }
`;

function UserRow({ user }) {
    const { _id: userId, role, status, name, email, phoneNumber, photo } = user;

    const { isDeleting, deleteUser } = useDeleteUser();

    const statusToTagName = {
        disabled: 'grey',
        active: 'green',
        banned: 'yellow',
    };

    return (
        <Table.Row>
            <Img
                src={
                    photo
                        ? `data:image/jpeg;base64,${photo}`
                        : `default-user.jpg`
                }
                alt={name}
            />
            <Stacked>
                <span>{name}</span>
                <span>-</span>
                <span>
                    {role.replace(/^\w/, function (match) {
                        return match.toUpperCase();
                    })}
                </span>
            </Stacked>
            <Field>{email}</Field>
            <Field>{phoneNumber}</Field>

            <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>

            <Modal>
                <Menus.Menu>
                    <Menus.Toggle id={userId} />

                    <Menus.List id={userId}>
                        <Modal.Open opens="edit">
                            <Menus.Button icon={<HiPencil />}>
                                Edit
                            </Menus.Button>
                        </Modal.Open>

                        <Modal.Open opens="confirm-delete">
                            <Menus.Button
                                icon={<HiTrash />}
                                onClick={() => {}}
                                disabled={isDeleting}
                            >
                                Delete
                            </Menus.Button>
                        </Modal.Open>
                    </Menus.List>

                    <Modal.Window name="edit">
                        <CreateUserForm userToEdit={user} />
                    </Modal.Window>

                    <Modal.Window name="confirm-delete">
                        <ConfirmDelete
                            resourceName="users"
                            disabled={isDeleting}
                            onConfirm={() => deleteUser(userId)}
                        />
                    </Modal.Window>
                </Menus.Menu>
            </Modal>
        </Table.Row>
    );
}

export default UserRow;
