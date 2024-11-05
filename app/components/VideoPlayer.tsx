import React, { useEffect, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

interface Song {
  id: number;
  name: string;
  artist: string;
  src: string;
  cover: string;
}

interface MusicPlayerProps {
  currentSong: number;
  songsList: Song[];
  setCurrentSong: React.Dispatch<React.SetStateAction<number>>;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  songsList,
  setCurrentSong,
}) => {
  const [playing, setPlaying] = useState(false);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (video) {
      video.pause();
      video.currentTime = 0; // Reset only when switching songs
    }

    const newVideo = document.createElement("video");
    newVideo.src = songsList[currentSong].src;
    newVideo.volume = volume;
    setVideo(newVideo);

    const handleEnded = () => {
      setPlaying(false);
      setCurrentSong((prev) => (prev + 1) % songsList.length);
    };

    newVideo.addEventListener("ended", handleEnded);

    return () => {
      newVideo.pause();
      newVideo.removeEventListener("ended", handleEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong, songsList]);

  useEffect(() => {
    if (video) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      playing ? video.play() : video.pause();

      const interval = setInterval(() => {
        setProgress((video.currentTime / video.duration) * 100);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [video, playing]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickX / progressBar.clientWidth) * 100;

    setProgress(newProgress);

    if (video) {
      video.currentTime = (newProgress / 100) * video.duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (video) {
      video.volume = newVolume;
    }
  };

  return (
    <div className="container">
      <div className="video-container">
        {video && (
          <video
            src={songsList[currentSong]?.src}
            style={{ width: "100%" }}
            ref={(el) => {
              if (el && el !== video) {
                setVideo(el); // Define `video` state quando o elemento do DOM é renderizado
              }
            }}
          ></video>
        )}
      </div>

      <div className="song-info">
        <div className="song-name">{songsList[currentSong]?.name}</div>
        <div className="artist-name">{songsList[currentSong]?.artist}</div>
      </div>

      <div className="progress-bar" onClick={handleProgressBarClick}>
        <div className="fill-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="song-time">
        <span>
          {Math.floor((video?.currentTime || 0) / 60)}:
          {Math.floor((video?.currentTime || 0) % 60)
            .toString()
            .padStart(2, "0")}
        </span>
        <span>
          {Math.floor((video?.duration || 0) / 60)}:
          {Math.floor((video?.duration || 0) % 60)
            .toString()
            .padStart(2, "0")}
        </span>
      </div>
      <div className="controls">
        <button
          onClick={() =>
            setCurrentSong(
              (prev) => (prev - 1 + songsList.length) % songsList.length
            )
          }
          className="control-btn previous-btn"
        >
          <FaBackward />
        </button>

        <button
          onClick={() => setPlaying(!playing)}
          className="control-btn play-btn"
        >
          {playing ? <FaPause /> : <FaPlay />}
        </button>

        <button
          onClick={() =>
            setCurrentSong((prev) => (prev + 1) % songsList.length)
          }
          className="control-btn next-btn"
        >
          <FaForward />
        </button>

        {/* Volume Control */}
        <div className="volume-control">
          <button
            onClick={() => setShowVolumeSlider((prev) => !prev)}
            className="control-btn volume-btn"
          >
            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          {showVolumeSlider && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
