'use server';

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth";

export async function getSetting(key: string): Promise<string | null> {
  const [rows]: any = await pool.execute('SELECT `value` FROM settings WHERE `key` = ?', [key]);
  if (rows.length === 0) return null;
  return rows[0].value;
}

export async function updateSetting(key: string, value: string) {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error("Unauthorized: Only admins can update settings");
  }

  await pool.execute(
    'INSERT INTO settings (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = ?',
    [key, value, value]
  );
  revalidatePath('/settings');
  revalidatePath('/api-docs');
}

export async function updateAdsSettings(settings: Record<string, string>) {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error("Unauthorized: Only admins can update settings");
  }

  for (const [key, value] of Object.entries(settings)) {
    await pool.execute(
      'INSERT INTO settings (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = ?',
      [key, value, value]
    );
  }
  revalidatePath('/settings');
  revalidatePath('/download/[id]', 'layout');
}

export async function getApiKey() {
  return getSetting('api_key');
}

export async function getProviders() {
  const [rows]: any = await pool.execute('SELECT * FROM api_providers ORDER BY created_at DESC');
  return rows;
}

export async function addProvider(name: string, apiKey: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const id = uuidv4();
  await pool.execute(
    'INSERT INTO api_providers (id, name, api_key, status) VALUES (?, ?, ?, ?)',
    [id, name, apiKey, 'active']
  );
  revalidatePath('/settings');
}

export async function deleteProvider(id: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  await pool.execute('DELETE FROM api_providers WHERE id = ?', [id]);
  revalidatePath('/settings');
}

export async function toggleProviderStatus(id: string, status: 'active' | 'inactive') {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  await pool.execute('UPDATE api_providers SET status = ? WHERE id = ?', [status, id]);
  revalidatePath('/settings');
}

import { v4 as uuidv4 } from 'uuid';
