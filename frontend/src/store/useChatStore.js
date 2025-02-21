import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {useAuthStore} from "../store/useAuthStore"

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({isUsersLoading: true})
    try {
        const res = await axiosInstance.get("/messages/users")
        console.log(res)
        if(res.data.success){
            set({users: res.data.data})
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }finally{
        set({isUsersLoading: false}) 
    }
  },
  
  getMessages: async (userId) => {
    set({isMessagesLoading: true})
    try {
        const res = await axiosInstance.get(`/messages/${userId}`)
        if(res.data.success){
            set({messages: res.data.data})
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }finally{
        set({isMessagesLoading: false}) 
    }
  },

  setSelectedUser: (selectedUser) => set({selectedUser}) ,

  sendMessage : async(messageData) => {
    const {selectedUser, messages} = get()
    try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData)
        if(res?.data?.success){
            set({messages: [...messages, res?.data?.data]})
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  },

  subscribeToMessages: () => {
    const {selectedUser} = get()
    if(!selectedUser) return

    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (newMessage) => {
        if(newMessage?.senderId !== selectedUser?._id) return
        set({
            messages: [...get().messages, newMessage]
        })
    })
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  }
}));
