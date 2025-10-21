import { describe, it, expect, beforeEach } from 'vitest';
import { EventBus } from '../components/EventBus';
import { DownloadQueue } from '../components/DownloadQueue';
import type { DownloadCompleteEventData } from '../types/downloadQueue';


describe('DownloadQueue', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('downloads urls in async mode and fires events', async () => {
    const completed: string[] = [];
    bus.register<DownloadCompleteEventData>('download_complete', e => completed.push(e.data.url));
    const queue = new DownloadQueue(bus, "Async");
    queue.addUrls(['fileA', 'fileB']);
    await queue.start();
    expect(completed).toEqual(expect.arrayContaining(['fileA', 'fileB']));
  });

  it('downloads urls in sync mode and fires events in order', async () => {
    const completed: string[] = [];
    bus.register<DownloadCompleteEventData>('download_complete', e => completed.push(e.data.url));
    const queue = new DownloadQueue(bus, "Sync");
    queue.addUrls(['file1', 'file2']);
    await queue.start();
    expect(completed).toEqual(['file1', 'file2']); // Order should be preserved in sync mode
  });
});
