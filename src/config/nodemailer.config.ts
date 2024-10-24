import nodemailer from 'nodemailer'

const emailHost: string = process.env.EMAIL_HOST as string
const email: string = process.env.EMAIL as string
const password: string = process.env.EMAIL_PASSWORD as string

export const emailTransporter = nodemailer.createTransport({
  host: emailHost,
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: password
  }
})