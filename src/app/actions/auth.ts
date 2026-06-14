'use server';

import { cookies } from 'next/headers';
import pool from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

export async function login(formData: FormData, requireAdmin: boolean = false) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const [rows]: any = await pool.execute(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );

  if (rows.length > 0) {
    const user = rows[0];

    if (requireAdmin && user.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Admin credentials required.' };
    }
    if (!requireAdmin && user.role === 'admin') {
      return { success: false, message: 'Admins must sign in via the Admin Console.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_session', JSON.stringify({ id: user.id, name: user.name, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { success: false, message: 'Invalid email or password' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_session');
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Check if user exists
  const [existing]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return { success: false, message: 'User already exists' };
  }

  const id = uuidv4();
  await pool.execute(
    'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, password, 'user']
  );

  // Set session
  const cookieStore = await cookies();
  cookieStore.set('auth_session', JSON.stringify({ id, name, role: 'user' }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}
