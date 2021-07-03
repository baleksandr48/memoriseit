import * as jwt from 'jsonwebtoken';
const email = process.argv[2];
console.log(jwt.sign({ email }, 'secret'));
