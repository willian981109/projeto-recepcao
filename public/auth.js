/* ===============================
   AUTH
================================ */

export function saveToken(token) {
  sessionStorage.setItem("token", token);
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function saveUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/* ===============================
   PROTEÇÃO DE ROTAS
================================ */

export function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  return token;
}

/* ===============================
   LOGOUT
================================ */

export function logout() {
  // limpa apenas a sessão da aba
  sessionStorage.clear();

  // redireciona para login
  window.location.href = "/login";
}
