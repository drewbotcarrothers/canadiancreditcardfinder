'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CardImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    width?: number;
    height?: number;
}

export default function CardImage({ src, alt, fill, className, priority, width, height }: CardImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc('/images/cards/placeholder.png');
        }
    };

    if (fill) {
        return (
            <Image
                src={imgSrc}
                alt={alt}
                fill
                className={className}
                priority={priority}
                onError={handleError}
            />
        );
    }

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={width || 300}
            height={height || 189}
            className={className}
            priority={priority}
            onError={handleError}
        />
    );
}
