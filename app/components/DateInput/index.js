/**
 *
 * DateInput
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import DatePicker from 'react-datepicker';

const CustomDatePicker = styled(DatePicker)`
  text-align: center;
  width: 100%;
  outline: none;
`;
const Wrapper = styled.div`
  border: 1px solid black;
  padding: 0.3em 0;
`;

/* eslint-disable react/prefer-stateless-function */
class DateInput extends React.Component {
  render() {
    return (
      <Wrapper>
        <CustomDatePicker selected={moment()} />
      </Wrapper>
    );
  }
}

DateInput.propTypes = {};

export default DateInput;
