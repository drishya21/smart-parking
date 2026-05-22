export const login = (email, password) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};