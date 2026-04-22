declare module 'sslcommerz-lts' {
  export interface SSLCommerzInitResponse {
    status: string;
    failedreason: string;
    sessionkey: string;
    gw: {
      visa: string;
      master: string;
      amex: string;
      other: string;
      rocket: string;
      bkash: string;
      dbbl: string;
      visacard: string;
      mastercard: string;
      amexcard: string;
      internetbanking: string;
      mobilebanking: string;
      othercard: string;
      cards: string;
    };
    redirectGatewayURL: string;
    GatewayPageURL: string;
    storeBanner: string;
    storeLogo: string;
    desc: any[];
    is_direct_pay_enable: string;
  }

  export interface SSLCommerzPaymentData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_add2?: string;
    cus_city: string;
    cus_state?: string;
    cus_postcode: string;
    cus_country: string;
    cus_phone: string;
    cus_fax?: string;
    ship_name?: string;
    ship_add1?: string;
    ship_add2?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string;
    ship_country?: string;
    multi_card_name?: string;
    value_a?: string;
    value_b?: string;
    value_c?: string;
    value_d?: string;
  }

  export interface SSLCommerzValidationResponse {
    status: string;
    tran_id: string;
    val_id: string;
    amount: string;
    store_amount: string;
    currency: string;
    bank_tran_id: string;
    card_type: string;
    card_no: string;
    card_issuer: string;
    card_brand: string;
    card_issuer_country: string;
    card_issuer_country_code: string;
    currency_type: string;
    currency_amount: string;
    currency_rate: string;
    base_fair: string;
    value_a?: string;
    value_b?: string;
    value_c?: string;
    value_d?: string;
    risk_level: string;
    risk_title: string;
  }

  class SSLCommerzPayment {
    constructor(store_id: string, store_passwd: string, is_live: boolean);
    init(data: SSLCommerzPaymentData): Promise<SSLCommerzInitResponse>;
    validate(data: { val_id: string }): Promise<SSLCommerzValidationResponse>;
    transactionQueryByTid(data: { tran_id: string }): Promise<any>;
    transactionQueryBySessionId(data: { session_id: string }): Promise<any>;
    refund(data: { bank_tran_id: string; refund_amount: number; refund_remark: string }): Promise<any>;
    refundQuery(data: { refund_ref_id: string }): Promise<any>;
  }

  export default SSLCommerzPayment;
}
