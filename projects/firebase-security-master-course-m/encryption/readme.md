```javascript

import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

function signup(email, password) {
    const salt = randomBytes(16).toString('hex')
    const hashedPassword = scryptSync(password, salt, 64); // Used in crypto-mining! for proof of work

    const user = { email, password: `${salt}:${hashedPassword}` }
    users.push(user);

    return user;
}

function login(email, password){
    const user = users.find(v => v.email === email)

    const [salt, key] = user.password.split(':');
    const hashedBuffer = scryptSync(password, salt, 64)

    const keyBuffer = Buffer.from(key, 'hex');
    const match = timingSafeEqual(hashedBuffer, keyBuffer)

    if (match) {
        return 'login success!'
    } else {
        return 'login fail!'
    }
}

```

<h2> HMAC </h2>

JWT are examples of HMAC's.

```javascript
const { createHmac } = require('crypto')

const key = 'super-secret!'
const message= 'boo'

const hmac = createHmac('sha256', key).update(message).digest('hex')

console.log(hmac)

const key2 = 'other-password'
const hmac2 = createHmac('sha256', key2).update(message).digest('hex')

```

<h2> ENCRYPTION </h2>

Allows scrambling and descrambling of eggs.

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto') 

// Cipher
const message = 'i like turtles :D';
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);

const encryptedMessage = cipher.update(message, 'utf8', 'hex')
                        + cipher.final('hex')

// DeCipher

const decipher = createDecipheriv('aes256', key, iv)
const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8')
                        + decipher.final('utf8')
```

<h2> KEYPAIRS </h2>

```javascript
const { generateKeyPairSync } = require('crypto')

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // Length of key in bits.
    publicKeyEncoding: {
        type: 'spki', // Recommended encryption type.
        format: 'pem' // Specify Base64 Format
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem' // Specify Base64 Format
        // cipher: 'aes-256-cbc',
        // passphrase: 'topsecret', // EXTRA THICC SECURITY
    }
})

console.log(publicKey);
console.log(privateKey);
```

<h2> ASYMMETRIC ENCRYPTION </h2>

Chrome, Firefox and other browsers use this type of public / secret key encryption methodology for securing data from sniffers.



```javascript
const { publicEncrypt, privateDecrypt } = require('crypto')
const { publicKey, privateKey } = require('./keypair')

const message = 'the british are coming!'

const encryptedData = publicEncrypt(
    publicKey,
    Buffer.from(message)
)

console.log(encryptedData.toString('hex'))

const decryptedData = privateDecrypt(
    privatekey,
    encryptedData
)
```

<h2> SIGNING </h2>

To trust that a message came from the right person, we must use their blood...<br>
(Just sign it)<br>
Sender of the message uses their private key to sign a hash of the original
message, the private key ensures authenticity.

```javascript
const { createSign, createVerify } = require('crypto')
const { publicKey, privateKey } = require('./keypair')

const message = 'this data must be signed'

/// sign

const signer = createSign('rsa-sha256')

signer.update(message);

const signature = signer.sign(privateKey, 'hex')

/// verify

const verifier = createVerify('rsa-sha256');

verifier.update(message);

const isVerified = verifier.verify(public, signature, 'hex')
```