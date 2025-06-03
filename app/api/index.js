import axios from "axios";
// http://10.0.2.2:3000
const api = axios.create({
  baseURL: "http://192.168.4.23:3000", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchData = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const postData = async data => {
  try {
    const response = await api.post("/api/data", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export { api };
