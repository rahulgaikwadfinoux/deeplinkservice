import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import path from 'path';
import bodyParser from 'body-parser';
import { createTransport } from 'nodemailer';
import { connect } from 'imap-simple';


const app = express();
app.use(cors());

const PORT = 5000;

const pathWell = path.join('.well-known');

app.use(bodyParser.json());

const config = {
  imap: {
    user: '66e4be22176c55',
    password: '7b1f1aad78ed39',
    host: 'sandbox.smtp.mailtrap.io', // e.g., 'imap.gmail.com' for Gmail
    port: 465,
    tls: true,
    authTimeout: 3000,
  }
};

app.get('/sendmail', async (req, res) => {
  // const connection = await imaps.connect({ imap: config.imap });
  const transporter = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "66e4be22176c55",
      pass: "7b1f1aad78ed39"
    }
  });

  const mailOptions = {
    from: 'your-email@example.com', // sender address
    to: "rahulkishorgaikwad@gmail.com", // list of receivers
    subject: "subject", // Subject line
    text: "0123456", // plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }

})
app.get('/getotp', async (req, res) => {
  try {
    const connection = await connect({ imap: config.imap });
    await connection.openBox('Inbox');

    const searchCriteria = [];
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
    const results = await connection.search(searchCriteria, fetchOptions);
    const messages = results.map(res => res.parts.filter(part => part.which === 'TEXT')[0].body);

    const otp = extractOTP(messages);
    res.json({ otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function extractOTP(messages) {
  const otpRegex = /\b\d{6}\b/; // Assuming OTP is a 6-digit number
  for (let message of messages) {
    const match = message.match(otpRegex);
    if (match) {
      return match[0];
    }
  }
  return null;
}

const sever = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use(express.json());


app.get('/', (req, res) => {
  res.send("hiii");
});

app.get('/.well-known/assetlinks.json', (req, res) => {
  res.send(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],

        target: {
          namespace: "android_app",
          package_name: "com.alramz.alramz.uat",
          sha256_cert_fingerprints: [
            "81:12:FB:5A:64:E0:D7:EF:26:C3:73:C5:64:C4:4F:85:AB:96:D1:F8:D8:64:DB:6B:74:0C:40:1A:3C:B4:C0:45",
          ],
        },
      },
    ]
  );
});

app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.send({
    "applinks": {
      "apps": [],
      "details": [
        {
          "appID": "SRY6EG2SX6.com.alramz.alramz.uat",
          "paths": ["*"]
        }
      ]
    }
  });
});


// [{
//   "relation": ["delegate_permission/common.handle_all_urls"],
//   "target": {
//     "namespace": "android_app", "package_name": "com.alramz.alramz",
//     "sha256_cert_fingerprints": ["FC:9E:EA:FE:41:2C:68:C8:76:13:26:2C:86:05:A0:BE:1E:26:03:83:30:97:B5:5F:FF:FC:01:98:CB:73:5B:59"]
//   }
// }]

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



const WEBSITE_URL = 'https://webtrade.alramz.ae/';
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

  // res.redirect(WEBSITE_URL);


  if (isAndroid) {
    // Android: Try to open the app, fall back to Play Store if not installed
    const androidDeepLink = generateDeepLink('android');
    res.redirect(androidDeepLink);
    // res.redirect(WEBSITE_URL);

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

