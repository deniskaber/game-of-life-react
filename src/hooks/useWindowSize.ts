import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

interface WindowSize {
    width: number;
    height: number;
}

const init = (): WindowSize => {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
};

const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState(init);

    useEffect(() => {
        const handleWindowResize = debounce(() => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }, 100);

        window.addEventListener('resize', handleWindowResize);

        return (): void => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return windowSize;
};

export default useWindowSize;
