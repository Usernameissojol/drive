'use server';

import pool from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import { DriveFile, ErrorLog } from "@/types";
import { revalidatePath } from "next/cache";
import { getSetting } from "./settings";
import { getSession } from "./auth";
import { createNotification } from "./notifications";

const DRIVECLOUD_TOKEN = process.env.DRIVECLOUD_TOKEN;

function extractDriveId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const fileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})/);
  if (fileD) return fileD[1];
  const openId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (openId) return openId[1];
  const folders = trimmed.match(/\/folders\/([a-zA-Z0-9_-]{10,})/);
  if (folders) return folders[1];
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) return trimmed;
  return null;
}

export async function generateLinks(links: string[]): Promise<Array<{
  input: string;
  drive_id: string | null;
  success: boolean;
  record?: DriveFile;
  error?: string;
}>> {
  const session = await getSession();
  const userId = session?.id || null;
  
  // Get all active providers
  const [providers]: any = await pool.execute('SELECT * FROM api_providers WHERE status = "active"');
  
  if (providers.length === 0) {
    return links.map(link => ({
      input: link,
      drive_id: extractDriveId(link),
      success: false,
      error: "No active API providers configured. Please add one in Settings."
    }));
  }

  const results: Array<{
    input: string;
    drive_id: string | null;
    success: boolean;
    record?: DriveFile;
    error?: string;
  }> = [];

  for (const link of links) {
    const drive_id = extractDriveId(link);
    const file_id = uuidv4();

    if (!drive_id) {
      const message = "Invalid Drive URL or ID";
      await pool.execute(
        'INSERT INTO error_logs (id, drive_id, message, details, user_id) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), null, message, JSON.stringify({ input: link }), userId]
      );
      results.push({ input: link, drive_id: null, success: false, error: message });
      continue;
    }

    let fileCreated = false;
    let successfulProviders = 0;

    for (const provider of providers) {
      try {
        const apiUrl = `http://new.drivecloud.cc/api/v1/${provider.api_key}/${drive_id}`;
        const resp = await fetch(apiUrl);
        const text = await resp.text();
        let json: any = null;
        try { json = JSON.parse(text); } catch { /* non-json */ }

        if (!resp.ok || !json?.success || !json?.data) {
          const message = json?.message || `API error (${resp.status}) from ${provider.name}`;
          await pool.execute(
            'INSERT INTO error_logs (id, drive_id, message, details, user_id) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), drive_id, message, JSON.stringify({ provider: provider.name, status: resp.status, body: text.slice(0, 500) }), userId]
          );
          continue;
        }

        const d = json.data;

        // Create the main file record if it doesn't exist (using the first successful provider's metadata)
        if (!fileCreated) {
          await pool.execute(
            'INSERT INTO drive_files (id, drive_id, token, download_url, filename, filesize, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              file_id,
              drive_id,
              d.token ?? null, // Primary token
              `/download/${file_id}`, // Custom landing page
              d.filename ?? null,
              d.filesize ?? null,
              "ready",
              userId
            ]
          );
          fileCreated = true;
        }

        // Store the specific link for this provider
        await pool.execute(
          'INSERT INTO file_links (id, file_id, provider_id, token, download_url) VALUES (?, ?, ?, ?, ?)',
          [
            uuidv4(),
            file_id,
            provider.id,
            d.token ?? '',
            d.download_url ?? ''
          ]
        );
        successfulProviders++;

      } catch (err: any) {
        console.error(`Error processing provider ${provider.name}:`, err);
      }
    }

    if (fileCreated) {
      const [rows]: any = await pool.execute('SELECT * FROM drive_files WHERE id = ?', [file_id]);
      results.push({ input: link, drive_id, success: true, record: rows[0] });
    } else {
      // If all providers failed
      const message = "Failed to process with any provider";
      await pool.execute(
        'INSERT INTO drive_files (id, drive_id, status, error_message, user_id) VALUES (?, ?, ?, ?, ?)',
        [file_id, drive_id, 'error', message, userId]
      );
      const [rows]: any = await pool.execute('SELECT * FROM drive_files WHERE id = ?', [file_id]);
      results.push({ input: link, drive_id, success: false, error: message, record: rows[0] });
    }
  }

  const total = links.length;
  const successCount = results.filter(r => r.success).length;
  const failCount = total - successCount;

  if (successCount > 0) {
    await createNotification({
      title: "Links Generated",
      message: `Successfully processed ${successCount} file(s).`,
      type: "success"
    });
  }

  if (failCount > 0) {
    await createNotification({
      title: "Generation Failed",
      message: `Failed to process ${failCount} file(s). Check error logs for details.`,
      type: "error"
    });
  }

  return results;
}

export async function getFiles(limit = 1000) {
  const session = await getSession();
  if (!session) return [];
  const [rows] = await pool.execute(
    'SELECT * FROM drive_files WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [session.id, limit]
  );
  return rows as DriveFile[];
}

export async function getErrorLogs(limit = 100) {
  const session = await getSession();
  if (!session) return [];
  const [rows] = await pool.execute(
    'SELECT * FROM error_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [session.id, limit]
  );
  return rows as ErrorLog[];
}

export async function clearAllFiles() {
  const session = await getSession();
  if (!session) return;
  await pool.execute('DELETE FROM drive_files WHERE user_id = ?', [session.id]);
  revalidatePath('/files');
}

export async function deleteFile(id: string) {
  const session = await getSession();
  if (!session) return;
  await pool.execute('DELETE FROM drive_files WHERE id = ? AND user_id = ?', [id, session.id]);
  revalidatePath('/files');
}

export async function getFileWithLinks(fileId: string) {
  const [fileRows]: any = await pool.execute('SELECT * FROM drive_files WHERE id = ?', [fileId]);
  if (fileRows.length === 0) return null;

  const [linkRows]: any = await pool.execute(`
    SELECT fl.*, ap.name as provider_name, ap.api_key 
    FROM file_links fl
    JOIN api_providers ap ON fl.provider_id = ap.id
    WHERE fl.file_id = ?
  `, [fileId]);

  return {
    ...fileRows[0],
    links: linkRows
  };
}

export async function getDirectLink(linkId: string) {
  const [linkRows]: any = await pool.execute(`
    SELECT fl.*, ap.api_key, df.drive_id
    FROM file_links fl
    JOIN api_providers ap ON fl.provider_id = ap.id
    JOIN drive_files df ON fl.file_id = df.id
    WHERE fl.id = ?
  `, [linkId]);

  if (linkRows.length === 0) throw new Error("Link not found");
  const { api_key, drive_id } = linkRows[0];

  try {
    const apiUrl = `http://new.drivecloud.cc/api/v1/${api_key}/${drive_id}`;
    const resp = await fetch(apiUrl);
    const json = await resp.json();

    if (json.success && json.data) {
      const d = json.data;
      console.log("DriveCloud API Response Data:", d);
      
      let domain = "new.drivecloud.cc";
      try {
        const url = new URL(d.download_url);
        domain = url.host;
      } catch (e) {}

      // Try to follow redirects server-side to find the real file
      try {
        const headResp = await fetch(d.download_url, { method: 'HEAD', redirect: 'manual' });
        const location = headResp.headers.get('location');
        if (location) {
          console.log("Followed Redirect to:", location);
          return location;
        }
      } catch (e) {}

      // Common pattern for forcing direct downloads on these systems
      const forcedDirectUrl = d.download_url.includes('?') 
        ? `${d.download_url}&dl=1` 
        : `${d.download_url}?dl=1`;
        
      console.log("Final Generated Direct URL:", forcedDirectUrl);
      return forcedDirectUrl;
    }
    throw new Error(json.message || "Failed to fetch direct link");
  } catch (error) {
    console.error("Error in getDirectLink:", error);
    throw error;
  }
}
