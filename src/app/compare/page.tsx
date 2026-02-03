import { Metadata } from 'next';
import { Suspense } from 'react';
import { getCards } from '@/lib/data';
import CompareContent from './CompareContent';

export const metadata: Metadata = {
    title: 'Compare Credit Cards Side-by-Side | Canadian Credit Card Finder',
    description: 'Compare up to 3 Canadian credit cards side by side. See fees, rates, rewards to find your best match at Canadian Credit Card Finder.',
};

export default async function ComparePage() {
    const cards = await getCards();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Compare Credit Cards
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select up to 3 cards to compare side by side. Find the best card for your needs.
                </p>
            </div>

            <Suspense fallback={<LoadingState />}>
                <CompareContent allCards={cards} />
            </Suspense>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="bg-white rounded-xl shadow-md p-8 animate-pulse">
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="text-center">
                        <div className="h-32 bg-gray-200 rounded-lg mb-4" />
                        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
