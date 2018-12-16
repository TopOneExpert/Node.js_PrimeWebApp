/**
 *
 * RatingDisplay
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { FaStar, FaRegStar } from 'react-icons/fa';

const Wrapper = styled.div`
  display: inline;
  font-size: smaller;
`;

/* eslint-disable react/prefer-stateless-function */
class RatingDisplay extends React.Component {
  render() {
    const { rating } = this.props;
    // const fiveStars = [...Array(5).keys()].map(i=>i<=rating)
    return (
      <Wrapper>
        {rating >= 0 ? parseInt(((rating + 1) / 5) * 100, 10) : 0}%
        {/*
          fiveStars.map(i=>
            i ? (<FaStar
              key={Math.random()}
            />):(<FaRegStar
              key={Math.random()}
            />)
          )
        */}
      </Wrapper>
    );
  }
}

RatingDisplay.propTypes = {
  rating: PropTypes.number,
};

export default RatingDisplay;
