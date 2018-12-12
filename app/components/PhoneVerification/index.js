/**
 *
 * PhoneVerification
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import styled from 'styled-components';

import { BasicButton, StyledInput } from 'custom-styles';

const PendingButton = styled(BasicButton)`
  background: red;
  color: white;
  padding: 10px;
  margin-top: 20px;
  min-width: 120px;
`;

class PhoneVerification extends React.Component {
  state = {
    verifying: false,
    code: '',
  };

  handleRedButtonClick = async () => {
    this.setState({ verifying: true });
    await Auth.verifyCurrentUserAttribute('phone_number');
  };

  handleOKClick = async () => {
    const { code } = this.state;
    const { phoneConfirmed } = this.props;
    await Auth.verifyCurrentUserAttributeSubmit('phone_number', code);
    phoneConfirmed();
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
            valid
            centered
            placeholder="CODE"
            value={code}
            onChange={e => this.handleCodeChanged(e)}
          />
        ) : (
          <div>Pending phone verification</div>
        )}
        <PendingButton
          onClick={() =>
            verifying ? this.handleOKClick() : this.handleRedButtonClick()
          }
        >
          {verifying ? `OK` : `Confirm now`}
        </PendingButton>
      </div>
    );
  }
}

PhoneVerification.propTypes = {
  isVerified: PropTypes.bool,
  phoneConfirmed: PropTypes.func,
};

export default PhoneVerification;
