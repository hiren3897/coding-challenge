import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../components/EventBus';

describe('EventBus', () => {
  it('registers and posts to listener', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.register('test', handler);
    bus.post({ type: 'test', timestamp: Date.now(), data: {} });
    expect(handler).toHaveBeenCalled();
  });

  it('does not register duplicate listener', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.register('test', handler);
    bus.register('test', handler);
    bus.post({ type: 'test', timestamp: Date.now(), data: {} });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('unregisters listener', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.register('test', handler);
    bus.unregister('test', handler);
    bus.post({ type: 'test', timestamp: Date.now(), data: {} });
    expect(handler).not.toHaveBeenCalled();
  });

  it('prioritizes listeners', () => {
    const bus = new EventBus();
    const calls: number[] = [];
    bus.register('test', () => calls.push(1), 1);
    bus.register('test', () => calls.push(2), 2);
    bus.post({ type: 'test', timestamp: Date.now(), data: {} });
    expect(calls).toEqual([2, 1]);
  });
});
