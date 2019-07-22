/**
 *
 * LoginPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { withAlert } from 'react-alert';
import { Tabs, Tab } from 'react-bootstrap';
import ResetPassword from 'components/ResetPassword';
import FacebookButton from 'components/FacebookButton';
import {
  PaddedH1Text,
  StyledInput,
  LoginContainer,
  PageContainer,
  BasicButton,
  BasicSpinner,
} from 'custom-styles';
import {
  resetUserData,
  resetValidations,
  validate,
  codeIsValid,
  validatePhone,
} from 'global-helpers';

const SignupText = () => <PaddedH1Text>Register</PaddedH1Text>;
const LoginText = () => <PaddedH1Text>Login</PaddedH1Text>;
const ConfirmText = () => <PaddedH1Text>Verification</PaddedH1Text>;

/* eslint-disable react/prefer-stateless-function */
class LoginPage extends React.Component {
  state = {
    tab: 'login',
    loading: false,
    resetPassword: false,
    code: '',
    ...resetUserData,
    ...resetValidations,
  };

  componentDidMount() {
    const { cellphone } = this.state;
    this.setState(
      {
        ...validatePhone(cellphone),
        ...this.validateThese(Object.keys(resetUserData)),
      },
    );
  }

  validateThese(names) {
    const validations = {};
    names.map(name => {
      validations[`${name}Valid`] = validate(this.state[name], name);
      return null;
    });
    return validations;
  }

  loginValid() {
    const { passwordValid, emailValid } = this.state;
    return passwordValid && emailValid;
  }

  signupValid() {
    const {
      passwordValid,
      firstnameValid,
      lastnameValid,
      cellphoneValid,
      emailValid,
    } = this.state;

    return (
      passwordValid &&
      firstnameValid &&
      lastnameValid &&
      cellphoneValid &&
      emailValid
    );
  }

  testTabValidations(tab) {
    switch (tab) {
      case 'login':
        return this.validateThese(['email', 'password']);
      case 'signup':
        return this.validateThese([
          'email',
          'password',
          'firstname',
          'lastname',
          'cellphone',
        ]);
      case 'confirm':
        return this.validateThese(['email', 'code']);
      default:
        return resetValidations;
    }
  }

  handleTabClick(tab) {
    const { cellphone } = this.state;
    this.setState({
      tab,
      ...resetUserData,
      ...validatePhone(cellphone),
      ...this.testTabValidations(tab),
    });
  }

  handleInputChange(e, name) {
    const { value } = e.target;
    this.setState({
      [name]: value,
      [`${name}Valid`]: validate(value, name),
    });
  }

  handlePhoneChange(e) {
    const { value: number } = e.target;
    // const cellphone =
    //   (value && value !== '' && value.match(/\d/g).join('')) || '';
    this.setState({
      ...validatePhone(number),
    });
  }

  handleType = async (e, code) => {
    // make sure the type matches
    if (e.code === code) {
      switch (e.code) {
        case 'PasswordResetRequiredException':
          this.setState({ resetPassword: true });
          break;
        default:
          break;
      }
    }
    return null;
  };

  handleLoginClick = async event => {
    const { email, password } = this.state;
    event.preventDefault();

    this.setState({ loading: true });
    try {
      await Auth.signIn(email, password);
      this.props.userHasAuthenticated(true);
      this.setState({ loading: false });
    } catch (e) {
      this.handleType(e, 'PasswordResetRequiredException');

      this.props.alert.error(<div style={{ color: 'white' }}>{e.message}</div>);
      this.setState({ loading: false });
    }
  };

  handleSignupClick = async () => {
    const { password, firstname, lastname, cellphone, email } = this.state;
    const signUpParams = {
      username: email,
      // username: `+1${cellphone}`,
      // username: email,
      password,
      attributes: {
        email,
        given_name: firstname,
        family_name: lastname,
        phone_number: cellphone,
      },
    };

    this.setState({ loading: true });

    try {
      await Auth.signUp(signUpParams);
      // only reachable if success in signing up
      this.setState({ tab: 'confirm', loading: false });
    } catch (signUpError) {
      if (signUpError.code === 'UsernameExistsException') {
        console.error(
          `handleSignupClick() UsernameExistsException: ${signUpError.message}`,
        );
        this.setState({ tab: 'login' }, () =>
          this.props.alert.show(
            <div style={{ color: 'white' }}>{signUpError.message}</div>,
          ),
        );
        return;
      }
      console.error(
        `handleSignupClick() signUpError: ${signUpError.message ||
        signUpError}`,
      );
    }
  };

  handleResendCode = async () => {
    const { email } = this.state;
    try {
      await Auth.resendSignUp(email);
    } catch (resendError) {
      console.log(resendError);
      this.props.alert.show(
        <div style={{ color: 'white' }}>{resendError.message}</div>,
      );
    }
  }

  handleConfirmation = async () => {
    const { code, email, password } = this.state;
    if (code && codeIsValid(code)) {
      // call cognito with username and code
      // const resConfirm = await Auth.confirmSignUp(`+1${cellphone}`, code, {
      try {
        this.setState({ loading: true });
        await Auth.confirmSignUp(email, code);
        await Auth.signIn(email, password);
        this.setState({ loading: false });
        this.props.userHasAuthenticated(true);
      } catch (confirmationError) {
        this.props.alert.show(
          <div style={{ color: 'white' }}>Code is not valid</div>,
        );
      }
    } else {
      this.props.alert.show(
        <div style={{ color: 'white' }}>Code is not valid</div>,
      );
    }
  };

  handleFbLogin = () => {
    this.props.userHasAuthenticated(true, { facebook: true });
  };

  render() {
    const {
      code,
      tab,
      password,
      firstname,
      lastname,
      cellphone,
      email,
      passwordValid,
      firstnameValid,
      lastnameValid,
      cellphoneValid,
      emailValid,
      loading,
      resetPassword,
    } = this.state;

    const HeaderText = () => {
      switch (tab) {
        case 'signup':
          return <SignupText />;
        case 'login':
          return <LoginText />;
        case 'confirm':
          return <ConfirmText />;
        default:
          break;
      }
      return null;
    };

    return (
      <PageContainer>
        <LoginContainer>
          <HeaderText />
          {loading ? <BasicSpinner className="fa-4x fa-spin" /> : null}
          {resetPassword ? (
            <ResetPassword
              username={email}
              phone={cellphone}
              onSuccess={() => this.setState({ resetPassword: false })}
            />
          ) : (
            <Tabs activeKey={tab} onSelect={key => this.handleTabClick(key)}>
              <Tab
                title="Login"
                eventKey="login"
                bsstyles={{ outline: 'none' }}
              >
                <br />
                <FacebookButton onLogin={() => this.handleFbLogin()} />
                <hr />
                {!emailValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20  }}>Please insert correct email address</div>}
                <StyledInput
                  centered="true"
                  valid={`${emailValid}`}
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={e => this.handleInputChange(e, 'email')}
                />
                {!passwordValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20  }}>Password must include at least one capital and be at least 8 letter...</div>}
                <StyledInput
                  centered="true"
                  valid={`${passwordValid}`}
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={e => this.handleInputChange(e, 'password')}
                />
                <br />
                <br />
                <BasicButton
                  variant="dark"
                  onClick={e => this.handleLoginClick(e)}
                  disabled={!this.loginValid()}
                >
                    Login
                </BasicButton>
              </Tab>
              <Tab title="Signup" eventKey="signup">
                <br />
                {!emailValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20  }}>Please insert correct email address</div>}
                <StyledInput
                  centered="true"
                  valid={`${emailValid}`}
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={e => this.handleInputChange(e, 'email')}
                />
                {!passwordValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20  }}>Password must include at least one capital and be at least 8 letter...</div>}

                <StyledInput
                  centered="true"
                  valid={`${passwordValid}`}
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={e => this.handleInputChange(e, 'password')}
                />
                {!firstnameValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20  }}>Please insert your first name</div>}

                <StyledInput
                  centered="true"
                  valid={`${firstnameValid}`}
                  type="text"
                  placeholder="firstname"
                  value={firstname}
                  onChange={e => this.handleInputChange(e, 'firstname')}
                />
                {!lastnameValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20  }}>Please insert your last name</div>}

                <StyledInput
                  centered="true"
                  valid={`${lastnameValid}`}
                  type="text"
                  placeholder="lastname"
                  value={lastname}
                  onChange={e => this.handleInputChange(e, 'lastname')}
                />
                {!cellphoneValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20  }}>Please insert your phone number(include your country code with"+")</div>}

                <StyledInput
                  centered="true"
                  valid={`${cellphoneValid}`}
                  type="text"
                  placeholder="cellphone"
                  value={cellphone}
                  onChange={e => this.handlePhoneChange(e)}
                />
                <BasicButton
                  variant="dark"
                  onClick={() => this.handleSignupClick()}
                  style={{ margin: '15px' }}
                  disabled={!this.signupValid()}
                >
                    Create
                </BasicButton>
              </Tab>
              <Tab title="Confirm" eventKey="confirm">
                <br />
                {!emailValid && <div style={{ fontSize: 10, textAlign: 'left', marginLeft: 20, marginRight: 20 }}>Please insert correct email address</div>}

                <StyledInput
                  centered="true"
                  valid={`${emailValid}`}
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={e => this.handleInputChange(e, 'email')}
                />
                <StyledInput
                  valid="true"
                  centered="true"
                  autoFocus
                  placeholder="CODE"
                  onChange={e => this.handleInputChange(e, 'code')}
                />
                <br />
                <BasicButton
                  variant="dark"
                  onClick={() => this.handleResendCode()}
                >
                    Resend Code
                </BasicButton>
                <br />
                <br />
                <BasicButton
                  variant="dark"
                  disabled={!codeIsValid(code)}
                  onClick={() => this.handleConfirmation()}
                >
                    Confirm
                </BasicButton>
              </Tab>
            </Tabs>
          )}
        </LoginContainer>
      </PageContainer>
    );
  }
}

LoginPage.propTypes = {
  alert: PropTypes.object,
  userHasAuthenticated: PropTypes.func,
};

export default withAlert(LoginPage);
