/**
 *
 * CreateNewOrder
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { Col, Row, Container, ButtonGroup } from 'react-bootstrap';
import { withAlert } from 'react-alert';
import OrderEntry from 'components/OrderEntry';
import {
  StyledRowBase,
  StyledRowTop,
  StyledColBase,
  CreateNewButton,
  RowOrderInput,
} from 'custom-styles';

/* eslint-disable react/prefer-stateless-function */
class CreateNewOrder extends React.Component {
  state = {
    creating: false,
  };

  handleCreateNew() {
    this.setState({ creating: true });
  }

  handleCreated(order) {
    const { appendOrder } = this.props;
    appendOrder(order);
    this.setState({ creating: false });
  }

  handleCanceled() {
    this.setState({ creating: false });
  }

  render() {
    const { creating } = this.state;
    return (
      <StyledRowTop>
        <StyledColBase sm>
          <StyledRowBase>
            <StyledColBase sm>
              {creating ? null : (
                <CreateNewButton
                  variant="dark"
                  onClick={() => this.handleCreateNew()}
                >
                  Create New
                </CreateNewButton>
              )}
            </StyledColBase>
          </StyledRowBase>
          <RowOrderInput animate={`${creating}`}>
            {creating ? (
              <OrderEntry
                mode="create"
                handleCreated={order => this.handleCreated(order)}
                handleCanceled={() => this.handleCanceled()}
              />
            ) : null}
          </RowOrderInput>
        </StyledColBase>
      </StyledRowTop>
    );
  }
}

CreateNewOrder.propTypes = {
  appendOrder: PropTypes.func,
};

export default withAlert(CreateNewOrder);
