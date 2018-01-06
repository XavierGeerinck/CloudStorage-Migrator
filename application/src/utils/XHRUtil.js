export function fetchWithProgress(url, opts = {}, onProgress) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);

    // let headers;
    // if (opts.headers instanceof Headers) {
    //   for (let k of opts.headers || {}) {
    //     console.log(k);
    //     xhr.setRequestHeader(k, headers[k]);
    //   }
    // } else {    
    //   for (let k in opts.headers || {}) {
    //     xhr.setRequestHeader(k, headers[k]);
    //   }
    // }

    for (let [key, value] of opts.headers || {}) {
      xhr.setRequestHeader(key, value);
    }

    xhr.onload = e => resolve(e.target.responseText);
    xhr.onerror = reject;

    if (xhr.upload && onProgress) {
      // event.lengthComputable
      // event.loaded ==> how many bytes uploaded
      // event.total  ==> total size to upload
      xhr.upload.onprogress = onProgress; 
    }

    xhr.send(opts.body);
  });
}
