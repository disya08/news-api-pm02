const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  development: {
    connection: {
      database: "news_dev",
      user: "postgres",
      password: "1234",
    },
  },
  test: {
    connection: {
      database: "news_test",
      user: "postgres",
      password: "1234",
    },
  },
};
console.log("env in knexfile", ENV);
module.exports = { ...customConfig[ENV], ...baseConfig };
