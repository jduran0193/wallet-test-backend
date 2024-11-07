export default () => ({
  port: parseInt(process.env.PORT, 10) || 5800,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'tu-email@gmail.com',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'tu-secret-key',
    expiresIn: '1h',
  },
});
