import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from '../components/EventBus';
import { DownloadQueue } from '../components/DownloadQueue';
import type { DownloadCompleteEventData, DownloadErrorEventData, DownloadProgressEventData } from '../types/downloadQueue';

vi.spyOn(global.Math, 'random').mockReturnValue(1); // need to mock this for ramdom failed

describe('DownloadQueue', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('handles empty url list gracefully', async () => {
    const queue = new DownloadQueue(bus, "Sync");
    await expect(queue.start()).resolves.not.toThrow();
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
    expect(completed).toEqual(['file1', 'file2']); 
  });

  it('fires progress events at each step', async () => {
    const progresses: {url: string; bytes: number}[] = [];
    bus.register<DownloadProgressEventData>('download_progress', e => {
      progresses.push({ url: e.data.url, bytes: e.data.bytesDownloaded });
    });
    const queue = new DownloadQueue(bus, 'Sync');
    queue.addUrls(['file1']);
    await queue.start();
    expect(progresses.length).toBeGreaterThan(0);
    expect(progresses.some(p => p.bytes === 100)).toBe(true);
  });

  it('fires progress events up to 100 bytes when download succeeds', async () => {
    const progresses: {url: string; bytes: number}[] = [];
    vi.spyOn(global.Math, 'random').mockReturnValue(1); // Success only
    bus.register<DownloadProgressEventData>('download_progress', e => {
        progresses.push({ url: e.data.url, bytes: e.data.bytesDownloaded });
    });
    const queue = new DownloadQueue(bus, 'Sync');
    queue.addUrls(['file1']);
    await queue.start();
    expect(progresses.length).toBeGreaterThan(0);
    expect(progresses.some(p => p.bytes === 100)).toBe(true);
    vi.spyOn(global.Math, 'random').mockRestore();
  });

  it('does not post progress >= 100 after failure', async () => {
    const progresses: number[] = [];
    const errors: string[] = [];
    vi.spyOn(global.Math, 'random').mockReturnValue(0.1); // force failure
    bus.register<DownloadProgressEventData>('download_progress', e => progresses.push(e.data.bytesDownloaded));
    bus.register<DownloadErrorEventData>('download_error', e => errors.push(e.data.url));
    const queue = new DownloadQueue(bus, "Sync");
    queue.addUrls(['failUrl']);
    await queue.start();
    expect(errors.length).toBe(1);
    expect(progresses.every(b => b < 100)).toBe(true); // No progress at 100 due to failure
    vi.spyOn(global.Math, 'random').mockRestore();
  });
});
