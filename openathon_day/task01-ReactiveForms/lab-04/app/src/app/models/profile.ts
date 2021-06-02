export interface Profile {
  readonly name: string;
  password: string;
  passwordConfirm: string;
  readonly id: string;
}

export function initializeProfile(): Profile {
  let newProfile: Profile = {
    name: "",
    password: "",
    passwordConfirm: "",
    id: "",
  };
  return newProfile;
}
