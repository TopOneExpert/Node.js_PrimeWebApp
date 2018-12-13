/**
 *
 * OrderEntry
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import moment from 'moment';
import { API, Auth } from 'aws-amplify';
import { withAlert } from 'react-alert';
import CurrencySelect from 'components/CurrencySelect';
import CurrencyInfo from 'components/CurrencyInfo';
import { getRateFromFixer } from 'global-helpers';
import {
  InvertedButton,
  StyledColBase,
  BasicSpinner,
  CustomDatePicker,
  BasicContainer,
  BasicButtonGroup,
  BasicRow,
  BasicCol,
  InfoCol,
  BoldCol,
  PaddedRow,
  NumericInput,
} from 'custom-styles';

// import { currencies } from 'global-helpers';
const randPick = myArray => myArray[Math.floor(Math.random() * myArray.length)];
// const randCurr = () => randPick(currencies);
// const randFloat = () => (Math.random() * 1000).toFixed(2);
const randRating = () => randPick([-1, 0, 1, 2, 3, 4]);
// const dateRanges = ['month', 'year', 'day', 'week', 'hour'];
// const randDate = () =>
//   moment()
//     .endOf(randPick(dateRanges))
//     .toDate();
// const randInt = () => parseInt(Math.random() * 100000, 10);

/* eslint-disable react/prefer-stateless-function */
class OrderEntry extends React.Component {
  constructor() {
    super();

    const sellAmount = 1000;
    const buyAmount = 1000;
    const rate = parseFloat(sellAmount / buyAmount).toFixed(5);
    this.state = {
      loading: false,
      order: {
        sellCurrency: 'EUR',
        buyCurrency: 'USD',
        sellAmount,
        buyAmount,
        rate,
        rating: randRating(),
        dateBy:
          moment()
            .add(1, 'week')
            .unix() * 1000,
        orderStatus: 'active',
      },
    };
  }

  async componentDidMount() {
    const { order } = this.props;
    if (order) {
      order.sellAmount = parseFloat(order.sellAmount);
      order.dateBy = moment(order.dateBy).unix() * 1000;
      order.rate = await getRateFromFixer(order.sellCurrency, order.buyCurrency)
      order.buyAmount = parseFloat(order.sellAmount / order.rate);
      this.setState({ order });
    } else {
      const { order: stateOrder } = this.state;
      stateOrder.sellAmount = parseFloat(stateOrder.sellAmount);
      stateOrder.dateBy = moment(stateOrder.dateBy).unix() * 1000;
      stateOrder.rate = await getRateFromFixer(stateOrder.sellCurrency, stateOrder.buyCurrency)
      stateOrder.buyAmount = parseFloat(stateOrder.sellAmount / stateOrder.rate);
      this.setState({ order: stateOrder }, ()=>this.updateRateFixer());
    }
  }

  handleReset() {
    const { handleCanceled } = this.props;
    this.setState({ loading: false }, () => handleCanceled());
  }

  fakePlacer() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  orderPlacer = async order => {
    const { mode } = this.props;
    const userSession = await Auth.currentAuthenticatedUser();
    const email = userSession.attributes
      ? userSession.attributes.email
      : userSession.email;

    switch (mode) {
      case 'create':
        console.log(`OrderEntry.orderPlacer() create`);
        return API.post('notes', '/notes', {
          body: { content: order, email },
        });
      case 'update':
        console.log(`OrderEntry.orderPlacer() update: ${order.id}`);
        return API.put('notes', `/notes/${order.id}`, {
          body: { content: order, email },
        });
      default:
        return null;
    }
  };

  orderParser(order) {
    return { ...order.content, id: order.orderId };
  }

  handlePlace() {
    console.log(`handlePlace()`);
    const { order } = this.state;
    const { handleCreated } = this.props;
    this.setState({ loading: true }, async () => {
      const placedOrder = await this.orderPlacer(order);
      this.props.alert.show(
        <div style={{ color: 'white' }}>Order Placed!</div>,
      );
      console.log(`handlePlace() 2`);
      handleCreated(this.orderParser(placedOrder));
    });
  }

  async updateRateFixer(){
    const {order, order: { sellCurrency, buyCurrency }} = this.state
    try{
      order.rate = await getRateFromFixer(sellCurrency, buyCurrency)
      this.setState({order})
    }catch (fixerError){
      console.error('fixerError in OrderEntry')
      console.log(fixerError)
    }
  }

  handleDateChange(dateBy) {
    const { order } = this.state;
    order.dateBy = moment(dateBy).unix() * 1000;
    this.setState({ order });
  }

  async handleSellCurrency(sellCurrency) {
    const { order, order: { buyCurrency }} = this.state;
    order.sellCurrency = sellCurrency;
    order.rate = sellCurrency === buyCurrency ? 1 : await getRateFromFixer(sellCurrency, buyCurrency)
    order.buyAmount = order.sellAmount / order.rate;

    console.log(`handleSellCurrency`)

    this.setState({ order });
  }

  async handleBuyCurrency(buyCurrency) {
    const { order, order: { sellCurrency }} = this.state;
    order.buyCurrency = buyCurrency;
    order.rate = sellCurrency === buyCurrency ? 1 : await getRateFromFixer(sellCurrency, buyCurrency)
    order.sellAmount = order.buyAmount * order.rate;

    console.log(`handleBuyCurrency`)

    this.setState({ order });
  }

  handleSellAmount(sellAmount) {
    const { order } = this.state;
    const buyAmount = parseFloat(sellAmount) / parseFloat(order.rate);
    order.buyAmount = parseFloat(buyAmount);
    order.sellAmount = parseFloat(sellAmount);
    this.setState({ order });
  }

  handleBuyAmount(buyAmount) {
    const { order } = this.state;
    const sellAmount = parseFloat(buyAmount) * parseFloat(order.rate);
    order.sellAmount = parseFloat(sellAmount);
    order.buyAmount = parseFloat(buyAmount);
    this.setState({ order });
  }

  handleRateChange(rate) {
    const { order } = this.state;
    const buyAmount = parseFloat(order.sellAmount) / parseFloat(rate);
    order.buyAmount = parseFloat(buyAmount);
    order.rate = parseFloat(rate);
    this.setState({ order });
  }

  render() {
    const { loading, order } = this.state;
    const {
      sellCurrency,
      buyCurrency,
      sellAmount,
      buyAmount,
      rate,
      dateBy,
    } = order;

    return (
      <StyledColBase sm>
        <BasicContainer>
          {loading ? <BasicSpinner className="fa-4x fa-spin" /> : null}
          <BasicButtonGroup>
            <InvertedButton
              variant="dark"
              onClick={() => this.handleReset()}
              disabled={loading}
            >
              Cancel
            </InvertedButton>
            <InvertedButton
              variant="dark"
              onClick={() => this.handlePlace()}
              disabled={loading}
            >
              Place
            </InvertedButton>
          </BasicButtonGroup>
          <BasicRow>
            <BoldCol>Sell</BoldCol>
            <BoldCol>Buy</BoldCol>
          </BasicRow>
          <PaddedRow>
            <BasicCol>
              <CurrencySelect
                value={sellCurrency}
                onSelect={val => this.handleSellCurrency(val)}
              />
            </BasicCol>
            <InfoCol xs={1}>
              <CurrencyInfo currName={sellCurrency}/>
            </InfoCol>
            <BasicCol>
              <CurrencySelect
                value={buyCurrency}
                onSelect={val => this.handleBuyCurrency(val)}
              />
            </BasicCol>
            <InfoCol xs={1}>
              <CurrencyInfo currName={buyCurrency}/>
            </InfoCol>
          </PaddedRow>
          <PaddedRow>
            <BasicCol>
              <NumericInput
                value={parseFloat(sellAmount).toFixed(2)}
                onChange={e => this.handleSellAmount(e.target.value)}
              />
            </BasicCol>
            <BasicCol>
              <NumericInput
                value={parseFloat(buyAmount).toFixed(2)}
                onChange={e => this.handleBuyAmount(e.target.value)}
              />
            </BasicCol>
          </PaddedRow>
          <PaddedRow>
            <BoldCol>By Date:</BoldCol>
            <BoldCol>Rate:</BoldCol>
          </PaddedRow>
          <PaddedRow>
            <BasicCol>
              <CustomDatePicker
                selected={moment(dateBy)}
                onChange={newDate => this.handleDateChange(newDate)}
              />
            </BasicCol>
            <BasicCol>
              <NumericInput
                value={parseFloat(rate).toFixed(4)}
                step={0.0001}
                onChange={e => this.handleRateChange(e.target.value)}
              />
            </BasicCol>
          </PaddedRow>
        </BasicContainer>
      </StyledColBase>
    );
  }
}

OrderEntry.propTypes = {
  handleCanceled: PropTypes.func,
  handleCreated: PropTypes.func,
  alert: PropTypes.object,
  order: PropTypes.object,
  mode: PropTypes.string,
};

export default withAlert(OrderEntry);
