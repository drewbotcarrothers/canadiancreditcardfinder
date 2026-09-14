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
                    <a href="/" className="flex items-center space-x-2 sm:space-x-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                            <img
                                src="/images/logo.png"
                                alt="Canadian Credit Card Finder Logo"
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                        </div>
                        <span className="font-bold text-lg text-gray-900 hidden sm:block">
                            Canadian Credit Card Finder
                        </span>
                        <span className="font-bold text-lg text-gray-900 sm:hidden">
                            CCCF
                        </span>
                    </a>

                    <nav className="hidden md:flex items-center space-x-8">
                        <a
                            href="/"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Home
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
