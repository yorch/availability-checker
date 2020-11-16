const { format } = require('date-fns');

const formatDateTime = (date) => format(date, 'yyyyMMdd-HHmmss');

const formatCurrentDateTime = () => formatDateTime(new Date());

module.exports = {
    formatDateTime,
    formatCurrentDateTime,
};
