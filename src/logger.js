const path = require('path');
const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const ROOT = path.dirname(__dirname);
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const LOG_PATH = path.resolve(ROOT, 'var/log');
const COMMON_LOG = path.join(LOG_PATH, 'todo.log');
const ERROR_LOG = path.join(LOG_PATH, 'todo.error.log');

const consoleTransport = new winston.transports.Console();

const fileTransport = new winstonDailyRotateFile({
  filename: `${COMMON_LOG}-%DATE%.log`,
  datePattern: 'YYYYMMDD-HH',
  maxSize: '10m',
  maxFiles: '0.1d'
});

const errorFileTransport = new winstonDailyRotateFile({
  filename: `${ERROR_LOG}-%DATE%.log`,
  datePattern: 'YYYYMMDD-HH',
  maxSize: '10m',
  maxFiles: '0.1d'
});

const winstonOptions = {
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.label({ label: 'TODO API' }),
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [consoleTransport, fileTransport],
  exceptionHandlers: [errorFileTransport]
};

const logger = winston.createLogger(winstonOptions);

module.exports = logger;
