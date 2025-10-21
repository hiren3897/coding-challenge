import type { DownloadQueueMode } from '../types/downloadQueue';
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
    } else {
      // Downloads in sequence
    }
  }

  async download(url: string) {
    // logic to download and showcase EventBus progress
  }
}
