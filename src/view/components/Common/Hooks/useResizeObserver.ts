import { useRef, useEffect } from 'react';

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

export const useResizeObserver = (ref: React.RefObject<Element>, callback: ResizeObserverCallback): void => {
    const observerRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        observerRef.current = new ResizeObserver((entries) => {
            if (entries.length) {
                callback(entries, observerRef.current!);
            }
        });

        observerRef.current.observe(ref.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [ref, callback]);
};
