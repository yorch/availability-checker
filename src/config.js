const { env } = process;

module.exports = {
    cronSchedule: env.CRON_SCHEDULE,
    dataDirectory: env.DATA_DIR || './data',
    logsDirectory: env.LOGS_DIR || './logs',
    screenshotsDirectory: env.SCREENSHOTS_DIR || './screenshots',
    logLevel: env.LOG_LEVEL || 'info',
    nodeEnv: env.NODE_ENV || 'development',
    scrapper: {
        disableHeadless: Boolean(env.SCRAPPER_DISABLE_HEADLESS) || false,
        saveScreenshot: Boolean(env.SCRAPPER_SAVE_SCREENSHOT) || false,
        timeout: Number(env.SCRAPPER_TIMEOUT) || 60 * 1000,
        // https://developers.whatismybrowser.com/useragents/explore/software_name/chrome/
        userAgent:
            env.SCRAPPER_USER_AGENT ||
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    },
    email: {
        enable: env.EMAIL_ENABLE === 'true',
        smtp: {
            host: env.SMTP_HOST,
            port: Number(env.SMTP_PORT),
            // true for 465, false for other ports
            secure: env.SMTP_IS_SECURE === 'true',
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
        from: {
            email: env.EMAIL_FROM_ADDRESS,
            name: env.EMAIL_FROM_NAME,
        },
        subject: env.EMAIL_SUBJECT,
        // Can have multiple emails separated by comma
        toEmail: env.EMAIL_TO_ADDRESS,
    },
    sms: {
        enable: env.SMS_ENABLE === 'true',
        toNumbers: env.SMS_TO_NUMBERS,
        twilio: {
            accountSid: env.TWILIO_ACCOUNT_SID,
            from: env.TWILIO_FROM,
            messagingServiceSid: env.TWILIO_MESSAGING_SERVICE_SID,
            secret: env.TWILIO_SECRET,
            sid: env.TWILIO_SID,
        },
    },
    pushbullet: {
        enable: env.PUSHBULLET_ENABLE === 'true',
        apiToken: env.PUSHBULLET_API_TOKEN,
        deviceId: env.PUSHBULLET_DEVICE_ID,
        noteTitle: env.PUSHBULLET_NODE_TITLE,
    },
};
