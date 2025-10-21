import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../components/EventBus';
import type { BaseEvent } from '../types/EventBus';

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

describe('EventBus edge cases', () => {
  it('posting event with no listeners should not throw', () => {
    const bus = new EventBus();
    expect(() => bus.post({ type: 'noListener', timestamp: Date.now(), data: {} })).not.toThrow();
  });

  it('listener throwing error does not break others', () => {
    const bus = new EventBus();
    const errorListener = () => { throw new Error('Listener error'); };
    const normalListener = vi.fn();
    bus.register('test', errorListener);
    bus.register('test', normalListener);
    expect(() => bus.post({ type: 'test', timestamp: Date.now(), data: {} })).not.toThrow();
    expect(normalListener).toHaveBeenCalled();
  });

  it('registering/unregistering with empty or undefined type is ignored', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.register('', handler);
    bus.register(undefined as any, handler);
    expect(() => bus.post({ type: '', timestamp: Date.now(), data: {} })).not.toThrow();
    expect(() => bus.post({ type: undefined as any, timestamp: Date.now(), data: {} })).not.toThrow();
  });

  it('unregistering non-existent listener does nothing', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.unregister('someEvent', handler);
    // Should not throw/error
  });

  it('listener array may change during dispatch (not supported)', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const remover = (event: BaseEvent<any>) => {
      bus.unregister('event', handler); // Shouldn’t affect current dispatch
    };
    bus.register('event', remover);
    bus.register('event', handler);
    bus.post({ type: 'event', timestamp: Date.now(), data: {} });
    expect(handler).toHaveBeenCalled();
  });
});