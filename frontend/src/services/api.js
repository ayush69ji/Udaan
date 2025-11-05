export const loginUser = async (role, data) => {
  console.log(`Logging in as ${role}`, data);
  return Promise.resolve({ success: true });
};

export const registerUser = async (role, data) => {
  console.log(`Registering ${role}`, data);
  return Promise.resolve({ success: true });
};
