import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'carolinaeyokoyama@gmail.com',
    pass: 'dhmlqsktmyqhleuh'
  }

})