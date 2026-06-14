export interface DriveFile {
  id: string;
  drive_id: string;
  token: string | null;
  download_url: string | null;
  filename: string | null;
  filesize: string | null;
  status: 'processing' | 'ready' | 'error';
  error_message: string | null;
  created_at: Date;
}

export interface ErrorLog {
  id: string;
  drive_id: string | null;
  message: string;
  details: any;
  created_at: Date;
}
