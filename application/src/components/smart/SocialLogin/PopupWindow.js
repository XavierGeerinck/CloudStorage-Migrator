import { toQuery } from '../../../utils/QueryUtils';
import queryString from 'query-string';

class PopupWindow {
  constructor(id, url, successUrl, errorUrl, options = {}) {
    this.id = id;
    this.url = url;
    this.options = options;
    this.successUrl = successUrl;
    this.errorUrl = errorUrl;
  }

  open() {
    const { url, id, options } = this;
    this.window = window.open(url, id, toQuery(options, ','));
  }

  close() {
    this.cancel();
    this.window.close();
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      this._iid = window.setInterval(() => {
        try {
          const popup = this.window;

          if (!popup || popup.closed !== false) {
            this.close();

            reject(new Error('The popup was closed'));

            return;
          }

          // On success, close and resolve
          if (popup.location.indexOf(this.successUrl) > -1) {
            const params = queryString.parse(popup.location.split('?')[1]);
            resolve(params);
            this.close();
          } else if (popup.location.indexOf(this.errorUrl) > -1) {
            const params = queryString.parse(popup.location.split('?')[1]);
            reject(params);
            this.close();
          } else {
            return;
          }
        } catch (error) {
          /*
           * Ignore DOMException: Blocked a frame with origin from accessing a
           * cross-origin frame.
           */
        }
      }, 500);
    });
  }

  cancel() {
    if (this._iid) {
      window.clearInterval(this._iid);
      this._iid = null;
    }
  }

  then(...args) {
    return this.promise.then(...args);
  }

  catch(...args) {
    return this.promise.then(...args);
  }

  static open(...args) {
    const popup = new this(...args);

    popup.open();
    popup.poll();

    return popup;
  }
}

export default PopupWindow;