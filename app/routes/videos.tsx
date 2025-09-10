import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import TikTokVideo from '~/components/TikTokVideo';
import { sessionStorage } from '~/sessions';

export async function loader({ request }) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const accessToken = session.get('tiktokAccessToken');
  if (!accessToken) return redirect('/');

  try {
    const response = await fetch('https://open.tiktokapis.com/v2/video/list/?fields=id,embed_link,create_time,title', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ max_count: 20 }),
    });

    const data = await response.json();
    if (data.error.code !== 'ok') return json({ videos: [], error: data.error.message });
    return json({ videos: data.data.videos });
  } catch (error) {
    return json({ videos: [], error: 'Failed to fetch videos' });
  }
}

export default function Videos() {
  const { videos, error } = useLoaderData();
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Your TikTok Videos</h1>
      {videos.map(video => (
        <TikTokVideo key={video.id} video={video} username="sugamo_japan" />
      ))}
    </div>
  );
}