import { useState, useEffect } from 'react';

interface TikTokVideoProps {
  video: { id: string; title: string };
  username: string;
}

export default function TikTokVideo({ video, username }: TikTokVideoProps) {
  const [embedHtml, setEmbedHtml] = useState('');

  useEffect(() => {
    async function getEmbedHtml() {
      const videoUrl = `https://www.tiktok.com/@${username}/video/${video.id}`;
      const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();
      setEmbedHtml(data.html);
    }
    getEmbedHtml();
  }, [video.id, username]);

  return (
    <div>
      <h3>{video.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
    </div>
  );
}