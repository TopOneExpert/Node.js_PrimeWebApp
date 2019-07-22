/**
 *
 * FacebookButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InvertedButton } from 'custom-styles';
import { Auth } from 'aws-amplify';
import { withAlert } from 'react-alert';
import { withOAuth } from 'aws-amplify-react';

// export const FacebookButtonButton = styled.button`
export const FacebookButtonButton = styled(InvertedButton)`
  // background: blue;
  color: white;
  width: 90%;
  line-height: 2em;
`;

const waitForInit = () =>
  new Promise(resolve => {
    const hasFbLoaded = () => {
      if (window.FB) {
        resolve();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
/* eslint-disable react/prefer-stateless-function */
class FacebookButton extends React.Component {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    waitForInit().then(() => this.setState({ isLoading: false }));
  }

  handleResponse(data) {
    // get the email
    window.FB.api(
      '/me',
      { fields: ['email', 'first_name', 'last_name'] },
      async ({ email, first_name: firstName, last_name: lastName }) => {
        const { accessToken: token, expiresIn } = data;
        const expiresAt = expiresIn * 100000 + new Date().getTime();

        const user = { email, given_name: firstName, family_name: lastName };

        this.setState({ isLoading: true });

        try {
          const response = await Auth.federatedSignIn(
            'facebook',
            { token, expiresAt },
            user,
          );
          this.props.onLogin(response);
        } catch (e) {
          this.handleError(e);
        }

        this.setState({ isLoading: false });
      },
    );
  }

  handleError(error) {
    console.error(`FacebookButton.handleError() ERROR: ${JSON.stringify(error)}`);
    // this.props.alert.show(
    //   <div style={{ color: 'white' }}>{JSON.stringify(error)}</div>,
    // )
  }

  statusChangeCallback = response => {
    console.log(response);
    if (response.status === 'connected') {
      this.handleResponse(response.authResponse);
    } else {
      this.handleError(response);
    }
  };

  checkLoginState = () => {
    window.FB.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = () => {
    window.FB.login(this.checkLoginState, {
      scope: 'public_profile,email',
    });
  };

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        {
          <FacebookButtonButton
            onClick={this.handleClick}
            disabled={isLoading}
            variant="dark"
          >
            Login with Facebook
          </FacebookButtonButton>
        }
        {/*        <FacebookButtonButton onClick={this.props.OAuthSignIn}>
        </FacebookButtonButton> */}
      </div>
    );
  }
}

FacebookButton.propTypes = {
  onLogin: PropTypes.func,
};

export default withAlert(withOAuth(FacebookButton));
