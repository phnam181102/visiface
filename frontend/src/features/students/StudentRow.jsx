import styled from 'styled-components';
import Tag from '../../ui/Tag';
import Table from '../../ui/Table';

const Img = styled.img`
    display: block;
    width: 5rem;
    height: 5rem;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Name = styled.div`
    font-size: 1.65rem;
    font-weight: 500;
    color: var(--color-grey-600);
    font-family: 'Sono';
`;

const Field = styled.div`
    font-size: 1.58rem;
    font-weight: 400;
    color: var(--color-grey-600);
    font-family: 'Sono';
`;

function StudentRow({ student }) {
    const {
        id: studentId,
        fullName,
        photo,
        attendances,
        status,
        phoneNumber,
    } = student;

    const statusToTagName = {
        active: 'green',
        withdrawn: 'silver',
        expelled: 'yellow',
    };

    return (
        <Table.Row>
            <Img src={`data:image/jpeg;base64,${photo}`} alt={fullName} />
            <Field>{studentId}</Field>
            <Name>{fullName}</Name>
            <Field>{phoneNumber}</Field>
            <Tag type={statusToTagName[status]}>{status}</Tag>
            <Field>
                {attendances > 0 ? `${attendances} sessions` : `0 session`}
            </Field>
        </Table.Row>
    );
}

export default StudentRow;
