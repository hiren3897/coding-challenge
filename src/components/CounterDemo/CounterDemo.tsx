import { useEffect, useState } from 'react'
import type { EventBus } from '../EventBus'
import type { BaseEvent } from '../../types/EventBus';

interface CounterDemoProps {
    bus: EventBus
}

// Plan:
// Increment counter
// Decrement counter
// TODO: we can add reset button 

export const CounterDemo = ({ bus }: CounterDemoProps) => {
    const [count, setCount] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);


    const sendEvent = (type: string, amount: number) => {
        bus.post<{ amount: number }>({
            type,
            timestamp: Date.now(),
            data: { amount },
        });
    };

    useEffect(() => {
        const onIncrement = (event: BaseEvent<{ amount: number }>) =>
            setCount(c => c + event.data.amount);
        const onDecrement = (event: BaseEvent<{ amount: number }>) =>
            setCount(c => c - event.data.amount);

        bus.register('increment', onIncrement);
        bus.register('decrement', onDecrement);

        return () => {
            bus.unregister('increment', onIncrement);
            bus.unregister('decrement', onDecrement);
        };
    }, [bus]);

    useEffect(() => {
        const onAnyCounter = (event: BaseEvent<{ amount: number }>) => {
            setLogs(logs => [
                ...logs,
                `${event.type}: ${event.data.amount} at ${new Date(event.timestamp).toLocaleTimeString()}`
            ]);
        };

        bus.register('increment', onAnyCounter, 2); // Demo priority
        bus.register('decrement', onAnyCounter, 1);

        return () => {
            bus.unregister('increment', onAnyCounter);
            bus.unregister('decrement', onAnyCounter);
        };
    }, [bus]);

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "2em", alignItems: "center" }}>
            <div>Count: {count}</div>
            <div style={{ display: 'flex', flexDirection: "row", gap: 4 }}>
                <button onClick={() => sendEvent('increment', 1)}>Increment</button>
                <button onClick={() => sendEvent('decrement', 1)}>Decrement</button>
            </div>
            <div style={{ marginTop: '1em' }}>
                <h4>Counter Event Logs</h4>
                <ul>
                    {logs.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
            </div>
        </div>
    )
}
