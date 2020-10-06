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
import './custom.css';

const SignupText = () => <PaddedH1Text>Register</PaddedH1Text>;
const LoginText = () => <PaddedH1Text>Login</PaddedH1Text>;
const ConfirmText = () => <PaddedH1Text>Verification</PaddedH1Text>;
const ForgetText = () => <PaddedH1Text>Forget Password</PaddedH1Text>;

const google_btn_style = {
  width: '90%',
  margin: '6px 0px',
  color: '#fff',
  backgroundColor: '#828282',
  border: '1px solid #828282',
  borderRadius: '4px',
  lineHeight: '2.6em',
};

const forget_btn = {
  float: 'left',
  paddingLeft: '15px',
};

const none = {
  display: 'none',
}

/* eslint-disable react/prefer-stateless-function */
class LoginPage extends React.Component {
  state = {
    tab: 'login',
    loading: false,
    resetPassword: false,
    isForgotPassword: false,
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
      await this.props.userHasAuthenticated(true);
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
        await this.props.userHasAuthenticated(true);
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

  handleSocialLogin = async (social) => {
    await Auth.federatedSignIn({provider: social});
    // this.props.collapse();
  }

  handleForgetPassword() {
    this.setState({ tab: 'forget', });
  }

  handleSendVerificationCode = async () => {
    const { email, isForgotPassword } = this.state;
    Auth.currentAuthenticatedUser({
      bypassCache: false
    }).then((user) => {
      console.log("current user: ", user);
    });
    this.setState({ loading: true });
    await Auth.forgotPassword(email).then((res) => {
      console.log("success: ", res);
      this.setState({
        loading: false,
        isForgotPassword: !isForgotPassword,
      })
    }, err => {
      console.log('err: ', err);
    })
  }

  handleConfirmForgetPassword = async () => {
    const {email, password, code } = this.state;
    this.setState({ loading: true });
    console.log("email, code, password", email, code, password);
    await Auth.forgotPasswordSubmit(email, code, password).then(async () => {
      await Auth.signIn(email, password).then(async (res) => {
        console.log("successful changed", res);
        this.setState({
          loading: false,
          isForgotPassword: !this.isForgotPassword,
        })
        await this.props.userHasAuthenticated(true);
      }, err => {
        this.props.alert.show(
          <div style={{ color: 'white' }}>Login Error</div>,
        );
        this.setState({ loading: false });
      });
    }, err => {
      this.props.alert.show(
        <div style={{ color: 'white' }}>Confirmation Error</div>,
      );
      this.setState({ loading: false });
    });
  }

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
      isForgotPassword
    } = this.state;

    const HeaderText = () => {
      switch (tab) {
        case 'signup':
          return <SignupText />;
        case 'login':
          return <LoginText />;
        case 'confirm':
          return <ConfirmText />;
        case 'forget':
          return <ForgetText />;
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
                
                <button style={google_btn_style} className="social" onClick={() => this.handleSocialLogin('Google')}> Login with Google </button>
                <button style={google_btn_style} className="social" onClick={() => this.handleSocialLogin('Facebook')}> Login with Facebook </button>
               
                <hr />
                <StyledInput
                  centered="true"
                  valid={`${emailValid}`}
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={e => this.handleInputChange(e, 'email')}
                />
                <StyledInput
                  centered="true"
                  valid={`${passwordValid}`}
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={e => this.handleInputChange(e, 'password')}
                />

                <a className="clickable" onClick={() => this.handleForgetPassword()} style={forget_btn}> forgot password </a>
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
                <StyledInput
                  centered="true"
                  valid={`${emailValid}`}
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={e => this.handleInputChange(e, 'email')}
                />
                <StyledInput
                  centered="true"
                  valid={`${passwordValid}`}
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={e => this.handleInputChange(e, 'password')}
                />
                <StyledInput
                  centered="true"
                  valid={`${firstnameValid}`}
                  type="text"
                  placeholder="firstname"
                  value={firstname}
                  onChange={e => this.handleInputChange(e, 'firstname')}
                />
                <StyledInput
                  centered="true"
                  valid={`${lastnameValid}`}
                  type="text"
                  placeholder="lastname"
                  value={lastname}
                  onChange={e => this.handleInputChange(e, 'lastname')}
                />
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
                <br />
                <BasicButton
                  variant="dark"
                  disabled={!codeIsValid(code)}
                  onClick={() => this.handleConfirmation()}
                >
                  Confirm
                </BasicButton>
              </Tab>

              <Tab title="Forgot?" eventKey="forget">
                <br />
                {isForgotPassword ? '': 
                  <StyledInput
                    centered="true"
                    valid={`${emailValid}`}
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={e => this.handleInputChange(e, 'email')}
                  />
                }
                {isForgotPassword ?
                  <StyledInput
                    valid="true"
                    centered="true"
                    autoFocus
                    placeholder="CODE"
                    onChange={e => this.handleInputChange(e, 'code')}
                  /> : ''
                }
                {isForgotPassword ? 
                  <StyledInput
                    centered="true"
                    valid={`${passwordValid}`}
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={e => this.handleInputChange(e, 'password')}
                  /> : ''
                }

                <br /> <br />
                {!isForgotPassword ?
                  <BasicButton
                    variant="dark"
                    disabled={!emailValid}
                    onClick={() => this.handleSendVerificationCode()}
                  >
                    Submit
                  </BasicButton> :
                  <BasicButton
                    variant="dark"
                    disabled={!emailValid || !codeIsValid(code)}
                    onClick={() => this.handleConfirmForgetPassword()}
                  >
                    Confirm
                  </BasicButton>
                }
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
  collapse: PropTypes.func,
};

export default withAlert(LoginPage);
