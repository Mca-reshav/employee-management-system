module.exports = {
  port: process.env.PORT,

  jwtConfig: {
    access: {
      secretKey: "111ab111-4444-4444-8000-666666666666",
      expiresIn: "1h",
    },
    refresh: {
      secretKey: "111cd111-4444-4444-8000-666666666666",
      expiresIn: "3d",
    },
    mobile: {
      secretKey: "111ef111-4444-4444-8000-666666666666",
      expiresIn: "1h",
    },
  },

  webPageDomain: [process.env.ORIGIN, "http://127.0.0.1:5500/"],

  mongoDB: {
    protocol: "mongodb",
    host: process.env.HOST,
    database: process.env.DATABASE,
    queryLogs: true,
  },

  redisCache: {
    url: process.env.URL,
    password: process.env.PASSWORD,
  },
};
