import React from 'react';

function MusicPlayer() {
  return (
    <div className="music-player-container">
      <iframe
        style={{ borderRadius: '12px' }}
        src="https://open.spotify.com/embed/album/25b5ZXP8RW1SNYbYZ3m30b?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    </div>
  );
}

export default MusicPlayer;
