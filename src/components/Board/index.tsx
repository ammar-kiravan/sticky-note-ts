import React, {useEffect, useState} from 'react';
import StickyNote from '../common/StickyNote';
import NumberInput from "../common/Input";
import Button from "../common/Button";
import {Note} from "../../types";
import {storageService} from "../../services/storage";

const Board = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [highestZIndex, setHighestZIndex] = useState(0); // To manage stacking order
    const [noteWidth, setNoteWidth] = useState<number | undefined>(150);
    const [noteHeight, setNoteHeight] = useState<number | undefined>(150);
    useEffect(() => {
        const initNotes : Note[] | null = storageService.get('notes');
        if(initNotes) {
            setNotes(initNotes);
        }
    }, [])
    const handleAddNote = (e: React.MouseEvent) => {
            const newZIndex = highestZIndex + 1;
            setNotes((prevNotes) => {
                const notes = [
                    ...prevNotes,
                    {
                        id: String(new Date().getTime()),
                        initialX: e.clientX,
                        initialY: e.clientY,
                        zIndex: newZIndex,
                        initWidth: noteWidth,
                        initHeight: noteHeight,
                    },
                ]
                storageService.save('notes', notes)
                return notes
            });
            setHighestZIndex(newZIndex);
    };

    const handleDeleteNote = (idToDelete: string) => {
        setNotes((prevNotes) => {
            const newNotes =  prevNotes.filter((note) => note.id !== idToDelete)
            storageService.save('notes', newNotes)
            return  newNotes
        });
    };

    const handleBringNoteToFront = (idToBringFront: string) => {
        setHighestZIndex((prev) => prev + 1);
        setNotes((prevNotes) => {
            const newNotes = prevNotes.map((note) =>
                note.id === idToBringFront ? { ...note, zIndex: highestZIndex + 1 } : note
            )
            storageService.save('notes', newNotes)
            return newNotes
            }
        );
    };

    return (
            <div
                id="app-container"
                onDoubleClick={handleAddNote}
                className="board"
            >
                <NumberInput
                    label="Width"
                    onChange={(val) => setNoteWidth(val)}
                    value={noteWidth}
                />
                <NumberInput
                    label="Height"
                    onChange={(val) => setNoteHeight(val)}
                    value={noteHeight}
                />
                <Button onClick={handleAddNote}/>
                <div>
                    <span className="board-text">Double click on the board to create a new note</span>
                    {notes.map((note) => (
                        <StickyNote
                            key={note.id}
                            onDelete={handleDeleteNote}
                            onBringToFront={handleBringNoteToFront}
                            note={note}
                        />
                    ))}
                </div>
            </div>
    );
}

export default Board;
