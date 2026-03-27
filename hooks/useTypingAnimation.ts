'use client';

import { useState, useEffect } from 'react';

interface UseTypingAnimationOptions {
    text: string;
    speed?: number;
    delay?: number;
    loop?: boolean;
    deleteSpeed?: number;
    pauseAfterComplete?: number;
}

export const useTypingAnimation = ({
    text,
    speed = 80,
    delay = 0,
    loop = false,
    deleteSpeed = 50,
    pauseAfterComplete = 2000,
}: UseTypingAnimationOptions) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) {
            const pauseTimeout = setTimeout(() => {
                setIsPaused(false);
                if (loop) {
                    setIsDeleting(true);
                }
            }, pauseAfterComplete);
            return () => clearTimeout(pauseTimeout);
        }

        if (!isDeleting && currentIndex === text.length) {
            if (loop) {
                setIsPaused(true);
            }
            return;
        }

        if (isDeleting && currentIndex === 0) {
            setIsDeleting(false);
            return;
        }

        const timeout = setTimeout(
            () => {
                if (isDeleting) {
                    setDisplayedText(text.substring(0, currentIndex - 1));
                    setCurrentIndex(currentIndex - 1);
                } else {
                    setDisplayedText(text.substring(0, currentIndex + 1));
                    setCurrentIndex(currentIndex + 1);
                }
            },
            delay && currentIndex === 0 ? delay : isDeleting ? deleteSpeed : speed
        );

        return () => clearTimeout(timeout);
    }, [currentIndex, text, speed, delay, isDeleting, loop, deleteSpeed, isPaused, pauseAfterComplete]);

    return { displayedText, isComplete: currentIndex === text.length && !isDeleting };
};
