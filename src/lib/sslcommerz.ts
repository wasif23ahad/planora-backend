import SSLCommerzPayment from 'sslcommerz-lts';
import { env } from './env.js';

const store_id = env.SSL_STORE_ID;
const store_passwd = env.SSL_STORE_PASS;
const is_live = !env.IS_SANDBOX;

export const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
