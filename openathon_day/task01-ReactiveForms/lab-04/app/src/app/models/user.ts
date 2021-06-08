export interface User {
  name: string;
  password: string;
  id: string;
}

export function initializeUser(user?): User {
  let newUser: User = {
    name: user ? user.get("name").value : "",
    password: user ? user.get("password").value : "",
    id: "",
  };
  return newUser;
}

export function initializeUserNotForm({ name }, { id, password }): User {
  let newUser: User = {
    name: name ? name : "",
    password: password ? password : "",
    id: id ? id : "",
  };
  return newUser;
}
