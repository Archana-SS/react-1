import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    return token ? { token, username, role } : null;
  });

  const login = (data) => {
    // Save JWT and user info
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);

    setUser({
      token: data.access_token,
      username: data.username,
      role: data.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// import { createContext, useState } from "react";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     const username = localStorage.getItem("username");

//     return token && role && username
//       ? { token, role, username }
//       : null;
//   });

//   const login = (token, role, username) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);
//     localStorage.setItem("username", username);

//     setUser({ token, role, username });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("username");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// import { createContext, useState } from "react";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     return token && role ? { token, role } : null;
//   });

//   const login = (token, role) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);
//     setUser({ token, role });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
