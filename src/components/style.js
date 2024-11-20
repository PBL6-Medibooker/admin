import styled from 'styled-components';

export const ThemeWrapper = styled.div`
    display: flex;
    align-items: center;
    -webkit-tap-highlight-color: transparent;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: 0;
    padding: 5px;  
    width: 100px;
`;

export const ToggleWrapper = styled.div`
    margin: 0 0.5em;  
`;

export const ToggleSwitch = styled.input`
    position: relative;
    width: 4em;  
    height: 2em;  
    border-radius: 25% / 50%;
    background-color: #fff;
    border: 1px solid hsl(0, 0%, 80%);
    transition: transform var(--transDur, 0.3s) ease-in-out;
    appearance: none;
    cursor: pointer;

    background-image: url('https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg');
    background-size: cover;
    background-position: center;

    &:checked {
        background-image: url('https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg');
    }

    &:before {
        content: "VN";  
        position: absolute;
        width: 2em;  
        height: 2em; 
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        transform: translate(0.2em, 0.2em); 
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8em;  
        font-weight: bold;
        color: black;
        transition: transform var(--transDur, 0.3s) ease-in-out, opacity var(--transDur, 0.3s) ease-in-out;
        z-index: 1;
    }

    &:checked:before {
        transform: translate(2.8em, 0.2em); 
        content: "EN";
    }
`;

