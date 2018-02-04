import React from 'react';
import * as R from 'ramda';

import makeTick from '../utils/makeTick';

const Loader = ({ tick, text }) => (
	<span>{`${text || ''} . ${R.repeat('.', tick % 4).join(' ')}`}</span>
)

export default makeTick(Loader, 500)