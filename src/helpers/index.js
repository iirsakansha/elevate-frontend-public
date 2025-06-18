// In src/helpers/helper.js (or src/helpers.js, depending on your file name)
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
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  },

  deleteAllCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },

  getResourceUrl(url) {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    return `${API_BASE_URL}/${url.replace(/^\//, '')}`;
  },

  percentageValidator(fieldName) {
    return () => ({
      validator(_, value) {
        if (value === undefined || value === null || value < 0 || value > 100) {
          return Promise.reject(new Error(`${fieldName} must be between 0 and 100`));
        }
        return Promise.resolve();
      },
    });
  },

  positiveValidator(fieldName) {
    return () => ({
      validator(_, value) {
        if (value === undefined || value === null || value <= 0) {
          return Promise.reject(new Error(`${fieldName} must be greater than 0`));
        }
        return Promise.resolve();
      },
    });
  },

  moreThanZeroValidator(fieldName) {
    return () => ({
      validator(_, value) {
        if (value === undefined || value === null || value <= 0) {
          return Promise.reject(new Error(`${fieldName} must be greater than 0`));
        }
        return Promise.resolve();
      },
    });
  },
};