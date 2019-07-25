/**
 *
 * EmailVerification
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import styled from 'styled-components';

import { BasicButton, StyledInput, InvertedButton } from 'custom-styles';

const PendingButton = styled(BasicButton)`
  background: red;
  color: white;
  padding: 10px;
  margin-top: 20px;
  min-width: 120px;
`;

class EmailVerification extends React.Component {
  state = {
    verifying: false,
    code: '',
  };

  handleRedButtonClick = async () => {
    this.setState({ verifying: true });
    await Auth.verifyCurrentUserAttribute('email');
  };

  handleOKClick = async () => {
    const { code } = this.state;
    const { emailConfirmed } = this.props;
    await Auth.verifyCurrentUserAttributeSubmit('email', code);
    emailConfirmed();
    this.setState({ verifying: false, code: '' });
  };

  handleCodeChanged(e) {
    const code = e.target.value;
    this.setState({ code });
  }

  render() {
    const { verifying, code } = this.state;
    const { isVerified } = this.props;
    return isVerified ? (
      <div>Active</div>
    ) : (
      <div>
        {verifying ? (
          <StyledInput
            autoFocus
            valid="true"
            centered="true"
            placeholder="CODE"
            value={code}
            onChange={e => this.handleCodeChanged(e)}
          />
        ) : (
          <div>Pending email verification</div>
        )}
        <InvertedButton
          onClick={() =>
            verifying ? this.handleOKClick() : this.handleRedButtonClick()
          }
        >
          {verifying ? `OK` : `Confirm now`}
        </InvertedButton>
      </div>
    );
  }
}

EmailVerification.propTypes = {
  isVerified: PropTypes.bool,
  emailConfirmed: PropTypes.func,
};

export default EmailVerification;
