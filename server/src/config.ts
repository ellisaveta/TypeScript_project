import convict from "convict";
import dotenv from "dotenv";
dotenv.config();

const config = convict({
  db: {
    user: {
      doc: "DB user",
      env: "DB_USER",
      default: "postgres",
    },
    password: {
      doc: "DB password",
      env: "DB_PASS",
      default: "postgres",
    },
    host: {
      env: "DB_HOST",
      default: "localhost",
    },
    port: {
      env: "DB_PORT",
      format: "port",
      default: 1234,
    },
    database: {
      doc: "DB name",
      env: "DB_NAME",
      default: "postgres",
    },
    testDatabase: {
      doc: "DB name for testing",
      env: "TEST_DB_NAME",
      default: "movies_project",
    },
  },
  port: {
    env: "SERVER_PORT",
    format: "port",
    default: 3000,
  },
  jwt: {
    privateKey: {
      doc: "JWT private key",
      env: "JWT_PRIVATE_KEY",
      default: "movies_private_key",
    },
    expiryTime: {
      doc: "JWT key expiry time",
      env: "JWT_EXPIRY_TIME",
      default: "1h",
    },
  },
});

config.validate();

export { config };
