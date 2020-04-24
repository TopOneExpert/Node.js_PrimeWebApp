/**
 *
 * CustomToggle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    this.props.onClick(e);
  }

  render() {
    return (
      <div role="presentation" href="" onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

CustomToggle.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

export default CustomToggle;
