/**
 *
 * RateUser
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { API } from 'aws-amplify';
import FiveStar from 'components/FiveStar';
import {
  BasicContainer,
  BasicRow,
  BasicCol,
  GenericCard,
  InlineSpinner,
  InlineCheck,
} from 'custom-styles';

/* eslint-disable react/prefer-stateless-function */
class RateUser extends React.Component {

  state = {
    loading: false,
    rated: false,
  }

  componentDidMount(){
    const { order: { sellerRated, buyerRated }, seller } = this.props
    // console.dir({ sellerRated, buyerRated, seller })
    if( (!seller && sellerRated) || (seller && buyerRated)){
      this.setState({rated: true})
    }
  }

  rateUser = (rating) => {
    const { order: { userId: sellerId, buyerId, orderId, sellerRated, buyerRated }, seller } = this.props
    const userId = seller ? buyerId : sellerId

    if( (!seller && !sellerRated) || (seller && !buyerRated)){
      // able to rate
      this.setState({loading: true, rated: false}, async ()=>{
        await API.post('notes','/notes/userrating', {body: { userId, orderId, rating, role: seller ? 'buyer' : 'seller' }})
        this.setState({loading: false, rated: true})
      })
    }
  }

  // { order.orderStatus === 'completed' && ( seller ? !buyerRated : !sellerRated ) ? (
  render() {
    const { order: { content: order }, seller } = this.props
    const { loading, rated } = this.state
    return (
      <BasicContainer>
        { order.orderStatus === 'completed' ? (
          <GenericCard>
            <BasicContainer>
              <BasicRow>
                {loading ? (
                  <BasicCol>
                    <InlineSpinner className="fa-4x fa-spin" />
                  </BasicCol>
                ) : (
                  rated ? (
                    <BasicCol>
                      <InlineCheck className="fa-4x"/>
                    </BasicCol>
                  ) : (
                    <BasicCol>
                    Please rate this { !seller ? 'seller' : 'buyer' }:
                      <FiveStar
                        reportRating={rating => this.rateUser(rating)}
                        changeable
                      />
                    </BasicCol>
                  )
                )}
              </BasicRow>
            </BasicContainer>
          </GenericCard>)
          : 
          null 
        }
      </BasicContainer>
    );
  }
}

RateUser.propTypes = {
  order: PropTypes.object,
  seller: PropTypes.bool,
};

export default RateUser;
