export interface Profile {
  readonly name: string;
  password: string;
  passwordNotMatch: string;
  readonly id: string;
}

export function initializeProfile(): Profile {
  let newProfile: Profile = {
    name: "",
    password: "",
    passwordNotMatch: "",
    id: "",
  };
  return newProfile;
}
