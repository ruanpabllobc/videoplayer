"use client";

import { useState } from 'react';
import MusicPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import songsList from './components/videosList';

const Page = () => {
    const [currentSong, setCurrentSong] = useState<number>(0); // Aqui especificamos o tipo como number

    return (
        <div>
            <Sidebar 
                songsList={songsList} 
                currentSong={currentSong} // Adicione currentSong aqui
                setCurrentSong={setCurrentSong} 
            />
            <MusicPlayer 
                currentSong={currentSong} 
                songsList={songsList} 
                setCurrentSong={setCurrentSong} 
            />
        </div>
    );
};

export default Page;