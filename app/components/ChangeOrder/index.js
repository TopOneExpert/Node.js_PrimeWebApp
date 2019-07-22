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

import Modal from 'react-bootstrap/Modal'

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
    isDialogOpen: false,
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
        this.openDialog();
      } else {
        await API.del('notes', `/notes/${order.id}`);
        // remove this order card from the UI
        order.deleteFromUI();
      }
    } catch (e) {
      console.error(`ChangeOrder.handleDelete() ERROR: ${e}`);
    }
  };

  confirmDelete = async () => {
    const { order } = this.props;

    this.setState({ isDialogOpen: false })
    try {
      order.orderStatus = 'canceled';
      // change orderStatus to 'canceled' at first
      await API.put('notes', `/notes/${order.id}`, {
        body: { content: order },
      });
      // move the order to the canceled list
      order.moveToCanceled();
    } catch (e) {
      console.error(`ChangeOrder.handleDelete() ERROR: ${e}`);
    }
  }

  openDialog = () => this.setState({ isDialogOpen: true })

  handleClose = () => this.setState({ isDialogOpen: false })

  render() {
    const { noChange, order } = this.props;
    const { loading, creating } = this.state;
    return (
      <div>

        <StyledRowTop>
          {
            this.state.isDialogOpen &&
            <Modal
              size="sm"
              show={this.state.isDialogOpen}
              onHide={() => this.handleClose()}
              aria-labelledby="example-modal-sizes-title-sm"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                  Confirmation
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ textAlign: 'right' }}>
                <p style={{ textAlign: 'left' }}>Are you going to delete the order?</p>
                <BasicButton
                  small="true"
                  variant="dark"
                  onClick={() => this.confirmDelete()}
                  disabled={loading}
                  style={{ marginRight: 10 }}
                >
                  OK
                </BasicButton>
                <BasicButton
                  small="true"
                  variant="dark"
                  onClick={() => this.handleClose()}
                  disabled={loading}
                >
                  Cancel
                </BasicButton>
              </Modal.Body>
            </Modal>
          }
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
      </div>

    );
  }
}

ChangeOrder.propTypes = {
  order: PropTypes.object,
  noChange: PropTypes.bool,
};

export default ChangeOrder;
