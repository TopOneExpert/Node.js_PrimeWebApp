/**
 *
 * BuyerUi
 *
 */

import React from 'react';
import { API, Auth } from 'aws-amplify';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import {
  BasicContainer,
  BasicRow,
  BasicCol,
  BasicCard,
  InvertedButtonMargin,
  BasicSpinner,
  StyledNumericInput,
} from 'custom-styles';

const BuyerCard = styled(BasicCard)`
  // background: lightgray;
  margin: 10px;
`;
const ButtonCol = styled(BasicCol)`
  // padding: 10px;
`;

class BuyerUi extends React.Component{
  state = {
    state: null,
    loading: true,
    offer: false,
    rate: 1,
  }

  async componentDidMount(){
    const { order: { orderId, content: { rate } } } = this.props
    // check if this user has made an offer
    const { params: { IdentityId: userId } } = await Auth.currentUserCredentials();
    // const { authenticated } = await Auth.currentUserCredentials();
    this.setState({ orderId }, async ()=>{
      try{
        const neg = await API.get('notes', `/notes/neg/${orderId}`);
        if(neg){
          const {content: {buyers: { [userId]: state }}} = neg
          this.setState({state, loading: false, rate, liveRate: rate})
        }else{
          this.setState({loading: false, rate, liveRate: rate})
        }
      }catch (negError){
        console.log('negError')
        console.log(negError)
      }
    })
  }

  async handleAccept(){
    const { orderId, state } = this.state
    console.log(`handleAccept() orderId: ${orderId}`)
    try{
      const neg = await API.put('notes',`/notes/neg/${orderId}`,{
        body: { state: 'accepted' },
      })
      if(neg){
        // const {Attributes: {content: {seller: { rate }}}} = neg
        state.state = 'accepted'
        this.setState({ state, loading: false})
      }
    }catch (putError){
      console.log('putError')
      console.log(putError)
    }
  }

  async handleOffer(){
    const { offer, rate, orderId } = this.state
    console.log(`handleOffer() ${offer} ${orderId}`)
    if(offer===true){
      // buyer is suggesting a new exchange rate
      console.log(`do a post call with neg update: ${rate}, state: negotiating buyer`)
      const neg = await API.put('notes',`/notes/neg/${orderId}`,{
        body: { state: 'negotiating buyer', rate },
      })
      console.log(`handleOffer() neg`)
      console.log(neg)
      this.setState({offer: false, state: {state:'negotiating buyer', rate}})
    }else{
      // buyer clicked on the Make offer button
      this.setState({offer: true})
    }
  }

  handleRateChange(e){
    const { target: {value: rate} } = e
    const { liveRate } = this.state
    if(liveRate * 0.8 < rate && rate < liveRate * 1.2){
      console.log(`handleRateChange() ${rate}`)
      this.setState({rate})
    }
  }

  render(){
    const { state, loading, offer, rate } = this.state

    console.log({ state, loading, offer, rate })

    return (
      <BuyerCard>
        {loading ? (
          <BasicSpinner className="fa-4x fa-spin" />
        ) : (
          <BasicContainer>
            <BasicRow>
              <ButtonCol>
                {offer!==true && (!state || state.state === 'negotiating seller') ? (
                  <InvertedButtonMargin
                    onClick={()=>this.handleAccept()}
                  >Accept</InvertedButtonMargin>
                ) : null}
                {offer===true ? (
                  <StyledNumericInput
                    centered="true"
                    value={rate}
                    step={0.00001}
                    onChange={e => this.handleRateChange(e)}
                  />
                ) : null}
              </ButtonCol>
            </BasicRow>
            <BasicRow>
              <ButtonCol>
                {!state ? (
                  <InvertedButtonMargin
                    onClick={()=>this.handleOffer()}
                  >{offer===true ? `Suggest rate` : `Make offer`}</InvertedButtonMargin>
                ) : null}
              </ButtonCol>
            </BasicRow>
            <BasicRow>
              <ButtonCol>
                { state && state.state === 'negotiating buyer' ? <div>Offered rate: {state.rate}<br/>Waiting for seller to respond.</div> : null }
                { state && state.state === 'negotiating seller' ? <div>Seller offered rate: {state.rate}</div> : null }
                { state && state.state === 'accepted' ? <div>This order is completed.<br/>You and the seller both accepted rate: {state.rate || rate}</div> : null }
              </ButtonCol>
            </BasicRow>
          </BasicContainer>
        )}
      </BuyerCard>
    )
  }
}

BuyerUi.propTypes = {};

export default BuyerUi;
