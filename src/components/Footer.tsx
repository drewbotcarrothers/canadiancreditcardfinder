import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/images/logo.png"
                                    alt="Canadian Credit Card Finder Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-lg text-gray-900">
                                Canadian Credit Card Finder
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm max-w-md">
                            Helping Canadians find the best credit cards for their needs.
                            Compare rewards, cashback, travel, and low interest cards.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/compare" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                                        Compare Cards
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-gray-500 text-xs leading-relaxed">
                        <strong>Disclaimer:</strong> Information provided on this website is believed to be accurate
                        but is not guaranteed. Please verify all details with the card issuer before applying.
                        Credit card offers, terms, and conditions are subject to change without notice.
                        We may receive compensation from partners when you apply for credit cards through our links.
                    </p>
                </div>

                {/* Copyright */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Canadian Credit Card Finder. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
