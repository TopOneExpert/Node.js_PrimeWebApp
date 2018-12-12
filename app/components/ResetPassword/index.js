/**
 *
 * ResetPassword
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import {
  // PaddedH1Text,
  StyledInput,
  BasicButton,
  // BasicSpinner,
} from 'custom-styles';
import { validate, codeIsValid } from 'global-helpers';

/* eslint-disable react/prefer-stateless-function */
class ResetPassword extends React.Component {
  state = {
    code: '',
    password: '',
    passwordValid: '',
  };

  handleInputChange(e, name) {
    const { value } = e.target;
    // console.log(`handleInputChange() value: ${value}, name: ${name}`);
    this.setState({
      [name]: value,
      [`${name}Valid`]: validate(value, name),
    });
  }

  componentDidMount = async () => {
    const { username } = this.props;
    // reset password, sends SMS code
    await Auth.forgotPassword(username);
  };

  confirm = async (code, newPassword) => {
    const { username, onSuccess } = this.props;
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      // go to the login page and tab
      onSuccess();
    } catch (passwordResetError) {
      console.log(
        `ResetPassword.componentDidMount() passwordResetError: ${passwordResetError}`,
      );
    }
  };

  render() {
    const { code, password, passwordValid } = this.state;
    const { username } = this.props;
    return (
      <div>
        <br />
        <div>reset code sent to {username}</div>
        <StyledInput
          valid
          centered
          autoFocus
          placeholder="CODE"
          onChange={e => this.handleInputChange(e, 'code')}
        />
        <StyledInput
          centered
          valid={passwordValid}
          type="password"
          placeholder="new password"
          value={password}
          onChange={e => this.handleInputChange(e, 'password')}
        />
        <br />
        <br />
        <BasicButton
          variant="dark"
          disabled={!codeIsValid(code)}
          onClick={() => this.confirm(code, password)}
        >
          Confirm
        </BasicButton>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  username: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default ResetPassword;
