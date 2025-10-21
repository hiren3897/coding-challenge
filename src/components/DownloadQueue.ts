import type { DownloadCompleteEventData, DownloadProgressEventData, DownloadQueueMode } from '../types/downloadQueue';
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
    while (bytes < totalBytes) {
      await new Promise(res => setTimeout(res, 15));
      bytes += 25;
      this.bus.post<DownloadProgressEventData>({
        type: 'download_progress',
        timestamp: Date.now(),
        data: { url, bytesDownloaded: Math.min(bytes, totalBytes) },
      });
    }

    // download is complete
    this.bus.post<DownloadCompleteEventData>({
      type: 'download_complete',
      timestamp: Date.now(),
      data: { url, content: 'Dummy content for ' + url },
    });
  }
}
