import React, { useState } from 'react';
import StickyNote from './StickyNote';

// Define the structure for a note in our state
interface Note {
    id: string;
    x: number;
    y: number;
    zIndex: number;
}
const Workspace = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [highestZIndex, setHighestZIndex] = useState(0); // To manage stacking order

    // Function to create a new note on double-click
    const handleDoubleClick = (e: React.MouseEvent) => {
        // Only create a note if double-clicking on the main app background
        if ((e.target as HTMLElement).id === 'app-container') {
            const newZIndex = highestZIndex + 1;
            setNotes((prevNotes) => [
                ...prevNotes,
                {
                    id: String(new Date().getTime()),
                    x: e.clientX,
                    y: e.clientY,
                    zIndex: newZIndex,
                },
            ]);
            setHighestZIndex(newZIndex);
        }
    };

    // Function to delete a note
    const handleDeleteNote = (idToDelete: string) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== idToDelete));
    };

    // Function to bring a note to the front (highest z-index)
    const handleBringNoteToFront = (idToBringFront: string) => {
        setHighestZIndex((prev) => prev + 1); // Increment highest z-index
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === idToBringFront ? { ...note, zIndex: highestZIndex + 1 } : note
            )
        );
    };

    return (
            <div
                id="app-container" // Important for double-click target
                onDoubleClick={handleDoubleClick}
                style={{
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden', // Prevent scrollbars from notes going off-screen
                    backgroundColor: '#f0f0f0',
                    position: 'relative', // Needed for absolute positioning of notes
                }}
                className="workspace"
            >
                {notes.map((note) => (
                    <StickyNote
                        key={note.id}
                        id={note.id}
                        initialX={note.x}
                        initialY={note.y}
                        onDelete={handleDeleteNote}
                        onBringToFront={handleBringNoteToFront}
                        zIndex={note.zIndex}
                    />
                ))}
            </div>
    );
}

export default Workspace;
