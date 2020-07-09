import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import { host, port, user, pass } from '../config/mail.json';
import handlebars from 'express-handlebars';

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

const viewEngine = handlebars.create({
  partialsDir: 'partials/',
  defaultLayout: undefined
});

transport.use(
  'compile',
  hbs({
    viewEngine: viewEngine,
    viewPath: path.resolve(__dirname, '../resourses/mail/auth')
  })
);

export default transport;
