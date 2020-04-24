/**
 *
 * OrderSummaryCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import FiveStar from 'components/FiveStar';
import {
  BasicContainer,
  BasicRow,
  BasicCol,
  BasicCard,
} from 'custom-styles';

const OrderID = styled.div`
  color: lightgray;
  text-align: center;
`;

const LabelCol = styled(BasicCol)`
  text-align: left;
  padding-left: 20px;
`;

const UserDetailsCard = styled(BasicCard)`
  padding: 10px;
`;

/* eslint-disable react/prefer-stateless-function */
class OrderSummaryCard extends React.Component {
  render() {
    const { order } = this.props
    return (
      <BasicContainer>
        <OrderID>
          {order.orderId}
        </OrderID>
        <BasicRow>
          <BasicCol lg={3} md={2} sm={0} xs={0}>
          </BasicCol>
          <BasicCol lg={6} md={8} sm xs>
            <UserDetailsCard>
              <BasicRow>
                <LabelCol xs>
                    Buy:
                </LabelCol>
                <BasicCol xs>
                  {order.content.buyCurrency}
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <LabelCol xs>
                    Sell:
                </LabelCol>
                <BasicCol xs>
                  {order.content.sellCurrency}
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <LabelCol xs>
                    Amount:
                </LabelCol>
                <BasicCol xs>
                  {order.content.sellAmount}
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <LabelCol xs>
                    Rate:
                </LabelCol>
                <BasicCol xs>
                  {order.content.rate}
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <LabelCol xs>
                    Expires:
                </LabelCol>
                <BasicCol xs>
                  {moment(order.content.dateBy).toDate().toLocaleDateString()}
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <LabelCol xs>
                    User rating:
                </LabelCol>
                <BasicCol xs>
                  <FiveStar changeable={false} selected={order.content.rating} />
                </BasicCol>
              </BasicRow>
              <BasicRow>
                <LabelCol xs>
                    Completed orders:
                </LabelCol>
                <BasicCol xs>
                  {order.content.completedOrders}
                </BasicCol>
              </BasicRow>
            </UserDetailsCard>
          </BasicCol>
        </BasicRow>
      </BasicContainer>
    );
  }
}

OrderSummaryCard.propTypes = {
  order: PropTypes.object,
};

export default OrderSummaryCard;
