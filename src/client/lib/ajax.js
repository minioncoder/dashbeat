'use strict';

export default function ajax(url, method="GET") {
  return new Promise(function(resolve, reject) {
    console.log(`Grabbing: ${url}`);

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState != XMLHttpRequest.DONE) return;
      if (ajax.status != 200) {
        reject(ajax);
        return;
      }

      resolve(JSON.parse(ajax.responseText));
    };

    ajax.open(method.toUpperCase(), url, true);
    ajax.send();
  });
}
