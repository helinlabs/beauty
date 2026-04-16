import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        padding: '140px 24px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: '#f5f2fb',
        background: '#0f0d14',
        minHeight: '70vh',
      }}
    >
      <h1 style={{ fontSize: 56, marginBottom: 12 }}>404</h1>
      <p style={{ color: '#a69eb8', marginBottom: 24 }}>
        Page not found / 페이지를 찾을 수 없습니다.
      </p>
      <Link href="/" style={{ color: '#ff4f8b', fontWeight: 700 }}>
        ← Home
      </Link>
    </div>
  );
}
