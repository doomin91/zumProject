"use strict";
import { Date } from 'core-js';
/* eslint-disable no-unused-vars */
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = Buffer.from('As0aoO915fgjSBsaoq2E2qosk9bOa0spmaneslPpSQm', 'base64');
const IV_LENGTH = 16;

export function getCurrentDate(form){
    const Now = new Date();
    const Y = Now.getFullYear();
    const MO = Now.getMonth() + 1;
    const OMO = MO >= 10 ? MO : "0" + MO;
    const D = Now.getDate();
    const OD = D >= 10 ? D : "0" + D;
    const H = Now.getHours();
    const M = Now.getMinutes();
    const S = Now.getSeconds();
    let date;
    if (form == "YmdHis") {
        date = Y + OMO + OD + H + M + S;
    } else if (form == "yyyymmdd") {
        date = Y + "-" + OMO + "-" + OD;
    } else if (form == "Y-m-d H:i:s"){
        date = Y + "-" + OMO + "-" + OD + " " + H + ":" + M + ":" + S;
    }
    return date;
}

export function getExtension(fileName){
    const fileLength = fileName.length;
    const lastDot = fileName.lastIndexOf('.');
    const fileExtension = fileName.substring(lastDot+1, fileLength);

    return fileExtension;
}

export function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        return false;
    }
}