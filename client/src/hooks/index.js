import { useEffect, useState } from 'react';

const useLayout = () => {
    const sizes = {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl'
    }

    const pixels = {
        mobile: 320,
        mobileLandscape: 480,
        tablet: 768,
        tabletLandscape: 1024,
        desktop: 1200,
        desktopLarge: 1500,
        desktopWide: 1920,

        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920
    }

    const [ layout, setLayout ] = useState(sizes.xs);    

    const computeLayout = (ev) => {
        let width = window.innerWidth;

        let layout = {}
        
        let size = sizes.xl;
        layout.xlDown = true;


        if (width < pixels.xl) {
            size = sizes.lg;
            layout.lgDown = true;
        } 
        if (width < pixels.lg) {
            size = sizes.md;
            layout.mdDown = true;
        }
        if (width  < pixels.md) {
            size = sizes.sm;
            layout.smDown = true;
        } 
        if (width < pixels.sm) {
            size = sizes.xs;
            layout.xsDown = true;
        }  
        
        layout[size] = true;
        setLayout(layout);
    };

    useEffect(() => {
        // Compute initial size;
        computeLayout();

        window.addEventListener('resize', computeLayout);
        return () => window.removeEventListener('resize', computeLayout);
    }, [])

    return layout;
}



export {
    useLayout
}