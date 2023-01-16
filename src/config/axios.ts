import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY)}`
  }
});

export default API;
