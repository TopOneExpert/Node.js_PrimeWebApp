/**
 *
 * DynamicSearchCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
// import styled from 'styled-components';
import {
  BasicRow,
  BasicCol,
  SearchCard,
  BasicButton,
  BasicButtonGroup,
  StyledNumericInput,
  CustomDatePicker,
} from 'custom-styles';
import { Col, Tab } from 'react-bootstrap';
import CurrencySelect from 'components/CurrencySelect';
import FiveStar from 'components/FiveStar';

class DynamicSearchCard extends React.Component {
  state = {};

  render() {
    const {
      query,
      handleTabClick,
      handleCurrency,
      handleAmount,
      handleRate,
      handlePaywith,
      handleDate,
      handleRating,
    } = this.props;
    const { side, amount, currency, dateBy, paywith, rate } = query;

    console.log(dateBy)

    return (
      <SearchCard body side={side}>
        <Tab.Container
          activeKey={side}
          onSelect={tab =>
            console.log(`DynamicSearchCard.render() selected: ${tab}`)
          }
        >
          <BasicRow>
            <BasicCol className="text-center" sm>
              <BasicButtonGroup style={{ width: '100%' }}>
                <BasicButton
                  style={{ width: '100%', background: 'lightgreen' }}
                  onClick={() => handleTabClick('buy')}
                >
                  Buy
                </BasicButton>
                <BasicButton
                  style={{ width: '100%', background: 'coral' }}
                  onClick={() => handleTabClick('sell')}
                >
                  Sell
                </BasicButton>
              </BasicButtonGroup>
            </BasicCol>
          </BasicRow>
          <BasicRow>
            <Col sm>
              <Tab.Content>
                <Tab.Pane eventKey="buy">
                  <BasicRow style={{ padding: '20px 0 0 0' }}>
                    <BasicCol xs={4} sm>
                      Need:
                      <CurrencySelect
                        onSelect={e => handleCurrency(e)}
                        value={currency}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      Amount:
                      <StyledNumericInput
                        centered="true"
                        value={amount}
                        onChange={e => handleAmount(e)}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      Rate:
                      <br />
                      <StyledNumericInput
                        centered="true"
                        value={rate}
                        step={0.00001}
                        onChange={e => handleRate(e)}
                      />
                    </BasicCol>
                  </BasicRow>
                  <BasicRow>
                    <BasicCol xs={4} sm>
                      Pay with:
                      <CurrencySelect
                        onSelect={e => handlePaywith(e)}
                        value={`${paywith}`}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      Expires after:
                      <CustomDatePicker
                        selected={moment(dateBy)}
                        onChange={newDate => handleDate(newDate)}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      User rating:
                      <FiveStar changeable reportRating={rating => handleRating(rating)} />
                    </BasicCol>
                  </BasicRow>
                </Tab.Pane>
                <Tab.Pane eventKey="sell">
                  <BasicRow style={{ padding: '20px 0 0 0' }}>
                    <BasicCol xs={4} sm>
                      Have:
                      <CurrencySelect
                        onSelect={e => handleCurrency(e)}
                        value={currency}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      Amount:
                      <StyledNumericInput
                        centered="true"
                        value={amount}
                        onChange={e => handleAmount(e)}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      Rate:
                      <br />
                      <StyledNumericInput
                        centered="true"
                        value={rate}
                        step={0.00001}
                        onChange={e => handleRate(e)}
                      />
                    </BasicCol>
                  </BasicRow>
                  <BasicRow>
                    <BasicCol xs={4} sm>
                      Pay with:
                      <CurrencySelect
                        onSelect={e => handlePaywith(e)}
                        value={`${paywith}`}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      By date:
                      <CustomDatePicker
                        selected={moment(dateBy)}
                        onChange={newDate => handleDate(newDate)}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      User rating:
                      <FiveStar changeable reportRating={rating => handleRating(rating)} />
                    </BasicCol>
                  </BasicRow>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </BasicRow>
        </Tab.Container>
      </SearchCard>
    );
  }
}

DynamicSearchCard.propTypes = {
  query: PropTypes.object,
  handleTabClick: PropTypes.func,
  handleCurrency: PropTypes.func,
  handleAmount: PropTypes.func,
  handleRate: PropTypes.func,
  handlePaywith: PropTypes.func,
  handleDate: PropTypes.func,
  handleRating: PropTypes.func,
};

export default DynamicSearchCard;
