import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
    width: 78rem;
    height: 45rem;
    background: url('/bg.png') no-repeat center;
    background-size: cover;
    border: 0.2rem solid #fff;
    border-radius: 1rem;
    position: relative;
`;


const PageText = styled.div`
  width: fit-content;
  position: relative;
  top: 5rem;
  left: 5rem;
`;

const Heading = styled.h3`
  font-size: 15rem;
  color: #fff;
  text-shadow: 0 0 0.5rem #333;
`;

const Paragraph = styled.p`
  font-size: 3rem;
  color: #fff;
  font-weight: 700;
  margin-bottom: 3rem;
`;

const Link = styled.a`
  background-color: #9fadec;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  border: 0.3rem solid #fff;
  border-radius: 0.4rem;
  color: #fff;
  box-shadow: 0 0 0.3rem #333, inset 0 0 0.2rem #333;
  text-shadow: 0 0 0.3rem #000;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background-color: #8a9ed1;
  }
`;

const Error = () => {
    return (
        <Page>
            <PageText>
                <Heading>404</Heading>
                <Paragraph>Ooops! Something went wrong. Try the</Paragraph>
                <Link href="#">home page</Link>
            </PageText>
        </Page>
    );
};

export default Error;
