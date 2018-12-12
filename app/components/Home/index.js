/**
 *
 * Home
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import { Auth } from 'aws-amplify';
import styled from 'styled-components';
import { FloatingContainer, PageContainer, PaddedH1Text } from 'custom-styles';

export const WelcomeContainer = styled(FloatingContainer)`
  height: 80vh;
`;

export const MiddleOfPage = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 30vh;
  min-height: 50px;
  max-height: 130px;
  width: 75vw;
  max-width: 380px;
  // box-shadow: 0px 8px 6px -6px black;
`;

export const WelcomeText = styled(PaddedH1Text)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 1em;
  text-align: center;
  font-weight: bolder;
  color: #0c2340;
`;

function Home() {
  // console.log(localStorage)
  // Auth.currentAuthenticatedUser().then(user=>Auth.verifiedContact(user).then(info=>console.log(info)))
  // Auth.verifyCurrentUserAttribute('email').then(data=>console.log(data))
  return (
    <PageContainer>
      <WelcomeContainer>
        <MiddleOfPage>
          <WelcomeText>Welcome!</WelcomeText>
        </MiddleOfPage>
      </WelcomeContainer>
    </PageContainer>
  );
}

Home.propTypes = {};

export default Home;
