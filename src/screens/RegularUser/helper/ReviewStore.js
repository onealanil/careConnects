import {create} from 'zustand';
import { axios_auth } from '../../../global/config';

export const ReviewStore = create(set => ({
  createReview: async (
    reviewedBy,
    reviewedTo,
    review,
    rating,
  ) => {
    try {
      const response = await axios_auth.post(`/review/createReview`, {
        reviewedBy,
        reviewedTo,
        review,
        rating,
      });
      if (response.status === 200) {
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

  getReview: async (id) => {
    try {
      const response = await axios_auth.get(
        `/review/getReviewByProvider/${id}`,
      );
      if (response.status === 200) {
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
  getAverageRating: async (id) => {
    try {
      const response = await axios_auth.get(`/review/getAverageRating/${id}`);
      if (response.status === 200) {
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
  createNotification: async (
    senderId,
    recipientId,
    notification,
  ) => {
    try {
      const response = await axios_auth.post(
        `/notification/createNotification`,
        {
          senderId,
          recipientId,
          notification,
        },
      );
      if (response.status === 200) {
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
  getNotificationById: async (id) => {
    try {
      const response = await axios_auth.get(
        `/notification/getNotificationByReceiver/${id}`,
      );
      if (response.status === 200) {
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
  readAllNotifications: async (id) => {
    //id --> conversation id
    try {
      const response = await axios_auth.put(`/notification/readAllNotifications`);
      if (response.status === 200) {
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
  }
}));
