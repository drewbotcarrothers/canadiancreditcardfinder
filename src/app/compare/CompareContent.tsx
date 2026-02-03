'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard } from '@/lib/types';
import { parseBonusValue } from '@/lib/utils';
import CardImage from '@/components/CardImage';

interface CompareContentProps {
    allCards: CreditCard[];
}

export default function CompareContent({ allCards }: CompareContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showSelector, setShowSelector] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedSlugs = searchParams.get('cards')?.split(',').filter(Boolean) || [];
    const selectedCards = selectedSlugs
        .map(slug => allCards.find(c => c.slug === slug))
        .filter((c): c is CreditCard => c !== undefined);

    const addCard = (slug: string) => {
        if (selectedSlugs.length < 3 && !selectedSlugs.includes(slug)) {
            const newSlugs = [...selectedSlugs, slug];
            router.push(`/compare?cards=${newSlugs.join(',')}`);
        }
        setShowSelector(false);
        setSearchTerm('');
    };

    const removeCard = (slug: string) => {
        const newSlugs = selectedSlugs.filter(s => s !== slug);
        if (newSlugs.length > 0) {
            router.push(`/compare?cards=${newSlugs.join(',')}`);
        } else {
            router.push('/compare');
        }
    };

    const filteredCards = allCards.filter(card =>
        !selectedSlugs.includes(card.slug) &&
        (card.creditCardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.issuer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Helper to find best value
    const getBestValue = (getValue: (c: CreditCard) => number, type: 'lowest' | 'highest') => {
        if (selectedCards.length === 0) return null;
        const values = selectedCards.map(getValue);
        return type === 'lowest' ? Math.min(...values) : Math.max(...values);
    };

    const lowestFee = getBestValue(c => c.annualFee, 'lowest');
    const lowestPurchaseRate = getBestValue(c => c.purchaseInterestRate, 'lowest');
    const lowestCashRate = getBestValue(c => c.cashAdvanceInterestRate, 'lowest');
    const highestBonus = getBestValue(c => parseBonusValue(c.welcomeBonusValue), 'highest');

    return (
        <div>
            {/* Card Selection Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[0, 1, 2].map(index => {
                    const card = selectedCards[index];
                    return (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-md p-6 min-h-[200px] flex flex-col items-center justify-center ${!card ? 'border-2 border-dashed border-gray-300' : ''
                                }`}
                        >
                            {card ? (
                                <>
                                    <div className="relative w-full h-24 mb-4">
                                        <CardImage
                                            src={`/images/cards/${card.imageFile}`}
                                            alt={card.creditCardName}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="font-semibold text-gray-900 text-center text-sm mb-2">
                                        {card.creditCardName}
                                    </p>
                                    <button
                                        onClick={() => removeCard(card.slug)}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowSelector(true)}
                                    disabled={selectedSlugs.length >= 3}
                                    className="flex flex-col items-center text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Add Card</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Comparison Table */}
            {selectedCards.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">
                                        Feature
                                    </th>
                                    {selectedCards.map(card => (
                                        <th key={card.id} className="px-6 py-4 text-center">
                                            <Link
                                                href={`/card/${card.slug}`}
                                                className="text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors"
                                            >
                                                {card.creditCardName}
                                            </Link>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* Card Image */}
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Card</td>
                                    {selectedCards.map(card => (
                                        <td key={card.id} className="px-6 py-4">
                                            <div className="relative h-20 mx-auto w-32">
                                                <CardImage
                                                    src={`/images/cards/${card.imageFile}`}
                                                    alt={card.creditCardName}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Issuer */}
                                <tr className="bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Issuer</td>
                                    {selectedCards.map(card => (
                                        <td key={card.id} className="px-6 py-4 text-center text-sm text-gray-900">
                                            {card.issuer}
                                        </td>
                                    ))}
                                </tr>

                                {/* Category */}
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Category</td>
                                    {selectedCards.map(card => (
                                        <td key={card.id} className="px-6 py-4 text-center">
                                            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                                {card.category}
                                            </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Annual Fee */}
                                <tr className="bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Annual Fee</td>
                                    {selectedCards.map(card => (
                                        <td
                                            key={card.id}
                                            className={`px-6 py-4 text-center text-sm font-semibold ${card.annualFee === lowestFee ? 'text-green-600 bg-green-50' : 'text-gray-900'
                                                }`}
                                        >
                                            {card.annualFeeDisplay}
                                            {card.annualFee === lowestFee && <span className="ml-1">★</span>}
                                        </td>
                                    ))}
                                </tr>

                                {/* Purchase Interest Rate */}
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Purchase Rate</td>
                                    {selectedCards.map(card => (
                                        <td
                                            key={card.id}
                                            className={`px-6 py-4 text-center text-sm font-semibold ${card.purchaseInterestRate === lowestPurchaseRate && card.purchaseInterestRateDisplay ? 'text-green-600 bg-green-50' : 'text-gray-900'
                                                }`}
                                        >
                                            {card.purchaseInterestRateDisplay || 'N/A'}
                                            {card.purchaseInterestRate === lowestPurchaseRate && card.purchaseInterestRateDisplay && <span className="ml-1">★</span>}
                                        </td>
                                    ))}
                                </tr>

                                {/* Cash Advance Rate */}
                                <tr className="bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Cash Advance Rate</td>
                                    {selectedCards.map(card => (
                                        <td
                                            key={card.id}
                                            className={`px-6 py-4 text-center text-sm font-semibold ${card.cashAdvanceInterestRate === lowestCashRate && card.cashAdvanceInterestRateDisplay ? 'text-green-600 bg-green-50' : 'text-gray-900'
                                                }`}
                                        >
                                            {card.cashAdvanceInterestRateDisplay || 'N/A'}
                                            {card.cashAdvanceInterestRate === lowestCashRate && card.cashAdvanceInterestRateDisplay && <span className="ml-1">★</span>}
                                        </td>
                                    ))}
                                </tr>

                                {/* Rewards Program */}
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Rewards Program</td>
                                    {selectedCards.map(card => (
                                        <td key={card.id} className="px-6 py-4 text-center text-sm text-gray-900">
                                            {card.rewardsProgram || 'N/A'}
                                        </td>
                                    ))}
                                </tr>

                                {/* Welcome Bonus */}
                                <tr className="bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Welcome Bonus</td>
                                    {selectedCards.map(card => (
                                        <td key={card.id} className="px-6 py-4 text-center text-sm text-gray-900">
                                            <p className="line-clamp-3">{card.welcomeBonus || 'N/A'}</p>
                                        </td>
                                    ))}
                                </tr>

                                {/* Bonus Value */}
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Bonus Value</td>
                                    {selectedCards.map(card => {
                                        const bonusValue = parseBonusValue(card.welcomeBonusValue);
                                        return (
                                            <td
                                                key={card.id}
                                                className={`px-6 py-4 text-center text-sm font-semibold ${bonusValue === highestBonus && bonusValue > 0 ? 'text-green-600 bg-green-50' : 'text-gray-900'
                                                    }`}
                                            >
                                                {card.welcomeBonusValue || 'N/A'}
                                                {bonusValue === highestBonus && bonusValue > 0 && <span className="ml-1">★</span>}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Insurance */}
                                <tr className="bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Insurance</td>
                                    {selectedCards.map(card => (
                                        <td key={card.id} className="px-6 py-4 text-center text-sm text-gray-900">
                                            <p className="line-clamp-3">{card.insurance || 'N/A'}</p>
                                        </td>
                                    ))}
                                </tr>

                                {/* Apply Button */}
                                <tr>
                                    <td className="px-6 py-4"></td>
                                    {selectedCards.map(card => (
                                        <td key={card.id} className="px-6 py-4 text-center">
                                            <a
                                                href={card.productLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
                                            >
                                                Apply Now
                                            </a>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
                        ★ = Best value in row
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards selected</h3>
                    <p className="text-gray-600 mb-6">Add cards to compare them side by side.</p>
                    <button
                        onClick={() => setShowSelector(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Add Your First Card
                    </button>
                </div>
            )}

            {/* Card Selector Modal */}
            {showSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowSelector(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Select a Card</h2>
                                <button
                                    onClick={() => setShowSelector(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search cards..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div className="overflow-y-auto max-h-[60vh] p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredCards.map(card => (
                                    <button
                                        key={card.id}
                                        onClick={() => addCard(card.slug)}
                                        className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors text-left"
                                    >
                                        <div className="relative w-16 h-12 flex-shrink-0">
                                            <CardImage
                                                src={`/images/cards/${card.imageFile}`}
                                                alt={card.creditCardName}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{card.creditCardName}</p>
                                            <p className="text-sm text-gray-500">{card.issuer}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {filteredCards.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No cards found matching your search.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
