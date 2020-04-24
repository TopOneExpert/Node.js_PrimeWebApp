/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Auth, API } from 'aws-amplify';
import { Col, Row, Container } from 'react-bootstrap';
import {
  FloatingContainer,
  PageContainer,
  PaddedH1Text,
  ProfileStatusDiv,
  ChangePasswordButton,
} from 'custom-styles';
import PhoneVerification from 'components/PhoneVerification';
import EmailVerification from 'components/EmailVerification';
import EditableInput from 'components/EditableInput';
import ResetPassword from 'components/ResetPassword';
import UploadId from 'components/UploadId';

// const userData = {
//   email: 'pokemon@trainer.org',
//   username: 'PikachuDetective2000',
//   firstname: 'Bob',
//   lastname: 'Wier',
//   password: 'password',
//   cellphone: '+1 333 565 3322',
// };

const Row1 = styled(Row)`
  // background: palegreen;
`;

const Row2 = styled(Row)`
  // background: lightblue;
`;

const Col1 = styled(Col)`
  // background: blue;
  text-align: center;
`;

const Col2 = styled(Col)`
  // background: red;
`;

class ProfilePage extends React.Component {
  state = {
    info: {},
    resetPassword: false,
  };

  componentDidMount = async () => {
    try {
      const data = await Auth.currentAuthenticatedUser();
      console.log('currentAuthenticatedUser: ', data);
      const info = data.attributes || data;
      this.setState({ info });
    } catch (e) {
      console.error(`ProfilePage.componentDidMount() ERROR: ${e}`);
    }
  };

  changeProfile = async (Value, Name) => {
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const { jwtToken: AccessToken } = signInUserSession.accessToken;
    const changeData = {
      Name,
      Value,
      AccessToken,
    };
    try {
      await API.post('notes', '/notes/changeprofile', { body: changeData });
    } catch (e) {
      console.error(`ProfilePage.changeProfile() ERROR: ${e}`);
    }
  };

  render() {
    const { info, resetPassword } = this.state;
    const { isVerified, phoneConfirmed, emailConfirmed } = this.props;

    return (
      <PageContainer>
        <FloatingContainer>
          <Container>
            <Row1>
              <Col>
                <PaddedH1Text>Profile</PaddedH1Text>
              </Col>
            </Row1>
            <Row2>
              <Col1 sm={6}>
                {['email', 'phone_number', 'given_name', 'family_name'].map(
                  fieldName => (
                    <EditableInput
                      value={info[fieldName]}
                      key={`EditableInput-key-${Math.random()}`}
                      // editable={ !isVerified.facebook && fieldName !== 'email' && fieldName !== 'phone_number'}
                      editable={!isVerified.facebook || !isVerified.google}
                      change={newValue =>
                        this.changeProfile(newValue, fieldName)
                      }
                    />
                  ),
                )}

                {resetPassword ? (
                  <ResetPassword
                    username={info.email}
                    onSuccess={() => this.setState({ resetPassword: false })}
                  />
                ) : (
                  <ChangePasswordButton
                    variant="dark"
                    onClick={() => this.setState({ resetPassword: true })}
                  >
                    change password
                  </ChangePasswordButton>
                )}
              </Col1>
              <Col2 sm={6}>
                <ProfileStatusDiv>
                  <br />
                  <div>
                    <b>Status</b>
                  </div>
                  <br />
                  {isVerified.email && isVerified.phone ? 'Active' : null}
                  <br />
                  {!isVerified.phone ? (
                    <PhoneVerification
                      isVerified={ (isVerified.email && isVerified.phone) || isVerified.facebook || isVerified.google }
                      phoneConfirmed={phoneConfirmed}
                    />
                  ) : (
                    'Phone is verified'
                  )}
                  <br />
                  {!isVerified.email ? (
                    <EmailVerification
                      isVerified={ (isVerified.email && isVerified.phone) || isVerified.facebook || isVerified.google }
                      emailConfirmed={emailConfirmed}
                    />
                  ) : (
                    'Email is verified'
                  )}
                  <Container>
                    <Row2>
                      <Col2>
                        <UploadId/>
                      </Col2>
                    </Row2>
                  </Container>
                </ProfileStatusDiv>
              </Col2>
            </Row2>
          </Container>
        </FloatingContainer>
      </PageContainer>
    );
  }
}

ProfilePage.propTypes = {
  isVerified: PropTypes.object,
  phoneConfirmed: PropTypes.func,
  emailConfirmed: PropTypes.func,
};

export default ProfilePage;
