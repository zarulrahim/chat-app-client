import { localStorage } from 'react';
import { types, flow, getSnapshot } from "mobx-state-tree";
import axios from 'axios';
import persist from 'mst-persist';

const BASE_URL = "http://localhost:5000"

const Auth = types.model({
  isLoggedIn: types.optional(types.boolean, false),
  bearerToken: types.optional(types.string, "")
})
.actions(self => {
  const adminLogin = flow (function * (params) {
    try {
      const url = BASE_URL + "/login";
      const response = yield axios.post(url, params);
      if (response.data.data) {
        console.log("Valid Response ======= login", response.data.data)
        self.bearerToken = response.data.data.token
        self.isLoggedIn = true
        return Promise.resolve(response.data.data)
      } else {
        console.log("Invalid Response ======= login", response.data.data)
        self.bearerToken = self.bearerToken
        self.isLoggedIn = false
        return Promise.reject(response.data.data)
      }
    } catch (err) {
      console.log("Err Response ======= login", err)
      self.bearerToken = self.bearerToken
      self.isLoggedIn = false
      return Promise.reject(err)
    }
  })

  const normalLogin = flow (function * (params, users) {
    try {
      const foundUser = users.find(user => user?.email === params.email) // if return true then verifiedUser
      const verifiedUser = foundUser && foundUser.password === params.password
      if (verifiedUser) {
        self.isLoggedIn = true
        return Promise.resolve(verifiedUser)
      } else {
        self.isLoggedIn = false
        return Promise.reject(verifiedUser)
      }
    } catch (err) {
      self.isLoggedIn = false
      return Promise.reject(err)
    }
  })

  const updateUser = flow (function * (params) {
    try {
      const url = BASE_URL + "/users/update/" + params.user_uuid
      const response = yield axios.get(url);
      if (response.data.data) {
        console.log("Valid Response ======= updateUser", response.data.data)
        return Promise.resolve(response.data.data);
      } else {
        console.log("Invalid Response ======= updateUser", response.data.data)
        return Promise.reject(response.data.data);
      }
    } catch (err) {
      console.log("Err Response ======= updateUser", err)
      return Promise.reject(err);
    }
  })

  const storeUser = flow (function * (params) {
    try {
      const url = BASE_URL + "/users/store"
      const config = {  
        headers: {
          Authorization: `Bearer ${self.bearerToken}`,
        },
      }
      const response = yield axios.post(url, params, config);
      if (response.data.data) {
        console.log("Valid Response ======= storeUser", response.data.data)
        mstUser.fetchUser();
        return Promise.resolve(response.data.data);
      } else {
        console.log("Invalid Response ======= storeUser", response.data.data)
        mstUser.fetchUser();
        return Promise.reject(response.data.data);
      }
    } catch (err) {
      console.log("Err Response ======= storeUser", err)
      mstUser.fetchUser();
      return Promise.reject(err);
    }
  })

  const deleteUser = flow (function * (params) {
    try {
      const url = BASE_URL + "/users/destroy/" + params.user_uuid
      const config = {  
        headers: {
          Authorization: `Bearer ${self.bearerToken}`,
        },
      }
      const response = yield axios.delete(url, config);
      if (response.data.data) {
        console.log("Valid Response ======= storeUser", response.data.data)
        mstUser.fetchUser();
        return Promise.resolve(response.data.data);
      } else {
        console.log("Invalid Response ======= storeUser", response.data.data)
        mstUser.fetchUser();
        return Promise.reject(response.data.data);
      }
    } catch (err) {
      console.log("Err Response ======= storeUser", err)
      mstUser.fetchUser();
      return Promise.reject(err);
    }
  })

  const adminLogout = flow (function * () {
    try {
      const url = BASE_URL + "/logout"
      const config = { 
        headers: {
          Authorization: `Bearer ${self.bearerToken}`,
        },
      }
      const response = yield axios.get(url, config);
      if (response.data.data) {
        console.log("Valid Response ======= adminLogout", response.data.data)
        self.isLoggedIn = false
        self.bearerToken = ""
        mstUser.clearOnLogout();
        return Promise.resolve(response.data.data);
      } else {
        console.log("Invalid Response ======= adminLogout", response.data.data)
        self.isLoggedIn = false
        self.bearerToken = ""
        mstUser.clearOnLogout();
        return Promise.reject(response.data.data);
      }
    } catch (err) {
      self.isLoggedIn = false
      self.bearerToken = ""
      mstUser.clearOnLogout();
      console.log("Err Response ======= adminLogout", err)
      return Promise.reject(err);
    }
  })

  const normalLogout = flow (function * () {
    self.isLoggedIn = false
    mstUser.clearOnLogout();
  })

  return { adminLogin, normalLogin, updateUser, storeUser, deleteUser, adminLogout, normalLogout }
})
export const mstAuth = Auth.create({})

const User = types.model({
  users: types.optional(types.array(types.frozen()), []),
  user: types.optional(types.map(types.frozen()), {}),
  chatUser: types.optional(types.map(types.frozen()), {}),
  chatTargetUser: types.optional(types.map(types.frozen()), {})
})
.actions(self => {
  const fetchUser = flow (function * () {
    try {
      const url = BASE_URL + "/users";
      const config = { 
        headers: {
          Authorization: `Bearer ${getSnapshot(mstAuth).bearerToken}`,
        },
      }
      const response = yield axios.get(url, config);
      if (response.data.data) {
        console.log("Valid Response ======= fetchUser", response.data.data)
        self.users = response.data.data;
        return Promise.resolve(response.data.data);
      } else {
        console.log("Invalid Response ======= fetchUser", response.data.data)
        self.users = self.users;
        return Promise.reject(response.data.data);
      }
    } catch (err) {
      console.log("Err Response ======= fetchUser", err)
      self.users = self.users;
      return Promise.reject(err);
    }
  })
  const fetchSingleUser = flow (function * (params) {
    try {
      const url = BASE_URL + "/users/show/" + params.user_uuid;
      const config = { 
        headers: {
          Authorization: `Bearer ${getSnapshot(mstAuth).bearerToken}`,
        },
      }
      const response = yield axios.get(url, config);
      if (response.data.data) {
        console.log("Valid Response ======= fetchSingleUser", response.data.data)
        return Promise.resolve(response.data.data);
      } else {
        console.log("Invalid Response ======= fetchSingleUser", response.data.data)
        return Promise.reject(response.data.data);
      }
    } catch (err) {
      console.log("Err Response ======= fetchSingleUser", err)
      return Promise.reject(err);
    }
  })

  const clearOnLogout = () => {
    self.user = {}
  }

  const updateCurrentUser = (user) => {
    self.user = user 
  }
  const updateChatUser = (user) => {
    self.chatUser = user
  }
  const updateChatTargetUser = (user) => {
    self.chatTargetUser = user
  }
  
  return { fetchUser, fetchSingleUser, clearOnLogout, updateCurrentUser, updateChatUser, updateChatTargetUser }
})
export const mstUser = User.create({})

persist('mstAuth', mstAuth, { storage: localStorage, jsonify: true, })
persist('mstUser', mstUser, { storage: localStorage, jsonify: true, })