require('dotenv').config();
const twilio = require("twilio");
console.log(process.env);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber =process.env.TWILIO_PHONE_NUMBER;

console.log(accountSid);
console.log(authToken);
console.log(twilioPhoneNumber);
if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Twilio credentials are not properly configured.");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

const sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log("SMS sent:", message.sid);
    return message;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};

module.exports = sendSms;
