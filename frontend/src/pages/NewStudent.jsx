import Heading from '../ui/Heading';
import CreateStudentForm from '../features/students/CreateStudentForm';

function NewStudent() {
    return (
        <>
            <Heading as="h1">Create a new student</Heading>
            <CreateStudentForm />
        </>
    );
}

export default NewStudent;
