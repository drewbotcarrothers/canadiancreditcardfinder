import { useEffect, useState } from 'react';
import { CARD_IMAGE_HEIGHT, CARD_IMAGE_WIDTH, cardImageSrc, PLACEHOLDER_IMAGE_SRC } from '../lib/cardImage';

interface CardImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    width?: number;
    height?: number;
}

function CardPlaceholder({ alt, fill, className }: { alt: string; fill?: boolean; className?: string }) {
    return (
        <div
            role="img"
            aria-label={alt}
            className={`${fill ? 'absolute inset-0' : ''} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 ${className ?? ''}`}
        >
            <svg
                className="w-2/3 max-w-[140px] h-auto text-gray-300"
                viewBox="0 0 24 16"
                fill="none"
                aria-hidden="true"
            >
                <rect x="1" y="1" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.25" />
                <path d="M1 5.5h22" stroke="currentColor" strokeWidth="1.25" />
                <rect x="3.5" y="8.5" width="5" height="3.5" rx="0.6" fill="currentColor" opacity="0.35" />
            </svg>
        </div>
    );
}

export default function CardImage({ src, alt, fill, className, priority, width, height }: CardImageProps) {
    const resolvedSrc = cardImageSrc(src);
    const [imgSrc, setImgSrc] = useState(resolvedSrc);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setImgSrc(resolvedSrc);
        setFailed(false);
    }, [resolvedSrc]);

    const handleError = () => {
        if (imgSrc !== PLACEHOLDER_IMAGE_SRC) {
            setImgSrc(PLACEHOLDER_IMAGE_SRC);
            return;
        }
        setFailed(true);
    };

    if (failed) {
        return <CardPlaceholder alt={alt} fill={fill} className={className} />;
    }

    const imageWidth = width ?? CARD_IMAGE_WIDTH;
    const imageHeight = height ?? CARD_IMAGE_HEIGHT;

    if (fill) {
        return (
            <img
                src={imgSrc}
                alt={alt}
                width={imageWidth}
                height={imageHeight}
                className={`absolute inset-0 w-full h-full object-contain ${className ?? ''}`}
                onError={handleError}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : undefined}
            />
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            width={imageWidth}
            height={imageHeight}
            className={className}
            style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
        />
    );
}
