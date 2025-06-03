import { getConfig } from "@testing-library/react";

export const Helpers = {
  setCookie(cName, cValue, expDays) {
    let date, expires;
    if (expDays) {
      date = new Date();
      date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
      expires = "expires=" + date.toUTCString();
    }

    document.cookie = expDays
      ? cName + "=" + cValue + "; " + expires + "; path=/"
      : cName + "=" + cValue + "; path=/";
  },
  getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  },
  deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },
  getResourceUrl(url) {
    return `${getConfig().API_BASE_URL}/${url}`;
  },
  percentageValidator(fieldName) {
    return () => ({
      validator(_, value) {
        if (value && (value > 100 || value < 1)) {
          return Promise.reject(`${fieldName} must be in between 1-100`);
        }
        return Promise.resolve();
      },
    });
  },
  positiveValidator(fieldName) {
    return () => ({
      validator(_, value) {
        if (value && value < 1) {
          return Promise.reject(`${fieldName} must be greater than 0`);
        }
        return Promise.resolve();
      },
    });
  },
  morethanZeroValidator(fieldName) {
    return () => ({
      validator(_, value) {
        if (value && value < 0) {
          return Promise.reject(`${fieldName} must be greater than 0`);
        }
        return Promise.resolve();
      },
    });
  },
};
