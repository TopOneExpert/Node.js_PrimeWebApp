/**
 *
 * OneOrderDetails
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
// import styled from 'styled-components';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import ChangeOrder from 'components/ChangeOrder';
import { StyledCard } from 'custom-styles';

/* eslint-disable react/prefer-stateless-function */
class OneOrderDetails extends React.Component {

  state = {
    redirect: false,
  }

  goTo(link){
    this.setState({redirect: link})
  }

  render() {
    const { order, noChange } = this.props;
    const { redirect } = this.state;
    // console.log(order)
    const { buyCurrency, sellCurrency, rate, sellAmount, dateBy } = order;
    return redirect ? (<Redirect to={redirect} />) : (
      <StyledCard valid="true">
        <Row onClick={()=>this.goTo(`/order/${order.id}`)}>
          <Col sm>
            <Row>
              <Col>Have: {sellCurrency}</Col>
              <Col>Need: {buyCurrency}</Col>
            </Row>
            <Row>
              <Col>Amount: {parseFloat(sellAmount).toFixed(2)}</Col>
              <Col>
                Amount: {(parseFloat(sellAmount) / parseFloat(rate)).toFixed(2)}
              </Col>
            </Row>
            <Row>
              <Col>
                Expires:{' '}
                {moment(dateBy)
                  .toDate()
                  .toLocaleDateString()}
              </Col>
              <Col>Rate: {rate}</Col>
            </Row>
          </Col>
        </Row>
        <ChangeOrder noChange={noChange} order={order} />
      </StyledCard>
    );
  }
}

OneOrderDetails.propTypes = {
  order: PropTypes.object,
  noChange: PropTypes.bool,
};

export default OneOrderDetails;
