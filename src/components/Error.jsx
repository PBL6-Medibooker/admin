import React from 'react';
import styled, { keyframes } from 'styled-components';

const search = keyframes`
  50% {
    transform: translateX(-15.62em) rotateY(180deg);
  }
`;

const Layout = styled.div`
    height: 100vh;
    padding: 0;
    margin: 0;
    background: linear-gradient(#010163 80%, #5294ff 80%);
`

const Container = styled.div`
  height: 32.87em;
  width: 21.87em;
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  bottom: 0;
`;

const Sand = styled.div`
  background-color: #fecd64;
  height: 6.25em;
  width: 100%;
  border-radius: 10.93em 10.93em 0 0;
  position: absolute;
  top: 26.62em;
`;

const Tower = styled.div`
  height: 0;
  width: 7.5em;
  border-bottom: 18.75em solid #deeefa;
  border-left: 1.25em solid transparent;
  border-right: 1.25em solid transparent;
  position: absolute;
  left: 5.93em;
  top: 11.31em;

  &::before {
    position: absolute;
    content: "";
    top: 11.87em;
    left: -1em;
    width: 9.18em;
    height: 0;
    border-bottom: 1.56em solid #f94862;
    border-left: 0.12em solid transparent;
    border-right: 0.12em solid transparent;
  }

  &::after {
    position: absolute;
    content: "";
    top: 0.93em;
    right: -0.18em;
    height: 0;
    width: 7.62em;
    border-bottom: 1.56em solid #f94862;
    border-left: 0.12em solid transparent;
    border-right: 0.12em solid transparent;
  }
`;

const Pole = styled.div`
  height: 3em;
  width: 0.8em;
  background-color: #f94862;
  border-radius: 0.5em 0.5em 0 0;
  position: absolute;
  left: 3.2em;
  bottom: 8em;
`;

const Door = styled.div`
  width: 3.75em;
  height: 4.37em;
  background-color: #1d3260;
  border-radius: 2.18em 2.18em 0 0;
  position: absolute;
  left: 1.87em;
  top: 14.37em;
  box-shadow: 0 -9.37em #1d3260;
`;

const LightBase = styled.div`
  background-color: #f7859a;
  height: 1em;
  width: 10.62em;
  position: absolute;
  left: -1.56em;
  bottom: 0;

  &::before {
    position: absolute;
    content: "";
    background-color: #f94862;
    height: 1.25em;
    width: 7.5em;
    bottom: 1em;
    left: 1.56em;
    right: 0.06em;
  }
`;

const Dome = styled.div`
  position: absolute;
  height: 6.25em;
  width: 7.5em;
  background: linear-gradient(
    to bottom,
    #f94862 3.43em,
    #5ab7ff 3.43em,
    #5ab7ff 5.31em,
    #f94862 5.31em
  );
  bottom: 2em;
  border-radius: 3.75em 3.73em 0 0;
`;

const Light = styled.div`
  width: 7.5em;
  border-right: 15.62em solid #fecf2b;
  border-top: 2.5em solid transparent;
  border-bottom: 2.5em solid transparent;
  position: absolute;
  bottom: 1.5em;
  left: 0;
  animation: ${search} 4s infinite;
`;

const SandExtra = styled.div`
  height: 3.12em;
  width: 4.37em;
  background-color: #fecd64;
  border-radius: 50%;
  position: absolute;
  bottom: 1.87em;
  left: 4.06em;
  box-shadow: 2.5em 0.62em 0 -0.62em #fecd64;
`;

const Text = styled.div`
  width: 90%;
  position: absolute;
  font-family: "Poppins", sans-serif;
  text-align: center;
  top: 5em;
  margin: auto;
  left: 0;
  right: 0;
  line-height: 1;
`;

const Heading = styled.h2`
  font-size: 3.8em;
  color: red;
  letter-spacing: 0.4em;
  margin-bottom: 0;
`;

const SubHeading = styled.h3`
  font-size: 1.2em;
  font-weight: 500;
    color: red; 
    letter-spacing: 0.2em;
`;

const Error = () => {
    return (
        <Layout>
            <Text>
                <Heading>ERROR</Heading>
                <SubHeading>Sorry! Page Not Found</SubHeading>
            </Text>
            <Container>
                <Sand />
                <Tower>
                    {/*<Pole />*/}
                    {/*<Door />*/}
                    {/*<LightBase />*/}
                    {/*<Dome />*/}
                    {/*<Light />*/}
                </Tower>
                <SandExtra />
            </Container>
        </Layout>
    );
};

export default Error;


