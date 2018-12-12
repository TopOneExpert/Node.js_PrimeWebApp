/**
 *
 * SearchPage
 *
 */

import React from 'react';
import { Redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import DynamicSearchCard from 'components/DynamicSearchCard';
import RatingDisplay from 'components/RatingDisplay';
import {
  PageContainer,
  FloatingContainer,
  PaddedH1Text,
  BasicContainer,
  BasicSpinner,
  ResultCard,
  BasicRow,
  BasicCol,
} from 'custom-styles';
import { API } from 'aws-amplify';
import moment from 'moment';

/* eslint-disable react/prefer-stateless-function */
class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      side: 'buy',
      currency: 'any',
      paywith: 'any',
      rate: 0,
      amount: 1,
      rating: -1,
      dateBy: moment().startOf('day').unix() * 1000,
      // dateBy: moment().add(1, 'years').unix() * 1000,
      // ---------------------------
      results: [],
      loading: null,
      direction: 'ascending',
      sort: 'date',
      redirect: false,
    };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleCurrency = this.handleCurrency.bind(this);
    this.handleAmount = this.handleAmount.bind(this);
    this.handleRate = this.handleRate.bind(this);
    this.handlePaywith = this.handlePaywith.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleRating = this.handleRating.bind(this);
  }

  updateResults() {
    const { side, currency, paywith, rate, amount, rating, dateBy } = this.state;
    const query = { side, currency, paywith, rate, amount, rating, dateBy };
    this.setState({ loading: true }, async () => {
      // get the list of all orders
      try {
        const resultsRaw = await API.post('notes', '/notes/list', {
          body: query,
        });

        const results = resultsRaw.map(o => ({...o.content, id: o.orderId}));
        this.setState({ results, loading: false }, () => this.sortResults());
      } catch (e) {
        console.error(`SearchPage.updateResults() ERROR: ${e}`);
      }
    });
  }

  componentDidMount() {
    this.updateResults();
  }

  handleTabClick(side) {
    this.setState({ side }, () => this.updateResults());
  }

  handleCurrency(currency) {
    this.setState({ currency }, () => this.updateResults());
  }

  handlePaywith(paywith) {
    this.setState({ paywith }, () => this.updateResults());
  }

  handleRate(e) {
    const rate = parseFloat(e.target.value);
    this.setState({ rate }, () => this.updateResults());
  }

  handleAmount(e) {
    const amount = parseFloat(e.target.value);
    this.setState({ amount }, () => this.updateResults());
  }

  handleRating(rating) {
    this.setState({ rating }, () => this.updateResults());
  }

  handleDate(dateBy) {
    this.setState({ dateBy: moment(dateBy).unix() * 1000 }, () => this.updateResults());
  }

  handleSorting(sort) {
    let { direction } = this.state;
    const { sort: lastSort } = this.state;

    if (sort === lastSort) {
      // flip direction
      direction = direction === 'ascending' ? 'descending' : 'ascending';
    } else {
      // new sort clicked, start with ascending
      direction = 'ascending';
    }
    this.setState({ direction, sort }, () => this.sortResults());
  }

  sortResults() {
    const { results: stateResults, sort, direction, side } = this.state;
    // sort by amount
    const results = stateResults.sort((a, b) => {
      const aAmount = parseFloat(
        side === 'buy' ? a.buyAmount : a.sellAmount,
      );
      const bAmount = parseFloat(
        side === 'buy' ? b.buyAmount : b.sellAmount,
      );
      const aRating = parseFloat(a.rating);
      const bRating = parseFloat(b.rating);
      const aRate = parseFloat(a.rate);
      const bRate = parseFloat(b.rate);
      const aDate = moment(a.dateBy);
      const bDate = moment(b.dateBy);
      switch (sort) {
        case 'amount':
          return direction === 'ascending'
            ? aAmount >= bAmount
            : aAmount < bAmount;
        case 'rating':
          return direction === 'ascending'
            ? aRating >= bRating
            : aRating < bRating;
        case 'rate':
          return direction === 'ascending' ? aRate >= bRate : aRate < bRate;
        case 'need':
          return direction === 'ascending'
            ? a.buyCurrency >= b.buyCurrency
            : a.buyCurrency < b.buyCurrency;
        case 'have':
          return direction === 'ascending'
            ? a.sellCurrency >= b.sellCurrency
            : a.sellCurrency < b.sellCurrency;
        case 'date':
          return direction === 'ascending' ? aDate >= bDate : aDate < bDate;
        default:
          // sort on nothing
          return null;
      }
    });
    this.setState({ results });
  }

  goTo(link){
    this.setState({redirect: link})
  }

  render() {
    const {
      side,
      currency,
      paywith,
      rate,
      amount,
      dateBy,
      results,
      rating,
      loading,
      sort,
      direction,
      redirect,
    } = this.state;
    const query = { side, currency, paywith, rate, amount, dateBy, rating };

    return redirect ? (<Redirect to={redirect} />) : (
      <PageContainer style={{ fontSize: 'normal' }}>
        <FloatingContainer>
          <PaddedH1Text>Search</PaddedH1Text>
          {loading ? <BasicSpinner className="fa-4x fa-spin" /> : null}
          <BasicContainer>
            <DynamicSearchCard
              query={query}
              handleTabClick={this.handleTabClick}
              handleCurrency={this.handleCurrency}
              handleAmount={this.handleAmount}
              handleRate={this.handleRate}
              handlePaywith={this.handlePaywith}
              handleDate={this.handleDate}
              handleRating={this.handleRating}
            />
          </BasicContainer>
          <BasicContainer>
            <BasicRow style={{ background: 'lightgray', marginTop: '20px' }}>
              <BasicCol xs={4} sm onClick={() => this.handleSorting('amount')}>
                amount
                {sort === 'amount'
                  ? direction === 'ascending'
                    ? '▲'
                    : '▼'
                  : null}
              </BasicCol>
              <BasicCol xs={4} sm onClick={() => this.handleSorting('need')}>
                need
                {sort === 'need'
                  ? direction === 'ascending'
                    ? '▲'
                    : '▼'
                  : null}
              </BasicCol>
              <BasicCol xs={4} sm onClick={() => this.handleSorting('have')}>
                have
                {sort === 'have'
                  ? direction === 'ascending'
                    ? '▲'
                    : '▼'
                  : null}
              </BasicCol>
              <BasicCol xs={4} sm onClick={() => this.handleSorting('rate')}>
                rate
                {sort === 'rate'
                  ? direction === 'ascending'
                    ? '▲'
                    : '▼'
                  : null}
              </BasicCol>
              <BasicCol xs={4} sm onClick={() => this.handleSorting('date')}>
                date
                {sort === 'date'
                  ? direction === 'ascending'
                    ? '▲'
                    : '▼'
                  : null}
              </BasicCol>
              <BasicCol xs={4} sm onClick={() => this.handleSorting('rating')}>
                rating
                {sort === 'rating'
                  ? direction === 'ascending'
                    ? '▲'
                    : '▼'
                  : null}
              </BasicCol>
            </BasicRow>
            <BasicRow>
              <BasicCol>
                {results.map(r => (
                  <ResultCard key={Math.random()} onClick={()=>this.goTo(`/order/${r.id}`)}>
                    <BasicContainer>
                      <BasicRow>
                        <BasicCol xs={4} sm>
                          {parseFloat(
                            side === 'buy' ? r.buyAmount : r.sellAmount,
                          ).toFixed(2)}
                        </BasicCol>
                        <BasicCol xs={4} sm>
                          {r.buyCurrency}
                        </BasicCol>
                        <BasicCol xs={4} sm>
                          {r.sellCurrency}
                        </BasicCol>
                        <BasicCol xs={4} sm>
                          {r.rate}
                        </BasicCol>
                        <BasicCol xs={4} sm>
                          {moment(r.dateBy)
                            .toDate()
                            .toLocaleDateString()}
                        </BasicCol>
                        <BasicCol xs={4} sm>
                          <RatingDisplay rating={r.rating} />
                        </BasicCol>
                      </BasicRow>
                    </BasicContainer>
                  </ResultCard>
                ))}
              </BasicCol>
            </BasicRow>
          </BasicContainer>
        </FloatingContainer>
      </PageContainer>
    );
  }
}

SearchPage.propTypes = {};

export default SearchPage;
