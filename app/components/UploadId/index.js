/**
 *
 * UploadId
 *
 */

import React from 'react';
import config from 'config';
import {
  InvertedButton,
} from 'custom-styles';
import { s3Upload } from "../../libs/awsLib";

// import styled from 'styled-components';
// import PropTypes from 'prop-types';

/* eslint-disable react/prefer-stateless-function */
class UploadId extends React.Component {

  state = {
    loading: false,
  }

  handleUpload(e){
    e.preventDefault()

    const file = e.target.files[0];
    console.log(`handleUpload() file: ${file}`)
    console.log(file)

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }

    this.setState({ loading: true }, async ()=>{
      try {
        if(file){
          await s3Upload(file)
          console.log('attachment uploaded')
          this.setState({ loading: false });
        }
      } catch (error) {
        alert(error);
      }
      
    });
  }

  render() {
    const { loading } = this.state
    return (
      <div>
        <input
          id="hiddenUpload"
          type="file"
          style={{ display: 'none' }} 
          ref={(ref) => {this.hiddenUpload = ref}} 
          onChange={e => this.handleUpload(e)}
        />
        <InvertedButton onClick={() => this.hiddenUpload.click() }>{ loading ? 'loading...' : 'Upload Photo ID'}</InvertedButton>
      </div>
    );
  }
}

UploadId.propTypes = {};

export default UploadId;
