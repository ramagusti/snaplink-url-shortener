import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ShortUrlRedirect() {
  const router = useRouter();
  const { shortId } = router.query;

  useEffect(() => {
    if (shortId) {
      // Redirect will be handled by API route
      window.location.href = `/api/shorten?shortId=${shortId}`;
    }
  }, [shortId]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <p>Redirecting...</p>
    </div>
  );
}
