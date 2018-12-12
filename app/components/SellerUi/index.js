/**
 *
 * SellerUi
 *
 */

import React from 'react';
import { API } from 'aws-amplify';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import {
  BasicContainer,
  BasicRow,
  BasicCol,
  GenericCard,
  BasicSpinner,
  InvertedButton,
  StyledNumericInput,
} from 'custom-styles';

const ButtonCol = styled(BasicCol)`
  // text-align: left;
  padding: 10px;
`;

/* eslint-disable react/prefer-stateless-function */
class SellerUi extends React.Component {
  state = {
    loading: true,
    buyers: [],
    seller: {},
    rate: 1,
    offering: false,
  }

  async componentDidMount(){
    const { order: { orderId, content: { rate: originalRate } } } = this.props
    console.log(`originalRate: ${originalRate}`)    
    // check if this user has made an offer
    // const { params: { IdentityId: userId } } = await Auth.currentUserCredentials();
    this.setState({ orderId }, async ()=>{
      try{
        const neg = await API.get('notes', `/notes/neg/${orderId}`);
        if(neg){
          const { content: { buyers, seller } } = neg

          if(seller){
            console.log(seller)
            const { rate } = seller
            this.setState({loading: false, seller, rate})
          }else{
            const rate = originalRate
            this.setState({loading: false, buyers, rate})
          }
        }else{
          const rate = originalRate
          this.setState({loading: false, rate})
        }
      }catch (negError){
        console.log('negError')
        console.log(negError)
      }
    })
  }

  handleAccept(buyerId){
    const { orderId } = this.state
    console.log(`handleAccept() orderId: ${orderId}, buyerId: ${buyerId}`)
    this.setState({loading: true}, async ()=>{
      try{
        const neg = await API.put('notes',`/notes/neg/${orderId}`,{
          body: { state: 'accepted', buyerId },
        })
        if(neg){
          const {Attributes: {content: {seller: { rate }}}} = neg
          this.setState({loading: false, rate})
        }
      }catch (putError){
        console.log('putError')
        console.log(putError)
      }
    })
  }

  // seller clicked on the Make counteroffer button
  handleCounteroffer(buyerId, buyerRate){
    const { orderId, rate, offering, buyers } = this.state
    console.log(`handleCounteroffer() buyerId: ${buyerId}, orderId: ${orderId}, rate: ${rate}`)

    if(offering){
      // seller is suggesting a new exchange rate
      this.setState({loading: true}, async ()=>{
        const neg = await API.put('notes',`/notes/neg/${orderId}`,{
          body: { state: 'negotiating seller', rate, buyerId },
        })
        console.log(`handleCounteroffer() neg`)
        console.log(neg)
        buyers[buyerId].rate = rate
        buyers[buyerId].state = 'negotiating seller'
        this.setState({loading: false, buyers})
      })
    }else{
      this.setState({offering: true, rate: buyerRate})
    }
  }

  handleRateChange(e){
    const { target: {value: rate} } = e
    console.log(`handleRateChange() ${rate}`)
    this.setState({rate})
  }

  render(){
    const { loading, buyers, seller, offering, rate } = this.state
    return (
      <div>
        {loading ? (
          <BasicSpinner className="fa-4x fa-spin" />
        ) : (
          <BasicContainer>
            { seller && seller.state === 'accepted' ? (
              <GenericCard>
                <BasicContainer>
                  <BasicRow>
                    <BasicCol>
                      This order is completed.
                      <br/>
                      You and the buyer both accepted rate: {seller.rate}.
                    </BasicCol>
                  </BasicRow>
                </BasicContainer>
              </GenericCard>) : null }
            {
              Object.keys(buyers).map(buyerId=>{
                const buyer = buyers[buyerId]
                return (
                  <GenericCard key={`${buyerId}`}>
                    <BasicContainer>
                      <BasicRow>
                        <ButtonCol>
                          { buyer.state === 'negotiating buyer' ? `A buyer is offering rate: ${buyer.rate}` : null }
                          { buyer.state === 'negotiating seller' ? `You offered rate: ${buyer.rate}. Waiting for buyer.` : null }
                        </ButtonCol>
                        { buyer && buyer.state === 'negotiating buyer' ? 
                          <ButtonCol>
                            <InvertedButton onClick={()=>this.handleCounteroffer(buyerId, buyer.rate)}>{offering ? `Submit` : `Make counteroffer`}</InvertedButton>
                          </ButtonCol>
                          :
                          null
                        }
                        { buyer && buyer.state === 'negotiating buyer' ? 
                          <ButtonCol>
                            {offering ? (
                              <StyledNumericInput
                                centered="true"
                                value={rate}
                                step={0.00001}
                                onChange={e => this.handleRateChange(e)}
                              />
                            ) : (
                              <InvertedButton onClick={()=>this.handleAccept(buyerId)}>Accept</InvertedButton>
                            )}
                          </ButtonCol>
                          :
                          null
                        }
                      </BasicRow>
                    </BasicContainer>
                  </GenericCard>
                )
              })
            }
          </BasicContainer>
        )}
      </div>
    )
  }
}

SellerUi.propTypes = {};

export default SellerUi;
