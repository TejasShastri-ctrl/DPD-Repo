// import axios from "axios";

// export const AUTH_REQUEST = "AUTH_REQUEST";
// export const AUTH_SUCCESS = "AUTH_SUCCESS";
// export const AUTH_FAILURE = "AUTH_FAILURE";
// export const LOGOUT = "LOGOUT";

// // Login Action
// export const loginUser = (credentials) => async (dispatch) => {
//   dispatch({ type: AUTH_REQUEST });

//   try {
//     const res = await axios.post("/api/auth/login", credentials);

//     const user = res.data;

//     localStorage.setItem("user", JSON.stringify(user));
//     dispatch({ type: AUTH_SUCCESS, payload: user });

//     return { success: true };
//   } catch (err) {
//     dispatch({
//       type: AUTH_FAILURE,
//       payload: err.response?.data || "Login failed",
//     });
//     return { success: false, error: err.response?.data };
//   }
// };

// // Signup Action
// export const signupUser = (signupData) => async (dispatch) => {
//   dispatch({ type: "AUTH_REQUEST" });

//   try {
//     const response = await axios.post("/api/auth/signup", signupData);

//     // Assuming signup returns the user info in response.data:
//     const user = {
//       username: response.data.username,
//       email: response.data.email,
//       role: response.data.role,
//     };

//     // Dispatch success and set user data in Redux state
//     dispatch({ type: "AUTH_SUCCESS", payload: user });

//     // Persist in localStorage
//     localStorage.setItem("user", JSON.stringify(user));

//     return { success: true, user };
//   } catch (err) {
//     dispatch({
//       type: "AUTH_FAILURE",
//       payload: err.response?.data || "Signup failed",
//     });
//     return { success: false, error: err.response?.data };
//   }
// };




// export const logoutUser = () => (dispatch) => {
//   localStorage.removeItem("user");
//   dispatch({ type: "AUTH_LOGOUT" });
// };

