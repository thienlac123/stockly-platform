import { useEffect, useState } from 'react';

type Status = 'loading' | 'ok' | 'error';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export default function App() {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/health`, { signal: controller.signal })
      .then((res) => setStatus(res.ok ? 'ok' : 'error'))
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          setStatus('error');
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32 }}>
      <h1>Stockly</h1>
      <p>
        API status: <strong>{status}</strong>
      </p>
    </main>
  );
}