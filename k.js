//32 bytes
require('crypto').randomBytes(32, function(err, buffer) {
    var token1 = buffer.toString('base64');
    console.log(token1);
});

//64 bytes
require('crypto').randomBytes(64, function(err, buffer) {
    var token2 = buffer.toString('base64');
    console.log(token2);
});



