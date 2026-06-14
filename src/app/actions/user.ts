'use server';

import pool from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function getUsers() {
  const [rows] = await pool.execute(`
    SELECT u.id, u.name, u.email, u.role, u.created_at, COUNT(df.id) as file_count
    FROM users u
    LEFT JOIN drive_files df ON u.id = df.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);
  return rows as any[];
}

export async function getUserProfile() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  if (!sessionCookie || !sessionCookie.value) return null;
  
  try {
    const session = JSON.parse(sessionCookie.value);
    if (!session || !session.id) return null;
    const [rows]: any = await pool.execute('SELECT name, avatar_url FROM users WHERE id = ?', [session.id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Session parse error in getUserProfile:", error);
    return null;
  }
}

export async function addUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  await pool.execute(
    'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), name, email, password, role]
  );
  revalidatePath('/users');
}

export async function deleteUser(id: string) {
  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  revalidatePath('/users');
}

export async function changePassword(newPassword: string) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  if (!sessionCookie || !sessionCookie.value) throw new Error("Not authenticated");
  
  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    throw new Error("Invalid session");
  }
  
  if (!session || !session.id) throw new Error("Invalid session data");
  
  await pool.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [newPassword, session.id]
  );
  
  revalidatePath('/settings');
  
  await createNotification({
    title: "Password Changed",
    message: "Your account password has been updated successfully.",
    type: "success"
  });
  
  return { success: true };
}

export async function updateProfile(data: { name?: string; avatar_url?: string }) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  if (!sessionCookie || !sessionCookie.value) throw new Error("Not authenticated");
  
  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    throw new Error("Invalid session");
  }

  if (!session || !session.id) throw new Error("Invalid session data");
  
  if (data.name) {
    await pool.execute('UPDATE users SET name = ? WHERE id = ?', [data.name, session.id]);
    // Update session cookie
    session.name = data.name;
    cookieStore.set('auth_session', JSON.stringify(session), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }
  
  if (data.avatar_url) {
    await pool.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [data.avatar_url, session.id]);
  }
  
  revalidatePath('/settings');
  revalidatePath('/');
  
  await createNotification({
    title: "Profile Updated",
    message: "Your profile information has been saved.",
    type: "success"
  });
  
  return { success: true };
}
