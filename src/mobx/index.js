import { localStorage } from 'react';
import { types, flow, getSnapshot } from "mobx-state-tree";
import axios from 'axios';
import Cookies from 'js-cookie';
import persist from 'mst-persist';

const BASE_URL = "http://localhost:5000"
const BEARER_TOKEN = "2|mAGtnsr4fevOUdQZTdG9uHceUu3kGLs0V7hRtgGl"

const Auth = types.model({
  isLoggedIn: types.optional(types.boolean, false),
  // csrftoken: types.optional(types.string, "")
})
.actions(self => {
  // const fetchCsrfToken = flow (function * () {
  //   try {
  //     const url = "http://localhost:5000/getCSRFToken"
  //     const response = yield axios.get(url);
  //     if (response.data) {
  //       self.csrftoken = response.data.csrfToken
  //       axios.defaults.headers.post['X-CSRF-Token'] = response.data.csrfToken;
  //       console.log("CSRF Token Fetched", response.data.csrfToken)
  //       return Promise.resolve(response.data.csrfToken);
  //     } else {
  //       self.csrftoken = ""
  //       return Promise.reject(response.data);
  //     }
  //   } catch (err) {
  //     self.csrftoken = ""
  //     return Promise.resolve(err);
  //   }
  // })
  const adminLogin = flow (function * (params) {
    try {
      const url = BASE_URL + "/login";
      const response = yield axios.post(url, params);
      if (response.data.data) {
        console.log("Valid Response ======= login", response.data.data)
        self.isLoggedIn = true
        return Promise.resolve(response.data.data)
      } else {
        console.log("Invalid Response ======= login", response.data.data)
        self.isLoggedIn = false
        return Promise.reject(response.data.data)
      }
    } catch (err) {
      console.log("Err Response ======= login", err)
      self.isLoggedIn = false
      return Promise.reject(err)
    }
  })

  const normalLogin = flow (function * (params, users) {
    try {
      const verifiedUser = users.find(user => user?.email === params.email) // if return true then verifiedUser
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

  const logOut = flow (function * () {
    self.isLoggedIn = false
    mstUser.clearOnLogout();
  })

  return { adminLogin, normalLogin, updateUser, logOut }
})
export const mstAuth = Auth.create({})

const User = types.model({
  users: types.optional(types.array(types.frozen()), []),
  user: types.optional(types.map(types.frozen()), {})
})
.actions(self => {
  const fetchUser = flow (function * () {
    try {
      const url = BASE_URL + "/users";
      const response = yield axios.get(url);
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
      const response = yield axios.get(url);
      if (response.data.data) {
        console.log("Valid Response ======= fetchUser", response.data.data)
        self.user = response.data.data;
        return Promise.resolve(response.data.data);
      } else {
        console.log("Invalid Response ======= fetchUser", response.data.data)
        self.user = self.user;
        return Promise.reject(response.data.data);
      }
    } catch (err) {
      console.log("Err Response ======= fetchUser", err)
      self.user = self.user;
      return Promise.reject(err);
    }
  })

  const clearOnLogout = () => {
    self.user = {}
  }
  return { fetchUser, fetchSingleUser, clearOnLogout }
})
export const mstUser = User.create({})

persist('mstAuth', mstAuth, { storage: localStorage, jsonify: true, }).then(() => console.log('mstAuth has been persisted'))
persist('mstUser', mstUser, { storage: localStorage, jsonify: true, }).then(() => console.log('mstUser has been persisted'))