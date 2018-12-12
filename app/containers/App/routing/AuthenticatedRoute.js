import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: C, props: cProps, ...rest }) => {
  const authenticated = cProps.isAuthenticated;

  // console.log(
  //   `AuthenticatedRoute.main() cProps.isVerified: ${JSON.stringify(
  //     cProps.isVerified,
  //   )}`,
  // );

  const verified =
    (cProps.isVerified.email && cProps.isVerified.phone) ||
    cProps.isVerified.facebook ||
    rest.location.pathname === '/profile';

  return (
    <Route
      {...rest}
      render={props => {
        if (authenticated) {
          if (verified) {
            return <C {...props} {...cProps} />;
          }
          return <Redirect to="/profile" {...props} {...cProps} />;
        }
        return <Redirect to="/login" />;
      }}
    />
  );
};
