import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';

const StyledSelect = styled.select`
    max-width: 500px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    font-size: 3rem;
    font-weight: 600;
    padding: 0.8rem 1.2rem;
    border-radius: var(--border-radius-sm);
    border: none;
    outline: none;
    background-color: transparent;

    option {
        background-color: var(--color-grey-0);
        color: white;
        font-size: 1.6rem;
    }
`;

function DropdownPicker({ name, options, ...props }) {
    const [searchParams, setSearchParams] = useSearchParams();
    let value;

    function handleChange(e) {
        searchParams.set(name, e.target.value);
        setSearchParams(searchParams);

        e.target.blur();
    }

    return (
        <StyledSelect value={value} {...props} onChange={handleChange}>
            {options.map((op) => (
                <option value={op.value} key={op.value}>
                    {op.label}
                </option>
            ))}
        </StyledSelect>
    );
}

export default DropdownPicker;
