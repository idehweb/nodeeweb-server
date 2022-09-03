console.log('#request')

import axios from "axios";

export default (options, callback=()=>({})) => {
  console.log('options',options);
  if(options['body']){
    options['data']=options['body'];
    delete options['body'];
  }
  if(options['method']){
    options['method']=options['method'].toLowerCase();
  }
  // return console.log(options);
  return new Promise(function(resolve, reject) {
    axios(options).then(e =>resolve(callback(null,e,e.data))).catch(error=>reject(error));
  });
  // return axios.create({
  //   baseURL: ADMIN_ROUTE,
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   // add Authorization token to header
  //   transformRequest: [
  //     (data, headers) => {
  //       headers.token = localStorage.getItem('token') || '';
  //       return data;
  //     },
  //   ],
  // })

};

