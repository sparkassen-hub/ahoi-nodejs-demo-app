const request = async (method, endpoint, params) => {
  const access_token = localStorage.getItem('ahoidemo_access_token');
  const authorization = access_token ? `Bearer ${access_token}` : null;
  const options = {
    method: method,
    compress: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      accept: 'application/json',
      authorization
    },
  };
  const url = endpoint.startsWith('http') || endpoint.startsWith('//') ? endpoint : new URL(`${location.origin}${endpoint}`);
  if (params) {
    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
      url.search = new URLSearchParams(params);
    } else {
      options.body = Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&')
    }
  }
  const response = await fetch(url, options);
  const jsonData = await response.json();
  if (response.status >= 400 && response.status < 600) {
    throw (JSON.stringify(jsonData));
  }
  return jsonData;
}