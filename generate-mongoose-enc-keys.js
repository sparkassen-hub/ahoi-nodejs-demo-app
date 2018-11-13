function generate(length) {
  require('crypto').randomBytes(length, (err, buffer) => {
    console.log(buffer.toString('base64'));
  });
}

generate(32);
generate(64);