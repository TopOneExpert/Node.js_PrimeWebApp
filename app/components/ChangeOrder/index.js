/**
 *
 * ChangeOrder
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { API } from 'aws-amplify';
import OrderEntry from 'components/OrderEntry';
import {
  BasicButton,
  BasicButtonGroup,
  StyledRowBase,
  StyledColBase,
  RowOrderInput,
} from 'custom-styles';

const RowOrderInputChange = styled(RowOrderInput)`
  height: ${props => (props.animate === 'true' ? '250px' : '0')};
`;

const StyledRowTop = styled(StyledRowBase)`
  padding: 5px;
`;
const ColOrder = styled(StyledColBase)``;

/* eslint-disable react/prefer-stateless-function */
class ChangeOrder extends React.Component {
  state = {
    creating: false,
    loading: false,
  };

  // componentDidMount() {
  //   const { order } = this.props;
  //   this.setState({ ...order });
  // }

  handleChangeClick() {
    this.setState({ creating: true });
  }

  startCreating() {
    this.setState({ loading: true });
  }

  handleCreated() {
    this.setState({ creating: false, loading: false });
  }

  handleCanceled() {
    this.setState({ creating: false, loading: false });
  }

  handleDelete = async () => {
    const { order } = this.props;
    try {
      if (order.orderStatus === 'active') {
        order.orderStatus = 'canceled';
        // change orderStatus to 'canceled' at first
        await API.put('notes', `/notes/${order.id}`, {
          body: { content: order },
        });
        // move the order to the canceled list
        order.moveToCanceled();
      } else {
        await API.del('notes', `/notes/${order.id}`);
        // remove this order card from the UI
        order.deleteFromUI();
      }
    } catch (e) {
      console.error(`ChangeOrder.handleDelete() ERROR: ${e}`);
    }
  };

  render() {
    const { noChange, order } = this.props;
    const { loading, creating } = this.state;
    return (
      <StyledRowTop>
        <ColOrder sm>
          <StyledRowBase>
            <ColOrder sm>
              <BasicButtonGroup>
                {creating || noChange ? null : (
                  <BasicButton
                    small="true"
                    variant="dark"
                    onClick={() => this.handleChangeClick()}
                    disabled={loading}
                  >
                    Change
                  </BasicButton>
                )}
                {creating ? null : (
                  <BasicButton
                    small="true"
                    variant="outline-dark"
                    disabled={loading}
                    onClick={() => this.handleDelete()}
                  >
                    Delete
                  </BasicButton>
                )}
              </BasicButtonGroup>
            </ColOrder>
          </StyledRowBase>
          <RowOrderInputChange animate={`${creating}`}>
            {creating ? (
              <OrderEntry
                mode="update"
                order={order}
                handleCreated={() => this.handleCreated()}
                handleCanceled={() => this.handleCanceled()}
              />
            ) : null}
          </RowOrderInputChange>
        </ColOrder>
      </StyledRowTop>
    );
  }
}

ChangeOrder.propTypes = {
  order: PropTypes.object,
  noChange: PropTypes.bool,
};

export default ChangeOrder;
