'use client';
import { useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import styles from './page.module.css';

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('');
  return (
    <div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          className={styles['chat-input']}
          type='text'
          placeholder='Message...'
        />
        <button
          onClick={() => sendMessage(message)}
          className={styles['button']}
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((e) => (
          <li>{e}</li>
        ))}
      </div>
    </div>
  );
}
