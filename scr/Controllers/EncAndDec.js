var crypto = require('crypto');

var algorithm = 'aes-256-cbc'; // or any other algorithm supported by OpenSSL
exports.Encryption = (Text,key='5ec2b99f5795860004c9a324')=>{
    var cipher = crypto.createCipher(algorithm, key);  
    var encrypted = cipher.update(Text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted
    
}
exports.Decryption = (Text,key='5ec2b99f5795860004c9a324')=>{
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(Text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted
}
