import convict from "convict";
import dotenv from "dotenv";
dotenv.config();

const config = convict({
  db: {
    user: {
      doc: "DB user",
      env: "ASTEA_INTERN_DB_USER",
      default: "postgres",
    },
    password: {
      doc: "DB password",
      env: "ASTEA_INTERN_DB_PASS",
      default: "postgres",
    },
    host: {
      env: "ASTEA_INTERN_DB_HOST",
      default: "localhost",
    },
    port: {
      env: "ASTEA_INTERN_DB_PORT",
      format: "port",
      default: 1234,
    },
    database: {
      doc: "DB name",
      env: "ASTEA_INTERN_DB_NAME",
      default: "postgres",
    },
    testDatabase: {
      doc: "DB name for testing",
      env: "ASTEA_INTERN_TEST_DB_NAME",
      default: "movies_project",
    },
  },
  port: {
    env: "ASTEA_INTERN_SERVER_PORT",
    format: "port",
    default: 3000,
  },
  jwt: {
    privateKey: {
      doc: "JWT private key",
      env: "ASTEA_INTERN_JWT_PRIVATE_KEY",
      default: "movies_private_key",
    },
    expiryTime: {
      doc: "JWT key expiry time",
      env: "ASTEA_INTERN_JWT_EXPIRY_TIME",
      default: "1h",
    },
  },
});

config.validate();

export { config };
