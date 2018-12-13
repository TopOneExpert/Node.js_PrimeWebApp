import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import {
  Button,
  ButtonGroup,
  Row,
  Col,
  Card,
  Container,
  Nav,
  Form,
  Tooltip,
} from 'react-bootstrap';
import './bootstrap-overrides.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'font-awesome/css/font-awesome.min.css';
import { FaSpinner, FaCheck, FaInfoCircle } from 'react-icons/fa';


export default 'foo bar';

export const PageContainer = styled.div`
  background: gray;
  display: flex;
  min-width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  justify-content: center;
`;

export const FloatingContainer = styled.div`
  background: white;
  min-width: 90%;
  min-height: 500px;
  margin: 40px;
  padding: 0 0 50px 0;
  box-shadow: 0 8px 6px -6px black;
  color: black;
`;

export const LoginContainer = styled.div`
  background: white;
  width: 400px;
  min-height: 500px;
  max-height: 600px;
  padding: 20px 30px 20px 30px;
  margin: 40px;
  text-align: center;
  box-shadow: 0 8px 6px -6px black;
`;

export const ProfileLeftDiv = styled.div`
  width: 50vw;
  display: inline-block;
`;

export const ProfileRightDiv = styled.div`
  width: 50vw;
  display: inline-block;
  position: absolute;
  left: 50%;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
`;

export const ProfileStatusDiv = styled.div`
  text-align: center;
  max-width: 200px;
  height: 150px;
  left: 0;
  right: 0;
  top: -50px;
  bottom: 0;
  margin: auto;
`;

export const EditableInputDiv = styled.div`
  position: relative;
  width: 90%;
  text-align: center;
  display: block;
`;
// export const StyledInput = styled.input`
export const StyledInput = styled(Form.Control)`
  width: 90%;
  margin: 6px auto;
  outline: none;
  padding: 0.5em;
  color: black;
  position: relative;
  border: 1px solid ${props => (props.valid === 'true' ? 'unset' : 'red')};
  // box-shadow: 0 8px 6px -6px ${props =>
    props.valid === 'true' ? 'black' : 'red'};
  text-align: ${props => (props.centered === 'true' ? 'center' : 'initial')};
`;
// export const ProfileLabel = styled.input`
export const ProfileLabel = styled(StyledInput)`
  width: 100%;
  margin: 12px;
  outline: none;
  padding: 0.5em;
  // box-shadow: 0 8px 6px -6px ${props => (props.valid ? 'black' : 'red')};
  color: black;
  position: relative;
`;
export const NewStyledInput = styled.input`
  width: 100%;
  outline: none;
  padding: 0.375rem;
  color: black;
  // border: 1px solid ${props => (props.valid ? 'black' : 'red')};
  text-align: ${props => (props.centered ? 'center' : 'initial')};
`;
// export const CustomInput = styled.input`
export const CustomInput = styled(StyledInput)`
  text-align: center;
  // border: 1px solid black;
  width: 100%;
  padding: 0.2em;
  border-color: #ced4da;
`;
// export const ProfileInput = styled.input`
export const ProfileInput = styled(StyledInput)`
  margin: 12px;
  outline: none;
  padding: 0.5em;
  color: black;
  // border: 1px solid ${props => (props.valid ? 'black' : 'red')};
  // box-shadow: 0 8px 6px -6px ${props => (props.valid ? 'black' : 'red')};
  text-align: ${props => (props.centered ? 'center' : 'initial')};
  width: 100%;
`;
export const NumericInput = ({ ...rest }) => (
  <CustomInput type="number" min={0} step={0.01} {...rest} />
);
export const StyledNumericInput = ({ ...rest }) => (
  <CustomInput type="number" min={0} step={0.01} {...rest} />
);
export const StyledInput2 = ({ ...rest }) => (
  <NewStyledInput type="text" {...rest} />
);

// TEXT
export const PaddedDivText = styled.div`
  padding: 0 0 20px 0;
  text-align: center;
`;

export const PaddedH1Text = styled.h1`
  padding: 20px 0 0 0;
  margin: 0;
  text-align: center;
  color: #0c2340;
  font-weight: bolder;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
`;

export const LabelLeftSide = styled.div`
  // text-align: left;
  font-style: italic;
`;

// BUTTONS
export const BasicButton = styled(Button)`
  // border-radius: 0;
  // border-color: #0c2340;
  background: white;
  color: black;
  line-height: ${props => (props.small === 'true' ? '1em' : 'unset')};

  &:hover {
    background: #0c2340;
    border-color: #0c2340;
    color: white;
  }
`;

export const InvertedButton = styled(Button)`
  // border-radius: 0;
  // border-color: black;
  background: #0c2340;
  color: white;
  line-height: ${props => (props.small ? '1em' : 'unset')};

  &:hover {
    background: white;
    border-color: #0c2340;
    color: black;
    // box-shadow: 0px 0px 5px gray;
  }
`;
export const InvertedButtonMargin = styled(InvertedButton)`
  margin: 10px;
`;

export const CreateNewButton = styled(BasicButton)``;

export const ChangePasswordButton = styled(BasicButton)`
  position: relative;
  margin: auto;
  // top: 50px;
  // border-radius: 0;
`;

export const ProfileFieldSaveButton = styled(Button)`
  position: absolute;
  height: 2em;
  padding: 0 5px 0 5px;
  // border-radius: 0;
  margin: auto;
  top: 0;
  bottom: 0;
  right: -0.4em;
`;

// CARDS
export const BasicCard = styled(Card)`
  margin: 10px 0;
  border-radius: 10px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;
export const StyledCard = styled(BasicCard)`
  display: block;
  box-shadow: 0px 2px 10px ${props => (props.valid === 'true' ? 'gray' : 'red')};
`;
export const SearchCard = styled(BasicCard)`
  display: block;
  box-shadow: 0px 2px 10px lightgray;
    // ${props => (props.side === 'buy' ? 'lightgreen' : 'coral')};
  text-align: center;
`;
export const ResultCard = styled(StyledCard)`
  text-align: center;
  border-radius: 5px;
  box-shadow: 0px 1px 3px gray;
  padding: 5px 0;
`;
export const GenericCard = styled(BasicCard)`
  margin: 10px;
`;

export const BasicContainer = styled(Container)``;

export const BasicNav = styled.div``;
export const BasicNavItem = styled(Nav.Item)`
  text-align: center;
  border: 1px solid;
  border-color: green;
`;
export const BasicNavItemRight = styled(BasicNavItem)`
  border-bottom: 0;
`;
export const BasicNavItemLeft = styled(BasicNavItem)`
  border-bottom: 0;
`;
export const BasicNavLink = styled(Nav.Link)`
  color: black;
`;

export const BasicButtonGroup = styled(ButtonGroup)`
  // border-radius: 50px;
  border: 0;
`;

export const StyledRowBase = styled(Row)``;
export const BasicRow = styled(Row)``;
export const PaddedRow = styled(StyledRowBase)`
  padding-top: 5px;
`;
export const StyledRowTop = styled(StyledRowBase)`
  padding: 40px;
`;
export const RowOrderInput = styled(StyledRowBase)`
  transition: height 0.3s;
  height: ${props => (props.animate === 'true' ? '200px' : '0')};
`;

export const StyledColBase = styled(Col)`
  text-align: center;
`;
export const BasicCol = styled(Col)`
  text-align: center;
  padding: 0 5px;
  // border: 1px solid black;
`;
export const BoldCol = styled(StyledColBase)`
  font-weight: bold;
  text-decoration: underline;
`;
export const InfoCol = styled(BasicCol)`
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const BasicSpinner = styled(FaSpinner)`
  color: #0c2340;
  position: fixed;
  top: 65%;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 100;
`;
export const InlineSpinner = styled(FaSpinner)`
  color: #0c2340;
  margin: auto;
  z-index: 100;
`;
export const InlineCheck = styled(FaCheck)`
  color: #0c2340;
  margin: auto;
  z-index: 100;
`;
export const CurrencyInfoIcon = styled(FaInfoCircle)`
  color: #0c2340;
`;

export const CustomDatePicker = styled(DatePicker)`
  text-align: center;
  width: 100%;
  outline: none;
  // border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.2em;
  margin: 6px auto;
`;


export const CustomTooltip = styled(Tooltip)`
  color: #0c2340;
  background: white;
`;