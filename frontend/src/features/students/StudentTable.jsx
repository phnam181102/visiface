import Spinner from '../../ui/Spinner';
import StudentRow from './StudentRow';
import { useStudents } from './useStudents';
import Menus from '../../ui/Menus';
import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import { useSubjects } from './useSubjects';
import { useSearchParams } from 'react-router-dom';

function StudentTable() {
    const [searchParams] = useSearchParams();

    const { subjects } = useSubjects();

    const slug = searchParams.get('subject');

    let currentSubject;
    if (slug)
        currentSubject = subjects.filter((subject) => subject.slug === slug)[0];
    else currentSubject = subjects[0];

    const { isLoading, students } = useStudents(
        currentSubject.id,
        currentSubject.classId
    );

    if (!students || !students.length) return <Empty resourceName="students" />;

    if (isLoading) return <Spinner />;

    return (
        <Menus>
            <Table columns="0.6fr 0.8fr 1.4fr 1.2fr 1fr 1fr">
                <Table.Header>
                    <div></div>
                    <div>ID</div>
                    <div>Full name</div>
                    <div>Phone number</div>
                    <div>Status</div>
                    <div>Attendances</div>
                </Table.Header>

                <Table.Body
                    data={students}
                    render={(student) => (
                        <StudentRow student={student} key={student.id} />
                    )}
                />
            </Table>
        </Menus>
    );
}

export default StudentTable;
