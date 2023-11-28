import { styled } from 'styled-components';

import Spinner from './Spinner';

const StyledSpinnerFullpage = styled.div`
    margin: 2.5rem;
    height: calc(100vh - 5rem);
    background-color: var(--color-grey-200);
`;

function SpinnerFullPage() {
    return (
        <StyledSpinnerFullpage>
            <Spinner />
        </StyledSpinnerFullpage>
    );
}

export default SpinnerFullPage;
