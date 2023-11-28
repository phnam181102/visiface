import SortBy from '../../ui/SortBy';
import Filter from '../../ui/Filter';
import TableOperations from '../../ui/TableOperations';

function UserTableOperations() {
    return (
        <TableOperations>
            <Filter
                filterField="role"
                options={[
                    { value: 'all', label: 'All' },
                    { value: 'teacher', label: 'Teacher' },
                    { value: 'manager', label: 'Manager' },
                ]}
            />

            <SortBy
                options={[
                    {
                        value: 'name-asc',
                        label: 'Sort by name (A-Z)',
                    },
                    {
                        value: 'name-desc',
                        label: 'Sort by name (Z-A)',
                    },
                ]}
            />
        </TableOperations>
    );
}

export default UserTableOperations;
