export function saveAuth(data) {
  localStorage.setItem("auth", JSON.stringify(data));
}

export function getToken() {
  const storedAuth = localStorage.getItem("auth");
  return storedAuth ? JSON.parse(storedAuth).token : null;
}

export function getUser() {
  const storedAuth = localStorage.getItem("auth");
  return storedAuth ? JSON.parse(storedAuth).user : null;
}

export function logout() {
  localStorage.removeItem("auth");
  window.location = "/login";
}
