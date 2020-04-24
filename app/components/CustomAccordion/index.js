/**
 *
 * CustomAccordion
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { Accordion, AccordionItem } from 'react-light-accordion';
import OneOrderDetails from 'components/OneOrderDetails';
import styled from 'styled-components';

const StyledDivContainer = styled.div``;

/* eslint-disable react/prefer-stateless-function */
class CustomAccordion extends React.Component {
  render() {
    const { orders, noChange } = this.props;
    return (
      <StyledDivContainer>
        {orders.map(order => (
          <OneOrderDetails
            key={`OneOrderDetails-key-${Math.random()}`}
            order={order}
            noChange={noChange}
          />
        ))}
      </StyledDivContainer>
    );
  }
}

CustomAccordion.propTypes = {
  orders: PropTypes.array,
  noChange: PropTypes.bool,
};

export default CustomAccordion;
