import React, { useState, useRef, useEffect } from 'react';
import {Note} from "../../../types";

interface StickyNoteProps {
    onDelete: (id: string) => void;
    onBringToFront: (id: string) => void;
    initialColor?: string;
    note: Note;
}

const noteColors = [
    '#fdfd96', // Light Yellow
    '#ffadad', // Light Red/Pink
    '#84e4c2', // Light Green/Aqua
    '#c7ceea', // Light Blue/Purple
    '#fdc2ad', // Light Orange
];

const StickyNote: React.FC<StickyNoteProps> = ({
                                                   onDelete,
                                                   onBringToFront,
                                                   initialColor = noteColors[0],
    note,
                                               }) => {
    const {
        id,
        zIndex,
        initWidth,
        initHeight,
        initialX,
        initialY} = note;
    const [x, setX] = useState(initialX);
    const [y, setY] = useState(initialY);
    const [width, setWidth] = useState(initWidth);
    const [height, setHeight] = useState(initHeight);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [dragOffsetY, setDragOffsetY] = useState(0);
    const [noteColor, setNoteColor] = useState(initialColor);

    const noteRef = useRef<HTMLDivElement>(null);

    // --- Dragging Logic ---
    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if clicking on the header (not the resize handle)
        if ((e.target as HTMLElement).classList.contains('sticky-note-header')) {
            setIsDragging(true);
            setDragOffsetX(e.clientX - x);
            setDragOffsetY(e.clientY - y);
            onBringToFront(id); // Bring this note to the front when dragging starts
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setX(e.clientX - dragOffsetX);
            setY(e.clientY - dragOffsetY);
        } else if (isResizing) {
            const newWidth = e.clientX - (noteRef.current?.offsetLeft || x);
            const newHeight = e.clientY - (noteRef.current?.offsetTop || y);
            // Ensure minimum size
            setWidth(Math.max(150, newWidth));
            setHeight(Math.max(150, newHeight));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, x, y]);

    // --- Resizing Logic ---
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent dragging when clicking resize handle
        setIsResizing(true);
        onBringToFront(id); // Bring this note to the front when resizing starts
    };

    const handleDeleteClick = () => {
        onDelete(id);
    };

    return (
        <div
            ref={noteRef}
            className="sticky-note"
            style={{
                zIndex: zIndex,
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: noteColor,
            }}
            onMouseDown={() => onBringToFront(id)}
        >
            <div
                className="sticky-note-header"
                style={{
                    backgroundColor: noteColor,
                    backgroundImage: `linear-gradient(to bottom, ${noteColor}, ${noteColor}e0)`, // Lighter to slightly darker
                }}
                onMouseDown={handleMouseDown}
            >
                <span>Note {id.slice(-4)}</span>
                <button
                    className="sticky-note-delete-button"
                    onClick={handleDeleteClick}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c00')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#777')}
                >
                    &times;
                </button>
            </div>
            <textarea
                style={{
                    flexGrow: 1,
                    border: 'none',
                    padding: '12px',
                    resize: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '1em',
                    lineHeight: '1.5',
                    color: '#333',
                }}
                placeholder="Type your note here..."
            />

            <div className="notes-colors-container">
                {noteColors.map((color) => (
                    <div
                        className="notes-colors"
                        key={color}
                        onClick={() => setNoteColor(color)}
                        style={{
                            backgroundColor: color,
                            border: noteColor === color ? '2px solid #555' : '1px solid #ccc',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                ))}
            </div>

            <div
                className="sticky-note-resize-handle"
                onMouseDown={handleResizeMouseDown}
            />
        </div>
    );
};

export default StickyNote;