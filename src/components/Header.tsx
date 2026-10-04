import { useState } from 'react';
import { useCompare } from '../hooks/useCompare';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { compareCards } = useCompare();
    const compareCount = compareCards.length;

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="/" className="flex items-center shrink-0" aria-label="Canadian Credit Card Finder home">
                        <picture>
                            {/* Very small phones (<300px): padded bear icon only, so the logo never crowds the menu button */}
                            <source
                                type="image/webp"
                                media="(max-width: 299px)"
                                srcSet="/images/logo-icon-v2.webp 1x, /images/logo-icon-v2@2x.webp 2x"
                                width={56}
                                height={56}
                            />
                            <source
                                media="(max-width: 299px)"
                                srcSet="/images/logo-icon-v2.png 1x, /images/logo-icon-v2@2x.png 2x"
                                width={56}
                                height={56}
                            />
                            <source
                                type="image/webp"
                                srcSet="/images/logo-lockup-v2.webp 1x, /images/logo-lockup-v2@2x.webp 2x"
                                width={344}
                                height={56}
                            />
                            <img
                                src="/images/logo-lockup-v2.png"
                                srcSet="/images/logo-lockup-v2.png 1x, /images/logo-lockup-v2@2x.png 2x"
                                alt="Canadian Credit Card Finder"
                                width={344}
                                height={56}
                                fetchPriority="high"
                                decoding="async"
                                className="h-10 max-[359px]:h-9 md:h-12 lg:h-14 w-auto"
                            />
                        </picture>
                    </a>

                    <nav className="hidden md:flex items-center space-x-8">
                        <a
                            href="/"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="/finder/"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Finder
                        </a>
                        <a
                            href="/guides/"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Guides
                        </a>
                        <a
                            href="/compare/"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center"
                        >
                            Compare
                            {compareCount > 0 && (
                                <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {compareCount}
                                </span>
                            )}
                        </a>
                    </nav>

                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {mobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <a
                                href="/"
                                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </a>
                            <a
                                href="/finder/"
                                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Finder
                            </a>
                            <a
                                href="/guides/"
                                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Guides
                            </a>
                            <a
                                href="/compare/"
                                className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Compare
                                {compareCount > 0 && (
                                    <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {compareCount}
                                    </span>
                                )}
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
