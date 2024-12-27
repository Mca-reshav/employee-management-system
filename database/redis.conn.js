const redis = require("redis");
const { redisCache } = require("../config/main.config");
const { error, success } = require("../services/response.sv");

exports.client = redis.createClient({
  url: redisCache.url,
  password: redisCache.password,
});

(async () => {
  await this.client.connect();
})();

this.client.on("error", function (e) {
  error(e);
});

this.client.on("connect", function () {
  success(true, "REDIS");
});
