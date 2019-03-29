import React, { useEffect, useState, useRef } from 'react';

const handleStick = () => {
    const [stick, setstick] = useState(false);
    const [height, setheight] = useState(0);
    const ref = useRef(null);

    let offset = 0;

    const handleCheck = () => {
        if (offset > 0 && height > 0) {
            if (document.documentElement.scrollTop >= offset && !stick) return setstick(true);
            if (document.documentElement.scrollTop < offset && stick) return setstick(false);
        }
    }
    
    useEffect(() => {
        handleCheck();
        if (height === 0 || offset === 0) { 
            const { height, top } = ref.current.getBoundingClientRect();
            setheight(height) 
            offset = top + document.documentElement.scrollTop;
        }

        window.addEventListener('scroll', handleCheck);
        return () => window.removeEventListener('scroll', handleCheck)
    })

    return { stick, ref, height };
}

const Sticky = ({ children, className, style = {} }) => {
    const { height, stick, ref } = handleStick();
    const stickyStyle = { position: 'fixed', top: 0, left: 0 }

    return (
        <>
            <div ref={ref} className={className} style={stick ? { ...style, ...stickyStyle } : style}>{children}</div>
            { stick && <div style={{ height }} /> }
        </>
    )
}

export default Sticky;