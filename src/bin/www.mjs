/**
 * Module dependencies.
 */
import './../../loadEnv.mjs';

import appBuilder from '../../appBuilder.mjs';
// import debugLib from 'debug';
// import VARIABLE from '#v/variables';
// const debug = debugLib('your-project-name:server');

/**
 * Get port from environment and store in Express.
 */
const theApp=(props)=> {
    // console.log('www props:', props);
    let app = appBuilder(props);
    // console.log('app is ready...');
};
theApp({})
export default theApp