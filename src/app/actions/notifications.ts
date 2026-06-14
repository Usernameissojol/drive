'use server';

import pool from "@/lib/db";
import { getSession } from "./auth";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await getSession();
  if (!session) return [];

  const [rows]: any = await pool.execute(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [session.id]
  );
  return rows;
}

export async function createNotification(data: { title: string; message?: string; type?: 'success' | 'error' | 'info' | 'warning' }) {
  const session = await getSession();
  if (!session) return;

  const id = uuidv4();
  await pool.execute(
    'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [id, session.id, data.title, data.message || null, data.type || 'info']
  );
  
  revalidatePath('/', 'layout');
}

export async function markAsRead(id: string) {
  const session = await getSession();
  if (!session) return;

  await pool.execute(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
    [id, session.id]
  );
  revalidatePath('/', 'layout');
}

export async function markAllAsRead() {
  const session = await getSession();
  if (!session) return;

  await pool.execute(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
    [session.id]
  );
  revalidatePath('/', 'layout');
}
