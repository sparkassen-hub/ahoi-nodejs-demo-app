const SERVER_PORT = 3000;

const isAuthEnabled = async () => {
  const response = await request('GET', '/ahoi/providers');
  return response['error'] && response.error === 'Unauthorized';
}

const register = async (email, password) => {
  const params = {
    email: email,
    password: password,
  };
  return request('POST', '/registration', params);
}

const login = async (email, password) => {
  const params = {
    email: email,
    password: password,
  };
  return request('POST', '/login', params);
}

const deleteAccount = async (email, password) => {
  const params = {
    email: email,
    password: password,
  };
  return request('DELETE', '/deleteaccount', params);
}