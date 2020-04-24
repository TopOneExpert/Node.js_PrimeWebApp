/**
 *
 * CurrencySelect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Dropdown } from 'react-bootstrap';
import { currenciesFixerSymbolsOnly } from 'global-helpers';

/* eslint-disable react/prefer-stateless-function */
class CurrencySelect extends React.Component {
  render() {
    const { value, onSelect } = this.props;
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success">{value}</Dropdown.Toggle>

        <Dropdown.Menu>
          {currenciesFixerSymbolsOnly.map(c => (
            <Dropdown.Item
              key={`Dropdown-Item-Key-${Math.random()}`}
              onSelect={() => onSelect(c)}
            >
              {c}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

CurrencySelect.propTypes = {
  value: PropTypes.string,
  onSelect: PropTypes.func,
};

export default CurrencySelect;
