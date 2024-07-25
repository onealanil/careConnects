import {create} from 'zustand';
import {axios_auth} from './config';

export const useNotificationCount = create(set => ({
  notificationCount: 0,
  setNotificationCount: count => set({notificationCount: count}),
  unreadNotification: async () => {
    try {
      const response = await axios_auth.get('/notification/unreadNotification');
      if (response.status === 200) {
        set({notificationCount: response.data.result});
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
