import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "developement" ? "http://localhost:5001" : "/"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  
  checkAuth: async () => {
    try {
        const res = await axiosInstance.get("/auth/user");
        if (res?.data?.success) {
            set({ authUser: res?.data?.data });
            get().connectSocket()
      }
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      if (res?.data?.success) {
          set({ authUser: res?.data?.data });
          get().connectSocket()
          toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res?.data?.success) {
        set({ authUser: res?.data?.data });
        get().connectSocket()
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      if (res?.data?.success) {
        get().disconnectSocket()
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("auth/update-profile", data);
      if (res?.data?.success) {
        set({ authUser: res?.data?.data });
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.success(res?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {authUser} = get()
    if(!authUser || get().socket?.connected) return

    const socket = io(BASE_URL ,{
        query:{
            userId : authUser?._id
        }
    })
    socket.connect()

    set({socket: socket})

    socket.on("getOnlineUsers", (userIds) => {
        set({onlineUsers: userIds})
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket?.disconnect()
  },
}));
