import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const KhaltiStore = create(set => ({
  createPayment: async (
    PaymentBy,
    PaymentTo,
    amount,
    khaltiNumber,
  ) => {
    try {
      const response = await axios_auth.post(`/payment/createPayment/`, {
        PaymentBy,
        PaymentTo,
        amount,
        khaltiNumber
      });
      if (response.status == 200) {
        return response.data;
      }
      return [];
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
  clearWorkingStatus: async ()=> {
    try{
      const response = await axios_auth.get(`/work/clear-status`);
      if(response.status == 200){
        return response.data;
      }
      return [];
    }
    catch(error){
      if(error.response){
        throw new Error(error.response.data.message);
      }else{
        throw new Error(error.message);
      }
    }
  }
//   getPaymentByUser: async () => {
//     try {
//       const response = await axios_auth.get(`/payment/getPaymentByProvider`);
//       if (response.status == 200) {
//         return response.data;
//       }
//       return [];
//     } catch (error: any) {
//       if (error.response) {
//         throw new Error(error.response.data.message);
//       } else {
//         throw new Error(error.message);
//       }
//     }
//   },
//   updateKhaltiNumber: async (id: string, recieverNumber: string) => {
//     try {
//       const response = await axios_auth.put(
//         `/payment/updateKhalitNumber/${id}`,
//         {
//           recieverNumber,
//         },
//       );
//       if (response.status == 200) {
//         return response.data;
//       }
//       return [];
//     } catch (error: any) {
//       if (error.response) {
//         throw new Error(error.response.data.message);
//       } else {
//         throw new Error(error.message);
//       }
//     }
//   },
}));
