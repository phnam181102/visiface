import styled, { css } from 'styled-components';

const StyledFormRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1.4rem 0;

    ${(props) =>
        props.type === 'narrow' &&
        css`
            gap: 0.4rem;
            padding: 0;
            padding-top: 1.4rem;
        `}
`;

const Label = styled.label`
    font-size: 1.6rem;
    font-weight: 500;
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
`;

function FormRowVertical({ label, error, children, type }) {
    return (
        <StyledFormRow type={type}>
            {label && <Label htmlFor={children.props.id}>{label}</Label>}
            {children}
            {error && <Error>{error}</Error>}
        </StyledFormRow>
    );
}

export default FormRowVertical;
