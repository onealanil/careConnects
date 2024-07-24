import { create } from "zustand";
import { axios_auth } from "../../../global/config";

export const UserStore = create((set) => ({
  favCount: 0, // initial state
  setCount: count => set({ favCount: count }),
  editProfile: async (id, data) => {
    try {
      const response = await axios_auth.put(`/user/edit-profile/${id}`, data);
      if (response.data.status === "pending") {
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
  updatePhoneNumber: async (phone) => {
    try {
      const response = await axios_auth.put(`/user/update-phone`, {
        phone: phone,
      });
      if (response.data.status === "pending") {
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
  getWorkinginfo: async () => {
    try {
      const response = await axios_auth.get(`/work/work-info`);
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

  editWorkingStatus: async (status, id) => {
    try {
      const response = await axios_auth.put(`/work/working-status`, {
        workingStatus: status,
        assignedTo: id,
      });
      if (response.data.status === "pending") {
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
  getAllCareGiver: async () => {
    try {
      const response = await axios_auth.get(`/user/care-giver`);
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
  getAllUser: async () => {
    try {
      const response = await axios_auth.get(`/user/all-user`);
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
  getSingleUser: async (id) => {
    try {
      const response = await axios_auth.get(`/user/user/${id}`);
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
  getSingleUserProvider: async (id) => {
    try {
      const response = await axios_auth.get(`/user/user/provider/${id}`);
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

  saveUser: async (id) => {
    try {
      const response = await axios_auth.put(`/user/save-user/${id}`);
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
  unSaveUser: async (id) => {
    try {
      const response = await axios_auth.put(`/user/unsave-user/${id}`);
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

  getSaveUser: async () => {
    try {
      const response = await axios_auth.get(`/user/saved-user`);
      if (response.status === 200) {
        set({favCount: response.data.count})
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
  getTopJobProvider: async () => {
    try {
      const response = await axios_auth.get(`/user/top-rated-job-provider`);
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
  logOut: async () => {
    try {
      await axios_auth.get(`/user/logout`);
      return true;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
}));
