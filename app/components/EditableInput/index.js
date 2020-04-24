/**
 *
 * EditableInput
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import {
  ProfileInput,
  ProfileLabel,
  ProfileFieldSaveButton,
  EditableInputDiv,
} from 'custom-styles';

class EditableInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      currentValue: props.value,
    };
  }

  onFocus() {
    this.setState({ editing: true });
  }

  onBlur() {
    this.setState({ editing: false });
  }

  onChange(e) {
    const currentValue = e.target.value;
    this.setState({ currentValue });
  }

  handleSave(e) {
    e.preventDefault();
    const { currentValue } = this.state;
    const { change } = this.props;
    change(currentValue);
    this.onBlur();
  }

  render() {
    const { placeholder, editable } = this.props;
    const { editing, currentValue } = this.state;
    const options = {
      onFocus: editable ? e => this.onFocus(e) : null,
      // onBlur: e => this.onBlur(e),
      valid: 'true',
      type: 'text',
      placeholder,
      value: currentValue,
      autoFocus: editing,
      onChange: editable
        ? e => this.onChange(e)
        : () => null,
    };
    return (
      <EditableInputDiv>
        {editing ? (
          <ProfileInput {...options} />
        ) : (
          <ProfileLabel {...options} />
        )}
        {editable ? (
          <ProfileFieldSaveButton
            variant="dark"
            onClick={editing ? e => this.handleSave(e) : () => this.onFocus()}
          >
            {editing ? 'save' : 'edit'}
          </ProfileFieldSaveButton>
        ) : (
          ''
        )}
      </EditableInputDiv>
    );
  }
}

EditableInput.propTypes = {};

export default EditableInput;
