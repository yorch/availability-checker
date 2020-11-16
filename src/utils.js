const { format } = require('date-fns');

const formatDateTime = (date) => format(date, 'yyyyMMddHHmmss');

const formatCurrentDateTime = () => formatDateTime(new Date());

module.exports = {
    formatDateTime,
    formatCurrentDateTime,
};
