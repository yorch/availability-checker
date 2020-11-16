const { SmsSender } = require('simple-sms-sender');

const {
    sms: {
        enable,
        twilio: { accountSid, from, secret, sid },
        toNumbers,
    },
} = require('../config');

const sendSms = ({ content, logger }) => {
    if (!enable) {
        return;
    }

    const smsSender = new SmsSender({
        accountSid,
        fromNumber: from,
        logger,
        secret,
        sid,
    });

    return smsSender.sendSms({
        body: content,
        recipients: toNumbers.split(','),
    });
};

module.exports = {
    sendSms,
};
