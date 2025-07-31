import React from 'react';

const TrashZone = () => {
    const onMouseLeave = (e: React.MouseEvent) => {
        console.log(e)
    }
    return (
      <div onMouseLeave={onMouseLeave} className="trash-zone">
        Trash zone
      </div>
    );
}

export default TrashZone;
