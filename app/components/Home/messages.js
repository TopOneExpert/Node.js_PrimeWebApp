/*
 * Home Messages
 *
 * This contains all the text for the Home component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Home';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Home component!',
  },
});
