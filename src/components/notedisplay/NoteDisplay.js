import React, { useEffect, useState } from 'react';
import { scroll } from 'framer-motion/dom';
import { fetchAllNotes, getNoteImage } from '../../api/NoteDisplayApi';
import config from '../../config/config.json';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

function NoteDisplay() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const data = await fetchAllNotes();
                const formattedNotes = data.map(note => ({
                    id: note.noteid,
                    name: note.notename,
                    imageUrl: getNoteImage(note.notecovername),
                    link: `${config.learningJourneyHubRoot}${note.noteurl}`
                }));
                setNotes(formattedNotes);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        loadNotes();

        const progressWheel = document.querySelector(".indicator");

        scroll((progress) => {
            progressWheel.style.strokeDasharray = `${progress}, 1`;
        }, {
            source: document.querySelector("ul"),
            axis: "x"
        });
    }, []);

    return (
        <>
            <Typography level="h2" sx={{ marginBottom: '1rem', fontFamily: theme.typography.fontFamily }}>Notes</Typography>
            <div style={{
                letterSpacing: '-0.3px',
                borderRadius: '15px',
                display: 'flex',
                backgroundColor: '#FF0266',
                paddingRight: '20px',
                marginLeft: '5%'
            }}>
                <svg id="progress" width="75" height="75" viewBox="0 0 100 100" style={{
                    top: '20px',
                    left: '20px',
                    transform: 'rotate(-90deg)'
                }}>
                    <circle cx="50" cy="50" r="30" pathLength="1" style={{
                        stroke: '#ffffff',
                        opacity: 0.3,
                        strokeDashoffset: 0,
                        strokeWidth: '15%',
                        fill: 'none'
                    }} />
                    <circle cx="50" cy="50" r="30" pathLength="1" className="indicator" style={{
                        stroke: '#ffffff',
                        strokeDashoffset: 0,
                        strokeWidth: '15%',
                        fill: 'none'
                    }} />
                </svg>
                <ul style={{
                    alignItems: 'center',
                    display: 'flex',
                    listStyle: 'none',
                    height: '150px',
                    overflowX: 'scroll',
                    padding: '10px 0',
                    flex: '0 0 90%',
                    // // Hide scrollbar for Chrome, Safari and Opera
                    // WebkitOverflowScrolling: 'touch',
                    // '::-webkit-scrollbar': { display: 'none' },
                    // // Hide scrollbar for IE, Edge and Firefox
                    // msOverflowStyle: 'none',
                    // scrollbarWidth: 'none'
                }}>
                    {notes.map((note) => (
                        <li key={note.id} style={{
                            flex: '0 0 100.5px',
                            height: '130px',
                            background: '#ffffff',
                            margin: '0 5px',
                            borderRadius: '10px',
                            position: 'relative',
                            padding: '5px',
                        }}>
                            <a href={note.link} style={{ display: 'flex', height: '100%' }}>
                                <img src={note.imageUrl} alt={note.name} style={{ width: '100.5px', height: '130px', borderRadius: '10px' }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    width: '100%',
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    visibility: 'hidden'
                                }}>
                                    {note.name}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default NoteDisplay;
