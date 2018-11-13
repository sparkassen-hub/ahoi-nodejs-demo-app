// see: src/ahoi/controllers/testahoi.controller.ts
const registerUser = async () => {
  return await request('GET', '/ahoi/installationid');
}

// see: src/ahoi/controllers/providers.controller.ts
const getBankList = async () => {
  const params = { supported: true };
  return await request('GET', '/ahoi/providers', params);
}

// see: src/ahoi/controllers/access.controller.ts
const grantBankAccess = async (bankid, username, pin) => {
  const params = {
    providerid: bankid,
    username: username,
    pin: pin,
  };
  return request('POST', '/ahoi/accesses', params);
}

// see: src/ahoi/controllers/accounts.controller.ts
const getBankAccounts = async (accessid) => {
  const params = { accessid };
  return request('GET', '/ahoi/accounts', params);
}

// see: src/ahoi/controllers/accounts.controller.ts
const deleteBankAccount = async (accessid, accountid) => {
  const params = { accessid, accountid };
  return request('DELETE', '/ahoi/accounts/delete', params);
}

// see: src/ahoi/controllers/transactions.controller.ts
const getTransactions = async () => {
  const transactionsList = [];
  const accesses = await request('GET', '/ahoi/accesses');
  if (!accesses || !accesses.length) {
    throw new Error('Could not retrive bank accesses. Did you grant access to bank accounts?');
  }
  for (const access of accesses) {
    const accounts = await getBankAccounts(access.id);
    for (const account of accounts) {
      const params = {
        accessid: access.id,
        accountid: account.id,
        count: 3, // 3 month
      };
      const transactions = await request('GET', '/ahoi/transactionsmonthly', params);
      transactionsList.push({
        blz: account.number,
        transactions,
      });
    }
  }
  return transactionsList;
}
