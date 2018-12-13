/**
 *
 * CurrencyInfo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  OverlayTrigger,
} from 'react-bootstrap';
import {
  currenciesFixerFull,
} from 'global-helpers';
import {
  CurrencyInfoIcon,
  CustomTooltip,
} from 'custom-styles';
  

/* eslint-disable react/prefer-stateless-function */
class CurrencyInfo extends React.Component {
  render() {
    const { currName } = this.props
    return (
      <OverlayTrigger
        defaultShow={false}
        placement='top'
        overlay={<CustomTooltip id="tooltip">{currenciesFixerFull[currName]}</CustomTooltip>}
      >
        <CurrencyInfoIcon className='fa-1x'/>
      </OverlayTrigger>
    );
  }
}

CurrencyInfo.propTypes = {
  currName: PropTypes.string,
  // currSymbol: PropTypes.string,
};

export default CurrencyInfo;
