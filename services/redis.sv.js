const { client } = require("../database/redis.conn");
const { message } = require("./messages.sv");
const { success, error } = require("./response.sv");

exports.setDataRedis = async function (opts) {
  opts.expire = opts.expire != undefined ? opts.expire : 0;
  return new Promise(async (resolve, reject) => {
    try {
      if (Object.entries(opts.value).length > 0) {
        opts.value = JSON.stringify(opts.value);
      }
      let set = await client.set(opts.key, opts.value, {
        EX: opts.expire,
        NX: true,
      });

      if (set == "OK") {
        success(true, message.REDIS.SET)
        resolve(true);
      }

      resolve(false);
    } catch (err) {
      error(err)
      resolve(false);
    }
  });
};

exports.updateDataRedis = async function (opts) {
  opts.expire = opts.expire != undefined ? opts.expire : 0;
  return new Promise(async (resolve, reject) => {
    try {
      if (Object.entries(opts.value).length > 0) {
        opts.value = JSON.stringify(opts.value);
      }
      await client.del(opts.key);
      let set = await client.set(opts.key, opts.value, {
        EX: opts.expire,
        NX: true,
      });

      if (set == "OK") {
        success(true, message.REDIS.UPDATE)
        resolve(true);
      }

      resolve(false);
    } catch (error) {
      error(err);
      resolve(false);
    }
  });
};

exports.getDataRedis = async function (opts) {
  return new Promise(async (resolve, reject) => {
    try {
      let get = await client.get(opts.key);

      try {
        get = JSON.parse(get);
      } catch (error) {
        get = get;
      }

      resolve(get);
    } catch (error) {
      error(err);
      resolve(false);
    }
  });
};

exports.deleteDataRedis = async function (opts) {
  return new Promise(async (resolve, reject) => {
    try {
      let get = await client.del(opts.key);
      resolve(get);
    } catch (err) {
      error(err);
      resolve(false);
    }
  });
};
