/**
 *
 * OrdersPage
 *
 */

import React from 'react';
// import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import CreateNewOrder from 'components/CreateNewOrder';
import CustomAccordion from 'components/CustomAccordion';
import { API } from 'aws-amplify';

import 'react-light-accordion/demo/css/index.css';
import './accordion-styles-overrides.css';
import {
  PageContainer,
  BasicSpinner,
  FloatingContainer,
  PaddedH1Text,
  LabelLeftSide,
  StyledRowBase,
  StyledColBase,
} from 'custom-styles';

/* eslint-disable react/prefer-stateless-function */
class OrdersPage extends React.Component {
  state = {
    creating: true,
    loading: true,
  };

  componentDidMount = async () => {
    // get the orders from DB
    const {
      activeOrders,
      completedOrders,
      canceledOrders,
    } = await this.getOrders();

    this.setState({
      activeOrders,
      canceledOrders,
      completedOrders,
      loading: false,
    });
  };

  filter(list, status) {
    // console.log(`filter() list: ${JSON.stringify(list)}, list.length: ${list.length}`);
    return list
      .filter(o => o.content.orderStatus === status)
      .map((o, index) => ({
        id: o.orderId,
        ...o.content,
        deleteFromUI: () => this.deleteFromUI({ index }),
        moveToCanceled: () => this.moveToCanceled({ index }),
      }));
  }

  updateCallbacks(list) {
    // console.log(`updateCallbacks() list: ${JSON.stringify(list)}, list.length: ${list.length}`);
    return list.map((o, index) => ({
      ...o,
      deleteFromUI: () => this.deleteFromUI({ index }),
      moveToCanceled: () => this.moveToCanceled({ index }),
    }));
  }

  moveToCanceled({ index }) {
    // console.log(`moveToCanceled() index: ${index}`);
    const { canceledOrders } = this.state;
    let { activeOrders } = this.state;
    const canceledOrder = activeOrders.splice(index, 1)[0];
    activeOrders = this.updateCallbacks(activeOrders, 'active');
    canceledOrder.orderStatus = 'canceled';
    canceledOrders.unshift(canceledOrder);
    this.setState({ canceledOrders, activeOrders });
  }

  deleteFromUI({ index }) {
    // console.log(`deleteFromUI() index: ${index}, status: ${status}`);
    let { canceledOrders } = this.state;
    // delete the index from array
    canceledOrders.splice(index, 1);
    if (canceledOrders.length > 0) {
      // console.log(`deleteFromUI() here 1`);
      canceledOrders = this.updateCallbacks(canceledOrders, 'canceled');
      this.setState({ canceledOrders });
    } else {
      // console.log(`deleteFromUI() here 2`);
      this.setState({ canceledOrders: [] }, () =>
        console.log(this.state.canceledOrders),
      );
    }
  }

  getOrders = async () => {
    // const allOrders = await API.get('notes', '/notes');
    const allOrders = await API.post('notes', '/notes/list', {
      body: { showCanceled: true },
    });

    const activeOrders = this.filter(allOrders, 'active');
    const canceledOrders = this.filter(allOrders, 'canceled');
    const completedOrders = this.filter(allOrders, 'completed');

    return {
      activeOrders,
      canceledOrders,
      completedOrders,
    };
  };

  creatingNewOrder() {
    const { creating } = this.state;
    console.log(`creatingNewOrder reset new order details`);
    this.setState({ creating: !creating });
  }

  appendOrder(order) {
    let { activeOrders } = this.state;
    activeOrders.unshift(order);
    activeOrders = this.updateCallbacks(activeOrders, 'active');
    this.setState({ activeOrders });
  }

  render() {
    const {
      loading,
      activeOrders,
      completedOrders,
      canceledOrders,
    } = this.state;
    return (
      <PageContainer>
        <FloatingContainer>
          <PaddedH1Text>Orders</PaddedH1Text>
          <Container>
            <CreateNewOrder appendOrder={order => this.appendOrder(order)} />
            {!loading ? (
              <StyledRowBase>
                <StyledColBase sm>
                  <LabelLeftSide>Active</LabelLeftSide>
                  <CustomAccordion noChange={false} orders={activeOrders} />
                  <LabelLeftSide>Completed</LabelLeftSide>
                  <CustomAccordion noChange orders={completedOrders} />
                  <LabelLeftSide>Canceled</LabelLeftSide>
                  <CustomAccordion noChange orders={canceledOrders} />
                </StyledColBase>
              </StyledRowBase>
            ) : (
              <StyledRowBase>
                <BasicSpinner className="fa-4x fa-spin" />
              </StyledRowBase>
            )}
          </Container>
        </FloatingContainer>
      </PageContainer>
    );
  }
}

OrdersPage.propTypes = {};

export default OrdersPage;
