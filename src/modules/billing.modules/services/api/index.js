import axios from '@/axios'

/* Afficher la liste des factures d'une association */
export const getInvoices = (credentials) => {
  return axios.get(`api/association/${credentials.assId}/facture/all`)
}

/* Get a given bill by its ID */
export const getInvoiceById = (credentials) => {
  return axios.get(`api/association/${credentials.assId}/facture/${credentials.invId}`)
}

/* Payer une facture selon le mode */
export const buyInvoice = (credentials) => {
  return axios(
    {
      method: 'post',
      url: `api/association/${credentials.assocId}/cycle/${credentials.cycle_id}/facture/${credentials.facture_id}/mode/${credentials.mode}/buy`,
      data: credentials.data
    }
  );
}

/* Appliquer un coupon*/
export const applyCoupon = (credentials) => {
  return axios.get(`api/association/${credentials.assId}/cycle/${credentials.cyId}/facture/${credentials.invId}/apply/coupon/${credentials.coupon}`)
}

/* Revert a coupon on a bill */
export const revertCoupon = (credentials) => {
  return axios.get(`api/association/${credentials.assId}/cycle/${credentials.cyId}/facture/${credentials.invId}/unapply/coupon/${credentials.coupon}`)
}
