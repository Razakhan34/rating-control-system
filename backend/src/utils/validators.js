const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

// Checking various input validations

function validateName(name) {
  if (!name) return "Name is required";
  if (typeof name !== "string") return "Name must be text";
  if (name.length < 20) return "Name must be at least 20 characters";
  if (name.length > 60) return "Name must be at most 60 characters";
  return null;
}
function validateAddress(address) {
  if (address && address.length > 400)
    return "Address must be at most 400 characters";
  return null;
}
function validateEmail(email) {
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email address";
  return null;
}
function validatePassword(password) {
  if (!password) return "Password is required";
  if (typeof password !== "string") return "Password must be text";
  if (password.length < 8 || password.length > 16)
    return "Password must be 8-16 characters";
  if (!passwordRegex.test(password))
    return "Password must include at least one uppercase letter and one special character";
  return null;
}

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
};
