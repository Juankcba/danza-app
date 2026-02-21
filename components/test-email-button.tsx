'use client';

import { useState } from 'react';

export function TestEmailButton() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSendTest = async () => {
        setStatus('sending');
        setMessage('');
        try {
            const res = await fetch('/api/test-email', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage('✅ Email enviado correctamente');
            } else {
                setStatus('error');
                setMessage(`❌ Error: ${data.error || 'Error desconocido'}`);
            }
        } catch {
            setStatus('error');
            setMessage('❌ Error de conexión');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {message && (
                <div
                    className={`rounded-lg px-4 py-2 text-sm font-medium shadow-lg ${status === 'success'
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}
                >
                    {message}
                </div>
            )}
            <button
                onClick={handleSendTest}
                disabled={status === 'sending'}
                className="rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
                {status === 'sending' ? '📧 Enviando...' : '📧 Test Email'}
            </button>
        </div>
    );
}
