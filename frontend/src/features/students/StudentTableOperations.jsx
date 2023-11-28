import TableOperations from '../../ui/TableOperations';
import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';

function StudentTableOperations() {
    return (
        <TableOperations>
            <Filter
                filterField="status"
                options={[
                    { value: 'all', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'withdrawn', label: 'Withdrawn' },
                    { value: 'expelled', label: 'Expelled' },
                ]}
            />

            <SortBy
                options={[
                    { value: 'name-asc', label: 'Sort by name (A-Z)' },
                    { value: 'name-desc', label: 'Sort by name (Z-A)' },
                ]}
            />
        </TableOperations>
    );
}

export default StudentTableOperations;
