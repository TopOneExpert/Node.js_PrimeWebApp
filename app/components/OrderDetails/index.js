/**
 *
 * OrderDetails
 *
 */

import React from 'react';
import { Auth, API } from 'aws-amplify';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import OrderSummaryCard from 'components/OrderSummaryCard';
import BuyerUi from 'components/BuyerUi';
import SellerUi from 'components/SellerUi';
import RateUser from 'components/RateUser';
import {
  PageContainer,
  FloatingContainer,
  PaddedH1Text,
  BasicSpinner,
  BasicContainer,
  BasicRow,
  BasicCol,
} from 'custom-styles';

/* eslint-disable react/prefer-stateless-function */
class OrderDetails extends React.Component {
  state = {
    order: {},
    loading: true,
    seller: false,
  };

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const { orderID } = params;
    try {
      const order = await API.get('notes', `/notes/${orderID}`);
      const { params: { IdentityId } } = await Auth.currentUserCredentials();
      const seller = order.userId === IdentityId
      const loading = false

      this.setState({ order, loading, seller });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { order, loading, seller } = this.state;
    return (
      <PageContainer style={{ fontSize: 'normal' }}>
        <FloatingContainer>
          <PaddedH1Text>ORDER DETAILS</PaddedH1Text>
          {loading ? (
            <BasicSpinner className="fa-4x fa-spin" />
          ) : (
            <BasicContainer>
              <BasicRow>
                <BasicCol>
                  <OrderSummaryCard order={order} />
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <BasicCol>
                  <RateUser seller={seller} order={order}/>
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <BasicCol>
                  {seller ? <SellerUi order={order}/> : <BuyerUi order={order}/> }
                </BasicCol>
              </BasicRow>
            </BasicContainer>
          )}
        </FloatingContainer>
      </PageContainer>
    );
  }
}


OrderDetails.propTypes = {};

export default OrderDetails;
