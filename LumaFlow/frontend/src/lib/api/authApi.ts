import { FLASK_SERVER_URL } from '../../config';

export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${FLASK_SERVER_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

export async function login(username: string, password: string) {
  const response = await fetch(`${FLASK_SERVER_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return { success: true, ...data };
}

export async function logout() {
  const response = await fetch(`${FLASK_SERVER_URL}/api/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}

export async function getUserInfo() {
  const response = await fetch(`${FLASK_SERVER_URL}/api/user`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
}

export async function isAuthenticated() {
  try {
    await getUserInfo();
    return true;
  } catch (error) {
    return false;
  }
}