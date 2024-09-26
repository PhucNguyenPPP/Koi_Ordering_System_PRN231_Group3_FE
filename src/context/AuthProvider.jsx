import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { isValidToken, setSession } from "../utils/jwt";
import { toast } from "react-toastify";
import { GetUserByToken, RegisterCustomer, SignIn } from "../api/AuthenApi";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state) => {
    return {
      ...state,
      isAuthenticated: false,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: "jwt",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register_customer: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        const refreshToken = window.localStorage.getItem("refreshToken");

        if (accessToken && refreshToken && isValidToken(accessToken)) {
          setSession(accessToken, refreshToken);

          const response = await GetUserByToken(accessToken);

          const user  = response.result;
          console.log(user)

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          setSession(null, refreshToken);
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username, password) => {
    const response = await SignIn({
      userName: username,
      password: password,
    });

    if (response.ok) {
      const responseData = await response.json()
      const { accessToken } = responseData.result;
      const { refreshToken } = responseData.result;
      const { user } = responseData.result;

      setSession(accessToken, refreshToken);
      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });
      toast.success(responseData.message);
      window.location.href = "/";
      return () => clearTimeout(timeout);
    } else {
      toast.error("Username or password is incorrect");
    }
  };

  const register_customer = async (customer) => {
    try {
      const response = await RegisterCustomer(customer);

      if (response.ok) {
        dispatch({
          type: "REGISTER",
        });
        toast.success(response.message);
        const timeout = setTimeout(() => {
          window.location.href = "/login";
        }, 4000);
        return () => clearTimeout(timeout);
      } else {
        // Handle error
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    setSession(null, null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        register_customer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
