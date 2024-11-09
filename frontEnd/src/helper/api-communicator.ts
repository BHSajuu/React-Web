import axios, { type AxiosError } from "axios";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("http://localhost:5000/api/v1/login", {
    email,
    password,
  });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post("http://localhost:5000/api/v1/signup", {
    name,
    email,
    password,
  });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

// export const checkAuthStatus = async () => {
//   const res = await axios.get("/auth-status");
//   if (res.status !== 200) {
//     throw new Error("Unable to authenticate");
//   }
//   const data = await res.data;
//   return data;
// };

async function logoutUser(): Promise<void> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return; // Early return if no token is found
    }

    await axios.get("http://localhost:5000/api/v1/logout", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("User logged out successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        console.error("Unauthorized access - please log in again.");
        // Handle unauthorized access, e.g., clear local storage, redirect to login
      } else {
        console.error("Logout failed:", axiosError.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

export default logoutUser;
