//! Redundant code. Migrated to Slice

// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// export const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "AUTH_REQUEST":
//       return { ...state, loading: true, error: null };
//     case "AUTH_SUCCESS":
//       return { ...state, loading: false, user: action.payload };
//     case "AUTH_FAILURE":
//       return { ...state, loading: false, error: action.payload };
//     case "AUTH_LOGOUT":
//       return { ...state, user: null };
//     default:
//       return state;
//   }
// };
