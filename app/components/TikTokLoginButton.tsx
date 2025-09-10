import { Form } from '@remix-run/react';

export default function TikTokLoginButton() {
  return (
    <Form method="post" action="/login">
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#fe2c55',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Connect to TikTok
      </button>
    </Form>
  );
}