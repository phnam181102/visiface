import StudentTable from '../features/students/StudentTable';
import Row from '../ui/Row';
import StudentTableOperations from '../features/students/StudentTableOperations';
import { useSubjects } from '../features/students/useSubjects';
import DropdownPicker from '../ui/DropdownPicker';
import Spinner from '../ui/Spinner';

function MyClasses() {
    const { subjects, isLoading } = useSubjects();

    if (isLoading) return <Spinner />;
    console.log(subjects);
    const newSubjects = subjects.map((subject) => {
        return {
            value: subject.slug,
            label: subject.name,
        };
    });

    return (
        <>
            <Row type="horizontal">
                <DropdownPicker name="subject" options={newSubjects} />

                <StudentTableOperations />
            </Row>

            <Row>
                <StudentTable />
            </Row>
        </>
    );
}

export default MyClasses;
