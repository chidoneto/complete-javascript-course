import { TIMEOUT_SECS } from './config.js';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async url => {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECS)]);
    const data = await res.json();
    // console.log(data);
    if (!res.ok) throw new Error(`${data.message} [${res.status}]`);
    return data;
  } catch (err) {
    throw err;
  }
}