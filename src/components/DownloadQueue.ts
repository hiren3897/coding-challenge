import type { DownloadCompleteEventData, DownloadErrorEventData, DownloadProgressEventData, DownloadQueueMode } from '../types/downloadQueue';
import { EventBus } from './EventBus';

export class DownloadQueue {
  private bus: EventBus;
  private urls: string[] = [];
  private mode: DownloadQueueMode;

  constructor(bus: EventBus, mode: DownloadQueueMode) {
    this.bus = bus;
    this.mode = mode;
  }

  addUrls(urls: string[]) {
    this.urls.push(...urls);
  }

  async start() {
    if (this.mode === "Async") {
      // All downloads in parallel
      await Promise.all(this.urls.map(url => this.download(url)));
    } else {
      // Downloads in sequence
      for (const url of this.urls) {
        await this.download(url);
      }
    }
  }

  async download(url: string) {
    // logic to download and showcase EventBus progress
    this.bus.post<DownloadProgressEventData>({
      type: 'download_start',
      timestamp: Date.now(),
      data: { url, bytesDownloaded: 0 },
    });

    // fake progress using timeout
    const totalBytes = 100;
    let bytes = 0;
    const failed = Math.random() < 0.3; // simulate a fake 30% failure rate

    while (bytes < totalBytes) {
      await new Promise(res => setTimeout(res, 15));
      bytes += 25;
      this.bus.post<DownloadProgressEventData>({
        type: 'download_progress',
        timestamp: Date.now(),
        data: { url, bytesDownloaded: Math.min(bytes, totalBytes) },
      });

      if (failed && bytes >= 50) {
        this.bus.post<DownloadErrorEventData>({
          type: 'download_error',
          timestamp: Date.now(),
          data: { url, error: 'Download failed due to network error' },
        });
        return;
      }
    }

    if (!failed) {
      this.bus.post<DownloadCompleteEventData>({
        type: 'download_complete',
        timestamp: Date.now(),
        data: { url, content: 'Dummy content for ' + url },
      });
    }
  }
}
