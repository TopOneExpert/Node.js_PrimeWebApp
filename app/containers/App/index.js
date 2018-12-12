/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, withRouter } from 'react-router-dom';

import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ProfilePage from 'components/ProfilePage';
import LoginPage from 'components/LoginPage';
import OrdersPage from 'components/OrdersPage';
import SearchPage from 'components/SearchPage';
import OrderDetails from 'components/OrderDetails';
import Home from 'components/Home';

import { Auth } from 'aws-amplify';
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import config from 'config';
import AppliedRoute from './routing/AppliedRoute';
import AuthenticatedRoute from './routing/AuthenticatedRoute';
import UnauthenticatedRoute from './routing/UnauthenticatedRoute';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  // max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  // padding: 0 16px;
  flex-direction: column;
`;

export const WhiteNavItem = styled(Nav.Item)`
  text-align: center;
  &:hover {
    color: yellow;
  }
`;
export const WhiteNavbar = styled(Navbar)`
  background: #0c2340;
  color: white;
`;
export const WhiteNavbarToggle = styled(Navbar.Toggle)`
  color: white;
  border-color: white;
`;

// export default class App extends React.Component {
class App extends React.Component {
  state = {
    expanded: false,
    isAuthenticated: false,
    isAuthenticating: true,
    isVerified: false,
  };

  async componentDidMount() {
    this.loadFacebookSDK();

    try {
      // const data = await Auth.currentSession();
      const data = await Auth.currentAuthenticatedUser();

      // determine if user is using facebook
      const facebook = !data.hasOwnProperty('attributes');
      // if not using facebook, get the attributes, else use the whole data object
      const attributes = facebook ? data : data.attributes;
      const isAuthenticated = true;
      const isVerified = facebook
        ? {
            facebook,
          }
        : {
            email: attributes.email_verified,
            phone: attributes.phone_number_verified,
          };
      this.setState({ isAuthenticated, isVerified });
    } catch (e) {
      console.log(`App.js/componentDidMount() error ${e}`);
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = (authenticated, options) => {
    // console.log(
    //   `App.js/userHasAuthenticated() options: ${JSON.stringify(options)}`,
    // );
    if (options && options.facebook) {
      const { isVerified } = this.state;
      isVerified.facebook = true;
      this.setState({ isAuthenticated: authenticated, isVerified });
    } else {
      this.setState({ isAuthenticated: authenticated });
    }
  };

  handleLogout = async () => {
    console.log(`handleLogout()`);
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.collapse();
  };

  loadFacebookSDK() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: config.social.FB,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.1',
      });
    };

    (function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  toggle() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  collapse() {
    this.setState({ expanded: false });
  }

  render() {
    const {
      expanded,
      isAuthenticated,
      isAuthenticating,
      isVerified,
    } = this.state;
    const childProps = {
      isVerified,
      isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated.bind(this),
      phoneConfirmed: () => {
        const { isVerifiedNew } = this.state;
        isVerifiedNew.phone = true;
        this.setState({ isVerified: isVerifiedNew });
      },
      emailConfirmed: () => {
        const { isVerifiedNew } = this.state;
        isVerifiedNew.email = true;
        this.setState({ isVerified: isVerifiedNew });
      },
    };

    // console.log(
    //   `App.js/render() isAuthenticated: ${isAuthenticated}, isVerified: ${JSON.stringify(
    //     isVerified,
    //   )}`,
    // );

    return (
      !isAuthenticating && (
        <AppWrapper>
          <Helmet titleTemplate="%s - Prime X" defaultTitle="Prime X">
            <meta name="description" content="A Prime X application" />
          </Helmet>
          {/* <Header /> */}
          <WhiteNavbar
            sticky="top"
            expand="sm"
            expanded={expanded}
            onToggle={() => console.log(`App.js/render.WhiteNavbar.onToggle()`)}
          >
            <Navbar.Brand>
              <LinkContainer to="/">
                <WhiteNavItem onClick={() => this.collapse()}>
                  PrimeX
                </WhiteNavItem>
              </LinkContainer>
            </Navbar.Brand>
            <WhiteNavbarToggle
              aria-controls="responsive-navbar-nav"
              onClick={() => this.toggle()}
            />
            <Navbar.Collapse className="justify-content-end">
              {isAuthenticated ? (
                <Nav>
                  <LinkContainer to="/search">
                    <WhiteNavItem onClick={() => this.collapse()}>
                      Search
                    </WhiteNavItem>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                    <WhiteNavItem onClick={() => this.collapse()}>
                      Orders
                    </WhiteNavItem>
                  </LinkContainer>
                  <LinkContainer to="/profile">
                    <WhiteNavItem onClick={() => this.collapse()}>
                      Profile
                    </WhiteNavItem>
                  </LinkContainer>
                  <WhiteNavItem onClick={() => this.handleLogout()}>
                    Logout
                  </WhiteNavItem>
                </Nav>
              ) : (
                <Nav>
                  <LinkContainer to="/login">
                    <WhiteNavItem onClick={() => this.collapse()}>
                      Login
                    </WhiteNavItem>
                  </LinkContainer>
                </Nav>
              )}
            </Navbar.Collapse>
          </WhiteNavbar>
          <Switch>
            {isAuthenticated &&
            ((isVerified.email && isVerified.phone) || isVerified.facebook) ? (
                <AuthenticatedRoute
                  exact
                  path="/"
                  component={OrdersPage}
                  props={childProps}
                />
              ) : (
                <AppliedRoute
                  exact
                  path="/"
                  component={Home}
                  props={childProps}
                />
              )}
            <UnauthenticatedRoute
              exact
              path="/login"
              component={LoginPage}
              props={childProps}
            />
            <AuthenticatedRoute
              exact
              path="/search"
              component={SearchPage}
              props={childProps}
            />
            <AuthenticatedRoute
              exact
              path="/orders"
              component={OrdersPage}
              props={childProps}
            />
            <AuthenticatedRoute
              exact
              path="/order/:orderID"
              component={OrderDetails}
              props={childProps}
            />
            <AuthenticatedRoute
              exact
              path="/profile"
              component={ProfilePage}
              props={childProps}
            />
            <Route path="" component={NotFoundPage} props={childProps} />
          </Switch>
          {/* <Footer /> */}
          <GlobalStyle />
        </AppWrapper>
      )
    );
  }
}

export default withRouter(App);
