import React from 'react';
import styled from 'styled-components';

const Button = ({t, onClick}) => {
    return (
        <StyledWrapper>
            <button type='button' onClick={onClick} className="button">
                {t}
            </button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .button {
    padding: 15px 20px;
    font-size: 16px;
    background: transparent;
    border: none;
    position: relative;
    color: #f0f0f0;
    z-index: 1;
  }

  .button::after,
  .button::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: -99999;
    transition: all .4s;
  }

  .button::before {
    transform: translate(0%, 0%);
    width: 100%;
    height: 100%;
    background: #dc2626;
    border-radius: 10px;
  }

  .button::after {
    transform: translate(10px, 10px);
    width: 35px;
    height: 35px;
    background: #ffffff15;
    backdrop-filter: blur(5px);
    border-radius: 50px;
  }

  .button:hover::before {
    transform: translate(5%, 20%);
    width: 110%;
    height: 110%;
  }

  .button:hover::after {
    border-radius: 10px;
    transform: translate(0, 0);
    width: 100%;
    height: 100%;
  }

  .button:active::after {
    transition: 0s;
    transform: translate(0, 5%);
  }`;

export default Button;
