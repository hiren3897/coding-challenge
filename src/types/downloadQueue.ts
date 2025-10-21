export interface DownloadProgressEventData {
  url: string;
  bytesDownloaded: number;
}

export interface DownloadCompleteEventData {
  url: string;
  content: string;
}

export type DownloadQueueMode = 'Async' | 'Sync';
