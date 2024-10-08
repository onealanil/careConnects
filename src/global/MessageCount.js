import {create} from 'zustand';
import {axios_auth} from './config';


export const useMessageStore = create(set => ({
  messageCount: 0,
  setMessageCount: count => set({messageCount: count}),
  unreadMessageCount: async () => {
    try {
      const response = await axios_auth.get('/message/unreadMessage');
      if (response.status === 200) {
        set({messageCount: response.data.result});
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
}));
