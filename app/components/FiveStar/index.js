/**
 *
 * FiveStar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaStar, FaRegStar } from 'react-icons/fa';

export const FiveStarContainer = styled.div`
  color: #0c2340;
  padding: 0.2em 0;
`;

class FiveStar extends React.Component {
  state = {
    selected: -1,
    filled: [0, 0, 0, 0, 0],
  };

  componentDidMount(){
    const { selected } = this.props
    if(selected){
      this.handleClick(selected)
    }
  }

  handleClick(i) {
    const { reportRating } = this.props;
    const { selected: lastSelected } = this.state;
    const filled = [0, 0, 0, 0, 0];
    let selected = i;

    if (selected === lastSelected) {
      // reset to 0
      selected = -1;
    } else {
      // new value
      for (let k = 0; k <= i; k += 1) {
        filled[k] = 1;
      }
    }
    
    this.setState({ filled, selected }, () => reportRating ? reportRating(selected) : console.log(`set to ${selected+1} stars`));
  }

  render() {
    const { changeable } = this.props;
    const { filled } = this.state;
    return (
      <FiveStarContainer>
        {filled.map(
          (fill, index) =>
            fill === 1 ? (
              <FaStar
                onClick={() => changeable ? this.handleClick(index) : null}
                key={Math.random()}
              />
            ) : (
              <FaRegStar
                onClick={() => changeable ? this.handleClick(index) : null}
                key={Math.random()}
              />
            ),
        )}
      </FiveStarContainer>
    );
  }
}

FiveStar.propTypes = {
  reportRating: PropTypes.func,
  selected: PropTypes.number,
  changeable: PropTypes.bool,
};

export default FiveStar;
