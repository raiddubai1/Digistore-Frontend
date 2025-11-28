import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  let backendStatus = 'not configured';
  let backendData = null;
  let backendError = null;
  
  if (apiUrl) {
    try {
      // Test backend connection
      const response = await fetch(`${apiUrl.replace('/api', '')}/health`, {
        method: 'GET',
        cache: 'no-store',
      });
      
      if (response.ok) {
        backendData = await response.json();
        backendStatus = 'connected';
      } else {
        backendStatus = 'error';
        backendError = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error: any) {
      backendStatus = 'error';
      backendError = error.message;
    }
  }
  
  return NextResponse.json({
    frontend: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    backend: {
      url: apiUrl || 'not set',
      status: backendStatus,
      data: backendData,
      error: backendError,
    },
  });
}

