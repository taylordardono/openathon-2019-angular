export interface User {
  readonly name: string;
  readonly password: string;
  readonly id: string;
}

export function initializeUser(user?): User {
  let newUser: User = {
    name: user ? user.get("name").value : "",
    password: user ? user.get("password").value : "",
    id: "",
  };
  return newUser;
}
