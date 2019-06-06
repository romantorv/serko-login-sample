import * as debug from 'debug';

const store = debug('dev_env:store');
const log = debug('dev_env:log');
const error = debug('dev_env:error');

export { store, log, error };