import SSLCommerzPayment from 'sslcommerz-lts';
import { env } from './env.js';

const store_id = env.SSL_STORE_ID;
const store_passwd = env.SSL_STORE_PASS;
const is_live = !env.IS_SANDBOX;

if (!store_id || !store_passwd) {
  throw new Error('SSLCommerz store credentials are not defined in environment variables.');
}

export const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
