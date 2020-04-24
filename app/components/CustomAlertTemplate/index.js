/**
 *
 * CustomAlertTemplate
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { FaTimes /* , FaCheck */ } from 'react-icons/fa';

const alertStyle = {
  // backgroundColor: 'white',
  backgroundColor: '#0c2340',
  color: 'white',
  padding: '10px',
  // textTransform: 'uppercase',
  // borderRadius: '5px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Arial',
  width: '300px',
  boxSizing: 'border-box',
  border: '1px solid black',
};

const buttonStyle = {
  marginLeft: '20px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  padding: '0 0 0 20px',
};

const messageStyle = {
  flex: 2,
  textAlign: 'center',
  color: 'black',
};

const CustomAlertTemplate = ({ style /* , options */, message, close }) => (
  <div style={{ ...alertStyle, ...style }}>
    {/* options.type === 'info' && <FaCheck /> */}
    {/* options.type === 'success' && <FaCheck /> */}
    {/* options.type === 'error' && <FaCheck /> */}
    <span style={messageStyle}>{message}</span>
    <button type="button" onClick={close} style={buttonStyle}>
      <FaTimes />
    </button>
  </div>
);

CustomAlertTemplate.propTypes = {
  style: PropTypes.object,
  // options: PropTypes.object,
  message: PropTypes.object,
  close: PropTypes.func,
};

export default CustomAlertTemplate;
