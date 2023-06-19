import { google } from 'googleapis';
import config from '../../config.mjs';

const googleConfig = {
  clientId: config.config.sso?.google?.['client-id'],
  clientSecret: config.config.sso?.google?.['client-secret'],
};

const defaultScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
// google.options({ auth: oauth2Client });

export default class GoogleApi {
  constructor(redirect) {
    this.api = new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      redirect
    );
  }

  get redirect_url() {
    return this.api.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: defaultScope,
    });
  }
  async verify(code) {
    const data = await this.api.getToken(code);
    this.tokens = data.tokens;
    return data.tokens;
  }
  async infoWithCredential(credential) {
    const user = await this.api.verifyIdToken({
      idToken: credential,
    });

    const payload = user.getPayload();
    return {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      extra: payload,
    };
  }
}

// var gf = {
//   createConnection: function () {
//     return new google.auth.OAuth2(
//       googleConfig.clientId,
//       googleConfig.clientSecret,
//       googleConfig.redirect
//     );
//   },

//   getConnectionUrl: function (auth) {
//     return auth.generateAuthUrl({
//       access_type: 'offline',
//       prompt: 'consent',
//       scope: defaultScope,
//     });
//   },

//   getGooglePlusApi: function (auth) {
//     return google.people({
//       version: 'v1',
//       auth: auth,
//     });
//   },

//   /**********/
//   /** MAIN **/

//   /**********/

//   /**
//    * Part 1: Create a Google URL and send to the client to log in the user.
//    */
//   urlGoogle: function () {
//     const auth = createConnection();
//     const url = getConnectionUrl(auth);
//     return url;
//   },

//   /**
//    * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
//    */
//   validateTokenWithGoogle: async function (code) {
//     const auth = await gf.createConnection();
//     const tokens = await code.tokenObj;
//     console.log(code);
//     await auth.setCredentials(tokens);
//     const people = await gf.getGooglePlusApi(auth);
//     const me = await people.people.get({
//       resourceName: 'people/me',
//       personFields: 'emailAddresses,names,photos',
//     });
//     return me.data;
//   },
//   getGoogleAccountFromCode: async function (code) {
//     // return new Promise((resolve, reject) => async function () {

//     const auth = await gf.createConnection();
//     const data = await auth.getToken(code);

//     const tokens = data.tokens;
//     console.log('tokens:', tokens);
//     await auth.setCredentials(tokens);

//     const people = gf.getGooglePlusApi(auth);
//     const me = await people.people.get({
//       resourceName: 'people/me',
//       personFields: 'emailAddresses,names,photos',
//     });
//     // const userGoogleId = me.data.id;
//     // const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;

//     // console.log(me.data);
//     return me.data;
//     // });
//   },

//   authenticate: function (scopes = defaultScope) {
//     return new Promise((resolve, reject) => {
//       // grab the url that will be used for authorization
//       const authorizeUrl = oauth2Client.generateAuthUrl({
//         access_type: 'offline',
//         prompt: 'consent',
//         scope: scopes,
//       });
//       resolve({
//         url: authorizeUrl,
//       });
//     });
//   },
//   validate: function (req) {
//     return new Promise((resolve, reject) => {
//       // const qs = new url.URL(req.url, 'http://localhost:3002')
//       // console.log(req.query.code);
//       oauth2Client.getToken(req.query.code).then(async function (tokens) {
//         await oauth2Client.setCredentials(tokens); // eslint-disable-line require-atomic-updates
//         // resolve(oauth2Client);
//         const plus = await google.plus({ version: 'v1', oauth2Client });
//         //
//         resolve(plus);

//         // google.
//         const me = await plus.people.get({ userId: 'me' });

//         await resolve(me.data.emails[0].value);

//         //     console.log(me);
//         //     const userEmail = me.data.emails[0].value;
//         //     resolve(me.data);
//         // });
//       });
//       // resolve(req.query.code);

//       //                 oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
//       //                 resolve(oauth2Client);
//     });
//   },
// };
// export default gf;
