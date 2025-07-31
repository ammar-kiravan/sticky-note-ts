// StickyNote.tsx
import React, { useState, useRef, useEffect } from 'react';

// Define the props for our StickyNote component
interface StickyNoteProps {
    initialX: number;
    initialY: number;
    id: string; // Unique ID for each note
    onDelete: (id: string) => void; // Callback to delete the note
    onBringToFront: (id: string) => void; // Callback to bring note to front
    zIndex: number; // For managing stacking order
    initialColor?: string; // New prop for note color
}

// Predefined pastel colors for notes
const noteColors = [
    '#fdfd96', // Light Yellow
    '#ffadad', // Light Red/Pink
    '#84e4c2', // Light Green/Aqua
    '#c7ceea', // Light Blue/Purple
    '#fdc2ad', // Light Orange
];

const StickyNote: React.FC<StickyNoteProps> = ({
                                                   initialX,
                                                   initialY,
                                                   id,
                                                   onDelete,
                                                   onBringToFront,
                                                   zIndex,
                                                   initialColor = noteColors[0], // Default to first color if not provided
                                               }) => {
    const [x, setX] = useState(initialX);
    const [y, setY] = useState(initialY);
    const [width, setWidth] = useState(240); // Slightly larger initial size
    const [height, setHeight] = useState(240);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [dragOffsetY, setDragOffsetY] = useState(0);
    const [noteColor, setNoteColor] = useState(initialColor);

    const noteRef = useRef<HTMLDivElement>(null); // Ref to the note's DOM element

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
        // Attach and clean up global mouse move/up listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, x, y]); // Dependencies for useEffect

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
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: noteColor, // Use the selected color
                borderRadius: '8px', // Slightly rounded corners
                boxShadow: '3px 3px 10px rgba(0,0,0,0.25)', // More pronounced shadow
                display: 'flex',
                flexDirection: 'column',
                zIndex: zIndex, // Apply the z-index
                fontFamily: 'Caveat, cursive, "Comic Sans MS", "Chalkboard SE", sans-serif', // Playful font stack
                transition: 'box-shadow 0.1s ease-in-out', // Smooth shadow transition
            }}
            onMouseDown={() => onBringToFront(id)} // Bring note to front on any click
        >
            <div
                className="sticky-note-header"
                style={{
                    backgroundColor: noteColor, // Header same color initially
                    // Subtle gradient for header or darker shade
                    backgroundImage: `linear-gradient(to bottom, ${noteColor}, ${noteColor}e0)`, // Lighter to slightly darker
                    padding: '8px 12px',
                    cursor: 'grab',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0,0,0,0.1)', // Lighter border
                    borderTopLeftRadius: '8px', // Match note border radius
                    borderTopRightRadius: '8px',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    color: '#333',
                }}
                onMouseDown={handleMouseDown}
            >
                <span>Note {id.slice(-4)}</span>
                <button
                    onClick={handleDeleteClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#777',
                        fontSize: '1.5em',
                        cursor: 'pointer',
                        padding: '0 5px',
                        lineHeight: '1', // Better vertical alignment
                        transition: 'color 0.2s ease-in-out',
                    }}
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

            {/* Color Palette Selector (Optional: to change note color after creation) */}
            <div
                style={{
                    display: 'flex',
                    padding: '5px',
                    justifyContent: 'center',
                    gap: '5px',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                }}
            >
                {noteColors.map((color) => (
                    <div
                        key={color}
                        onClick={() => setNoteColor(color)}
                        style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: noteColor === color ? '2px solid #555' : '1px solid #ccc',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'transform 0.1s ease-in-out',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                ))}
            </div>

            <div
                className="sticky-note-resize-handle"
                onMouseDown={handleResizeMouseDown}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20px', // Larger handle for easier grabbing
                    height: '20px',
                    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle, semi-transparent
                    cursor: 'nwse-resize',
                    borderTopLeftRadius: '5px',
                    // Optional: A small triangle shape visually
                    clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                }}
            />
        </div>
    );
};

export default StickyNote;