import styled from 'styled-components';

const StyledWrapper = styled.div`
  .tab-name-input {
    font-size: 0.8125rem;
    padding: 0 4px;
    outline: none;
    border-radius: 3px;
    color: ${(props) => props.theme.text};
    background: ${(props) => props.theme.input.bg};
    border: 1px solid ${(props) => props.theme.input.focusBorder};
  }
`;

export default StyledWrapper;
