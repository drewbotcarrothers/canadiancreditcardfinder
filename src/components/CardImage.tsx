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
            <img
                src={imgSrc}
                alt={alt}
                className={`absolute inset-0 w-full h-full ${className ?? ''}`}
                onError={handleError}
                loading={priority ? 'eager' : 'lazy'}
            />
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            width={width || 300}
            height={height || 189}
            className={className}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
        />
    );
}
