export interface DownloadProgressEventData {
  url: string;
  bytesDownloaded: number;
}

export interface DownloadCompleteEventData {
  url: string;
  content: string;
}

export interface DownloadErrorEventData {
  url: string;
  error: string;
}

export type DownloadQueueMode = 'Async' | 'Sync';
