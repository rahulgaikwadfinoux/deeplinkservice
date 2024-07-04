import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import serveIndex from 'serve-index';
// import path from 'path';
// import { dirname } from 'path';
import path from 'path';

const app = express();
app.use(cors());

const PORT = 5000;

const pathWell = path.join('.well-known');

// app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));
app.use('/.well-known', express.static(path.join('.well-known')));

const sever = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use(express.json());


app.get('/', (req, res) => {
  res.send("hiii");
});

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

  if (isAndroid) {
    // Android: Try to open the app, fall back to Play Store if not installed
    const androidDeepLink = generateDeepLink('android');
    res.redirect(androidDeepLink);
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

