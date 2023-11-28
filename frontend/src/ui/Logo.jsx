import styled from 'styled-components';
import { useDarkMode } from '../context/DarkModeContext';

const StyledLogo = styled.div`
    text-align: center;
`;

const Text = styled.h1`
    font-size: ${(props) => (props.bigSize ? '6rem' : '3.5rem')};
    font-weight: 900;
    font-family: 'Work Sans', sans-serif;
    @supports (background-clip: text) or (-webkit-background-clip: text) {
        background-image: url("data:image/svg+xml,%3Csvg width='2250' height='900' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath fill='%2300A080' d='M0 0h2255v899H0z'/%3E%3Ccircle cx='366' cy='207' r='366' fill='%2300FDCF'/%3E%3Ccircle cx='1777.5' cy='318.5' r='477.5' fill='%2300FDCF'/%3E%3Ccircle cx='1215' cy='737' r='366' fill='%23008060'/%3E%3C/g%3E%3C/svg%3E%0A");
        background-size: 85% auto;
        background-position: center;
        -webkit-background-clip: text;
        background-clip: text;
    }
    color: ${(props) => (props.isDarkMode ? 'transparent' : '#00000046')};
`;

const LogoImage = styled.img`
    height: ${(props) => (props.bigSize ? '80px' : '50px')};
    width: auto;
`;

function Logo(props) {
    const { isDarkMode } = useDarkMode();

    return (
        <StyledLogo>
            <LogoImage {...props} src="/logo.png" alt="" />
            <Text {...props} isDarkMode={isDarkMode}>
                VisiFace
            </Text>
        </StyledLogo>
    );
}

export default Logo;
