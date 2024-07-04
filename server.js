import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import serveIndex from 'serve-index';
// import path from 'path';
// import { dirname } from 'path';
import path from 'path';
// import * as xy from 'express';


const app = express();
app.use(cors());

const PORT = 5000;

const pathWell = path.join('.well-known');

// const middleware = function (req, res, next) {
//   // console.log('LOGGED')
//   next()
// }

// app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));
// app.use('/.well-known', express.static(path.join('.well-known')));


// app.use(middleware,)
0
const sever = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use(express.json());


app.get('/', (req, res) => {
  res.send("hiii");
});

app.get('/.well-known/assetlinks.json', (req, res) => {
  res.send(
    [{
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app", "package_name": "com.alramz.alramz",
        "sha256_cert_fingerprints": ["FC:9E:EA:FE:41:2C:68:C8:76:13:26:2C:86:05:A0:BE:1E:26:03:83:30:97:B5:5F:FF:FC:01:98:CB:73:5B:59"]
      }
    }]
  );
});
// [
//   {
//     "relation": [
//       "delegate_permission/common.handle_all_urls"
//     ],
//     "target": {
//       "namespace": "android_app",
//       "package_name": "com.example.deeplinktest",
//       "sha256_cert_fingerprints": [
//         "57:E4:D7:71:38:74:41:B8:07:44:61:A7:C1:75:E7:15:85:2B:85:CA:29:39:4A:D3:CB:0C:E7:44:7F:51:78:A9"
//       ]
//     }
//   }
// ]



const WEBSITE_URL = 'https://finouxuat.alramz.ae/';
const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.alramz.alramz&hl=en';
const IOS_APP_URL = 'https://apps.apple.com/in/app/al-ramz-trade-invest/id6448725085';
const ANDROID_PACKAGE_NAME = 'com.alramz.alramz';
const IOS_BUNDLE_ID = 'com.alramz.alramz';

// Helper function to detect if app is installed (based on deep link handling)
const generateDeepLink = (platform) => {
  if (platform === 'android') {
    return `intent://path#Intent;scheme=https;package=${ANDROID_PACKAGE_NAME};end`;
  } else if (platform === 'ios') {
    return `alramztradeinvest://path`;
  }
  return null;
};

app.get('/universal-link', (req, res) => {
  const userAgent = req.headers['user-agent'];

  // Detect platform
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  res.redirect(WEBSITE_URL);


  if (isAndroid) {
    // Android: Try to open the app, fall back to Play Store if not installed
    // const androidDeepLink = generateDeepLink('android');
    // res.redirect(androidDeepLink);
    res.redirect(WEBSITE_URL);

  } else if (isIOS) {
    // iOS: Try to open the app, fall back to App Store if not installed
    const iosDeepLink = generateDeepLink('ios');
    res.redirect(iosDeepLink);
  } else {
    // Fallback to website
    res.redirect(WEBSITE_URL);
  }
});

process.on('unhandlededRejection', (error, data) => {
  server.close(() => process.exit(1));
});

