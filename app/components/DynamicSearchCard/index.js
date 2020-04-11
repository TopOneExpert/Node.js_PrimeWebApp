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
  BasicContainer,
  BasicRow,
  BasicCol,
  InfoCol,
  SearchCard,
  StyledNumericInput,
  CustomDatePicker,
} from 'custom-styles';
import { Col, Tab } from 'react-bootstrap';
import CurrencySelect from 'components/CurrencySelect';
import CurrencyInfo from 'components/CurrencyInfo';
import FiveStar from 'components/FiveStar';

class DynamicSearchCard extends React.Component {
  state = {};

  render() {
    const {
      query,
      handleCurrency,
      handleAmount,
      handleRate,
      handlePaywith,
      handleDate,
      handleRating,
      loading,
    } = this.props;
    const { side, amount, currency, dateBy, paywith, rate } = query;

    return (
      <SearchCard body side={side}>
        <Tab.Container
          activeKey={side}
          onSelect={() => null}
        >
          {/* <BasicRow>
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
          </BasicRow> */}
          <BasicRow>
            <Col sm>
              <Tab.Content>
                <Tab.Pane eventKey="buy">
                  <BasicRow style={{ padding: '20px 0 0 0' }}>
                    <BasicCol xs={4} sm>
                      Buy
                      <BasicContainer>
                        <BasicRow>
                          <BasicCol>
                            <CurrencySelect
                              onSelect={e => handleCurrency(e)}
                              value={currency}
                            />
                          </BasicCol>
                          <InfoCol xs={1}>
                            <CurrencyInfo currName={currency}/>
                          </InfoCol>
                        </BasicRow>
                      </BasicContainer>
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      Sell
                      <BasicContainer>
                        <BasicRow>
                          <BasicCol>
                            <CurrencySelect
                              onSelect={e => handlePaywith(e)}
                              value={`${paywith}`}
                            />
                          </BasicCol>
                          <InfoCol xs={1}>
                            <CurrencyInfo currName={paywith}/>
                          </InfoCol>
                        </BasicRow>
                      </BasicContainer>
                    </BasicCol>
                  </BasicRow>
                  <BasicRow>
                    <BasicCol xs={4} sm>
                       MAX Amount:
                      <StyledNumericInput
                        centered="true"
                        value={amount}
                        // readOnly={loading}
                        onChange={e => handleAmount(e)}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      MAX Rate:
                      <br />
                      <StyledNumericInput
                        centered="true"
                        value={rate}
                        step={0.00001}
                        // readOnly={loading}
                        onChange={e => handleRate(e)}
                      />
                    </BasicCol>
                   
                    {/* <BasicCol xs={4} sm>
                      Expires after:
                      <CustomDatePicker
                        selected={moment(dateBy)}
                        onChange={newDate => handleDate(newDate)}
                      />
                    </BasicCol>
                    <BasicCol xs={4} sm>
                      User rating:
                      <FiveStar changeable reportRating={rating => handleRating(rating)} />
                    </BasicCol> */}
                  </BasicRow>
                </Tab.Pane>
                <Tab.Pane eventKey="sell">
                  <BasicRow style={{ padding: '20px 0 0 0' }}>
                    <BasicCol xs={4} sm>
                      Have:
                      <BasicContainer>
                        <BasicRow>
                          <BasicCol>
                            <CurrencySelect
                              onSelect={e => handleCurrency(e)}
                              value={currency}
                            />
                          </BasicCol>
                          <InfoCol xs={1}>
                            <CurrencyInfo currName={currency}/>
                          </InfoCol>
                        </BasicRow>
                      </BasicContainer>
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
                      <BasicContainer>
                        <BasicRow>
                          <BasicCol>
                            <CurrencySelect
                              onSelect={e => handlePaywith(e)}
                              value={`${paywith}`}
                            />
                          </BasicCol>
                          <InfoCol xs={1}>
                            <CurrencyInfo currName={paywith}/>
                          </InfoCol>
                        </BasicRow>
                      </BasicContainer>
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
  handleCurrency: PropTypes.func,
  handleAmount: PropTypes.func,
  handleRate: PropTypes.func,
  handlePaywith: PropTypes.func,
  handleDate: PropTypes.func,
  handleRating: PropTypes.func,
};

export default DynamicSearchCard;
