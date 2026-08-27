import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;