import { useUsers } from './useUsers';

import UserRow from './UserRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Empty from '../../ui/Empty';
import Spinner from '../../ui/Spinner';
import Pagination from '../../ui/Pagination';

function UserTable() {
    const { users, count, isLoading } = useUsers();

    if (!users?.length) return <Empty resourceName="users" />;

    if (isLoading) return <Spinner />;

    return (
        <Menus>
            <Table columns="0.4fr 1.4fr 1.2fr 0.8fr 0.5fr 3.2rem">
                <Table.Header>
                    <div></div>
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone number</div>
                    <div>Status</div>
                    <div></div>
                </Table.Header>

                <Table.Body
                    data={users}
                    render={(user) => <UserRow key={user.id} user={user} />}
                />

                <Table.Footer>
                    <Pagination count={count} />
                </Table.Footer>
            </Table>
        </Menus>
    );
}

export default UserTable;
