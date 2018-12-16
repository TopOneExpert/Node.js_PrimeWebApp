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
    return { cellphone: numberRaw, cellphoneValid: false };
  }
};

export const validate = (value, name) => {
  // only use .match if value is not empty
  if (value && value.length > 0) {
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

export const currenciesFixerFull = {"any":"Match anything", "AED":"United Arab Emirates Dirham","AFN":"Afghan Afghani","ALL":"Albanian Lek","AMD":"Armenian Dram","ANG":"Netherlands Antillean Guilder","AOA":"Angolan Kwanza","ARS":"Argentine Peso","AUD":"Australian Dollar","AWG":"Aruban Florin","AZN":"Azerbaijani Manat","BAM":"Bosnia-Herzegovina Convertible Mark","BBD":"Barbadian Dollar","BDT":"Bangladeshi Taka","BGN":"Bulgarian Lev","BHD":"Bahraini Dinar","BIF":"Burundian Franc","BMD":"Bermudan Dollar","BND":"Brunei Dollar","BOB":"Bolivian Boliviano","BRL":"Brazilian Real","BSD":"Bahamian Dollar","BTC":"Bitcoin","BTN":"Bhutanese Ngultrum","BWP":"Botswanan Pula","BYN":"New Belarusian Ruble","BYR":"Belarusian Ruble","BZD":"Belize Dollar","CAD":"Canadian Dollar","CDF":"Congolese Franc","CHF":"Swiss Franc","CLF":"Chilean Unit of Account (UF)","CLP":"Chilean Peso","CNY":"Chinese Yuan","COP":"Colombian Peso","CRC":"Costa Rican Col\u00f3n","CUC":"Cuban Convertible Peso","CUP":"Cuban Peso","CVE":"Cape Verdean Escudo","CZK":"Czech Republic Koruna","DJF":"Djiboutian Franc","DKK":"Danish Krone","DOP":"Dominican Peso","DZD":"Algerian Dinar","EGP":"Egyptian Pound","ERN":"Eritrean Nakfa","ETB":"Ethiopian Birr","EUR":"Euro","FJD":"Fijian Dollar","FKP":"Falkland Islands Pound","GBP":"British Pound Sterling","GEL":"Georgian Lari","GGP":"Guernsey Pound","GHS":"Ghanaian Cedi","GIP":"Gibraltar Pound","GMD":"Gambian Dalasi","GNF":"Guinean Franc","GTQ":"Guatemalan Quetzal","GYD":"Guyanaese Dollar","HKD":"Hong Kong Dollar","HNL":"Honduran Lempira","HRK":"Croatian Kuna","HTG":"Haitian Gourde","HUF":"Hungarian Forint","IDR":"Indonesian Rupiah","ILS":"Israeli New Sheqel","IMP":"Manx pound","INR":"Indian Rupee","IQD":"Iraqi Dinar","IRR":"Iranian Rial","ISK":"Icelandic Kr\u00f3na","JEP":"Jersey Pound","JMD":"Jamaican Dollar","JOD":"Jordanian Dinar","JPY":"Japanese Yen","KES":"Kenyan Shilling","KGS":"Kyrgystani Som","KHR":"Cambodian Riel","KMF":"Comorian Franc","KPW":"North Korean Won","KRW":"South Korean Won","KWD":"Kuwaiti Dinar","KYD":"Cayman Islands Dollar","KZT":"Kazakhstani Tenge","LAK":"Laotian Kip","LBP":"Lebanese Pound","LKR":"Sri Lankan Rupee","LRD":"Liberian Dollar","LSL":"Lesotho Loti","LTL":"Lithuanian Litas","LVL":"Latvian Lats","LYD":"Libyan Dinar","MAD":"Moroccan Dirham","MDL":"Moldovan Leu","MGA":"Malagasy Ariary","MKD":"Macedonian Denar","MMK":"Myanma Kyat","MNT":"Mongolian Tugrik","MOP":"Macanese Pataca","MRO":"Mauritanian Ouguiya","MUR":"Mauritian Rupee","MVR":"Maldivian Rufiyaa","MWK":"Malawian Kwacha","MXN":"Mexican Peso","MYR":"Malaysian Ringgit","MZN":"Mozambican Metical","NAD":"Namibian Dollar","NGN":"Nigerian Naira","NIO":"Nicaraguan C\u00f3rdoba","NOK":"Norwegian Krone","NPR":"Nepalese Rupee","NZD":"New Zealand Dollar","OMR":"Omani Rial","PAB":"Panamanian Balboa","PEN":"Peruvian Nuevo Sol","PGK":"Papua New Guinean Kina","PHP":"Philippine Peso","PKR":"Pakistani Rupee","PLN":"Polish Zloty","PYG":"Paraguayan Guarani","QAR":"Qatari Rial","RON":"Romanian Leu","RSD":"Serbian Dinar","RUB":"Russian Ruble","RWF":"Rwandan Franc","SAR":"Saudi Riyal","SBD":"Solomon Islands Dollar","SCR":"Seychellois Rupee","SDG":"Sudanese Pound","SEK":"Swedish Krona","SGD":"Singapore Dollar","SHP":"Saint Helena Pound","SLL":"Sierra Leonean Leone","SOS":"Somali Shilling","SRD":"Surinamese Dollar","STD":"S\u00e3o Tom\u00e9 and Pr\u00edncipe Dobra","SVC":"Salvadoran Col\u00f3n","SYP":"Syrian Pound","SZL":"Swazi Lilangeni","THB":"Thai Baht","TJS":"Tajikistani Somoni","TMT":"Turkmenistani Manat","TND":"Tunisian Dinar","TOP":"Tongan Pa\u02bbanga","TRY":"Turkish Lira","TTD":"Trinidad and Tobago Dollar","TWD":"New Taiwan Dollar","TZS":"Tanzanian Shilling","UAH":"Ukrainian Hryvnia","UGX":"Ugandan Shilling","USD":"United States Dollar","UYU":"Uruguayan Peso","UZS":"Uzbekistan Som","VEF":"Venezuelan Bol\u00edvar Fuerte","VND":"Vietnamese Dong","VUV":"Vanuatu Vatu","WST":"Samoan Tala","XAF":"CFA Franc BEAC","XAG":"Silver (troy ounce)","XAU":"Gold (troy ounce)","XCD":"East Caribbean Dollar","XDR":"Special Drawing Rights","XOF":"CFA Franc BCEAO","XPF":"CFP Franc","YER":"Yemeni Rial","ZAR":"South African Rand","ZMK":"Zambian Kwacha (pre-2013)","ZMW":"Zambian Kwacha","ZWL":"Zimbabwean Dollar"}

// export const currenciesFixerSymbolsOnly = Object.keys(currenciesFixerFull);
export const currenciesFixerSymbolsOnly = ['EUR','PHP','HUF','SGD','CZK','RUB','ILS','JPY','DKK','CAD','MYR','AUD','THB','TRY','NOK','MXN','CNY','KRW','GBP','RON','HKD','INR','CHF','HRK','BRL','NZD','PLN','BGN','IDR','ISK','USD','SEK','ZAR'].sort();

export const getRateFromFixer = async (sellCurrency, buyCurrency) => {
  try{
    const fixerRes = await fetch(`https://api.exchangeratesapi.io/api/latest?base=${sellCurrency}&symbols=${buyCurrency}`)
    const fixer = await fixerRes.json()
    const rate = fixer.rates[buyCurrency]
    return rate
  }catch (fixerError){
    console.error('fixerError')
    console.error(fixerError)
    return null
  }
}
