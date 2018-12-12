import validator from 'validator';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
export const phoneUtil = PhoneNumberUtil.getInstance();

export const resetUserData = {
  email: '',
  password: '',
  username: '',
  firstname: '',
  lastname: '',
  cellphone: '',
};
// export const resetUserData = {
//   username: 'username1',
//   password: '11!!qqQQ',
//   firstname: 'firstName1',
//   lastname: 'lastName1',
//   cellphone: '1231234567',
//   email: 'abc@abc.com',
// };
export const resetValidations = {
  emailValid: false,
  usernameValid: false,
  passwordValid: false,
  firstnameValid: false,
  lastnameValid: false,
  cellphoneValid: false,
};

export const minPassLength = 8;
export const minFirstnameLength = 2;
export const minLastnameLength = 2;
export const minUsernameLength = 2;
export const exactCodeLength = 6;

export const codeIsValid = code => code && code.length === exactCodeLength;

export const validatePhone = numberRaw => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(numberRaw, 'US');
    // const international = phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL,);
    const e164 = phoneUtil.format(number, PhoneNumberFormat.E164);
    const cellphoneValid = phoneUtil.isValidNumber(number);
    return { cellphone: cellphoneValid ? e164 : numberRaw, cellphoneValid };
  } catch (phoneNumberError) {
    // console.log(`validatePhone() ERROR: ${phoneNumberError}`);
    return { cellphone: numberRaw, cellphoneValid: false };
  }
};

export const validate = (value, name) => {
  // only use .match if value is not empty
  // console.log(`validate() name: ${name}, value: ${value}, value.length: ${value.length}`,);
  if (value && value.length > 0) {
    // console.log(`validate() type: ${typeof value}`);
    const numberOnly = value.match(/\d/g);
    const atLeastTwoDigits = numberOnly && numberOnly.length >= 2;
    // const atLeastTwoChars = value.length >= 2;
    switch (name) {
      case 'email':
        return validator.isEmail(value);
      case 'username':
        return Boolean(
          validator.isAlphanumeric(value) && value.length >= minUsernameLength,
        );
      case 'password':
        return Boolean(
          value.match(/[a-z]/) &&
            value.match(/[A-Z]/) &&
            value.match(/[`~!@#$%^&*()\-_=+]/) &&
            value.length >= minPassLength,
        );
      case 'firstname':
        return Boolean(
          validator.isAscii(value) && value.length >= minFirstnameLength,
        );
      case 'lastname':
        return Boolean(
          validator.isAscii(value) && value.length >= minLastnameLength,
        );
      case 'cellphone':
        if (atLeastTwoDigits) {
          return Boolean(
            phoneUtil.isValidNumber(
              phoneUtil.parseAndKeepRawInput(numberOnly.join(''), 'US'),
            ),
          );
        }
        return false;
      default:
        return true;
    }
  } else {
    return false;
  }
};

export const currencies = [
  'any',
  'AFN',
  'EUR',
  'ALL',
  'DZD',
  'USD',
  'AOA',
  'XCD',
  'ARS',
  'AMD',
  'AWG',
  'SHP',
  'AUD',
  'AZN',
  'B',
  'BSD',
  'BHD',
  'BDT',
  'BBD',
  'BYN',
  'BZD',
  'XOF',
  'BMD',
  'BTN',
  'BOB',
  'BAM',
  'BWP',
  'BRL',
  'BND',
  'BGN',
  'BIF',
  'C',
  'CVE',
  'KHR',
  'XAF',
  'CAD',
  'KYD',
  'NZD',
  'CLP',
  'CNY',
  'COP',
  'KMF',
  'CDF',
  'CRC',
  'HRK',
  'CUP',
  'ANG',
  'CZK',
  'D',
  'DKK',
  'DJF',
  'DOP',
  'E',
  'EGP',
  'ERN',
  'SZL',
  'ETB',
  'F',
  'FKP',
  'FJD',
  'XPF',
  'G',
  'GMD',
  'GEL',
  'GHS',
  'GIP',
  'GTQ',
  'GGP',
  'GNF',
  'GYD',
  'H',
  'HTG',
  'HNL',
  'HKD',
  'HUF',
  'I',
  'ISK',
  'INR',
  'IDR',
  'XDR',
  'IRR',
  'IQD',
  'IMP',
  'ILS',
  'J',
  'JMD',
  'JPY',
  'JEP',
  'JOD',
  'K',
  'KZT',
  'KES',
  'KWD',
  'KGS',
  'L',
  'LAK',
  'LBP',
  'LSL',
  'LRD',
  'LYD',
  'CHF',
  'M',
  'MOP',
  'MKD',
  'MGA',
  'MWK',
  'MYR',
  'MVR',
  'MRU',
  'MUR',
  'MXN',
  'MDL',
  'MNT',
  'MAD',
  'MZN',
  'MMK',
  'N',
  'NAD',
  'NPR',
  'NIO',
  'NGN',
  'KPW',
  'NOK',
  'O',
  'OMR',
  'P',
  'PKR',
  'PGK',
  'PYG',
  'PEN',
  'PHP',
  'PLN',
  'Q',
  'QAR',
  'R',
  'RON',
  'RUB',
  'RWF',
  'S',
  'WST',
  'STN',
  'SAR',
  'RSD',
  'SCR',
  'SLL',
  'SGD',
  'SBD',
  'SOS',
  'ZAR',
  'GBP',
  'KRW',
  'SSP',
  'LKR',
  'SDG',
  'SRD',
  'SEK',
  'SYP',
  'T',
  'TWD',
  'TJS',
  'TZS',
  'THB',
  'TOP',
  'TTD',
  'TND',
  'TRY',
  'TMT',
  'U',
  'UGX',
  'UAH',
  'AED',
  'UYU',
  'UZS',
  'V',
  'VUV',
  'VES',
  'VND',
  'W',
  'Y',
  'YER',
  'Z',
  'ZMW',
].sort();
