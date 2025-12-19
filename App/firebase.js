const admin = require("firebase-admin");
const fs = require("fs");

let serviceAccount;

if (process.env.RENDER) {
  // ✅ Render environment
  serviceAccount = require("/etc/secrets/serviceAccount.json");
} else {
  // ✅ Local environment
  serviceAccount = require("./serviceAccount.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
