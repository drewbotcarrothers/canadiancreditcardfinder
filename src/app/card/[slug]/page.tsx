import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCardBySlug, getCards, getRelatedCards } from '@/lib/data';
import CardGrid from '@/components/CardGrid';
import CardImage from '@/components/CardImage';
import AddToCompareButton from '@/components/AddToCompareButton';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const cards = await getCards();
    return cards.map((card) => ({
        slug: card.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const card = await getCardBySlug(slug);

    if (!card) {
        return {
            title: 'Card Not Found | Canadian Credit Card Finder',
        };
    }

    return {
        title: `${card.creditCardName} | ${card.issuer} | Canadian Credit Card Finder`,
        description: `${card.creditCardName} from ${card.issuer}. Annual fee: ${card.annualFeeDisplay}. Interest: ${card.purchaseInterestRateDisplay}. ${card.welcomeBonus}. Compare and apply at Canadian Credit Card Finder.`,
    };
}

export default async function CardPage({ params }: PageProps) {
    const { slug } = await params;
    const card = await getCardBySlug(slug);

    if (!card) {
        notFound();
    }

    const relatedCards = await getRelatedCards(card, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
                            Home
                        </Link>
                    </li>
                    <li className="text-gray-400">/</li>
                    <li className="text-gray-900 font-medium truncate">{card.creditCardName}</li>
                </ol>
            </nav>

            {/* Hero Section */}
            <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-10 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Card Image */}
                    <div className="relative h-64 lg:h-80 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center p-8">
                        <div className="relative w-full h-full">
                            <CardImage
                                src={`/images/cards/${card.imageFile}`}
                                alt={`${card.creditCardName} credit card`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Card Info */}
                    <div>
                        <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                            {card.category}
                        </span>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            {card.creditCardName}
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">by {card.issuer}</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={card.productLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-red-600 hover:bg-red-700 text-white text-center py-3 px-8 rounded-lg font-semibold transition-colors text-lg"
                            >
                                Apply Now
                            </a>
                            <Suspense fallback={
                                <button className="border-2 border-gray-200 text-gray-400 py-3 px-8 rounded-lg font-semibold cursor-not-allowed">
                                    Loading...
                                </button>
                            }>
                                <AddToCompareButton slug={card.slug} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Facts */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-5">
                    <p className="text-gray-500 text-sm mb-1">Annual Fee</p>
                    <p className="text-xl font-bold text-gray-900">{card.annualFeeDisplay}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5">
                    <p className="text-gray-500 text-sm mb-1">Purchase Rate</p>
                    <p className="text-xl font-bold text-gray-900">{card.purchaseInterestRateDisplay}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5">
                    <p className="text-gray-500 text-sm mb-1">Cash Advance Rate</p>
                    <p className="text-xl font-bold text-gray-900">{card.cashAdvanceInterestRateDisplay}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5">
                    <p className="text-gray-500 text-sm mb-1">Rewards Program</p>
                    <p className="text-xl font-bold text-gray-900 truncate">{card.rewardsProgram || 'N/A'}</p>
                </div>
            </section>

            {/* Welcome Bonus Section */}
            {card.welcomeBonus && (
                <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 lg:p-8 mb-8 border border-red-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" />
                                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                            </svg>
                        </span>
                        Welcome Bonus
                    </h2>

                    {card.welcomeBonusValue && (
                        <p className="text-lg font-semibold text-red-600 mb-3">
                            Estimated Value: {card.welcomeBonusValue}
                        </p>
                    )}

                    <p className="text-gray-700 mb-4">{card.welcomeBonus}</p>

                    {card.welcomeBonusDetailed && (
                        <div className="bg-white/60 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600 preserve-whitespace">{card.welcomeBonusDetailed}</p>
                        </div>
                    )}

                    {card.welcomeBonusEligibility && (
                        <div className="text-sm text-gray-500">
                            <strong>Eligibility:</strong> {card.welcomeBonusEligibility}
                        </div>
                    )}
                </section>
            )}

            {/* Fees & Interest Rates */}
            <section className="bg-white rounded-2xl shadow-md p-6 lg:p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Fees & Interest Rates</h2>
                <div className="divide-y divide-gray-100">
                    <div className="py-4 flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-900">Annual Fee</p>
                            {card.annualFeeDetail && (
                                <p className="text-sm text-gray-500 mt-1">{card.annualFeeDetail}</p>
                            )}
                        </div>
                        <p className="font-semibold text-gray-900">{card.annualFeeDisplay}</p>
                    </div>
                    <div className="py-4 flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-900">Additional Card Fee</p>
                            {card.additionalCardDetail && (
                                <p className="text-sm text-gray-500 mt-1">{card.additionalCardDetail}</p>
                            )}
                        </div>
                        <p className="font-semibold text-gray-900">{card.additionalCardFeeDisplay}</p>
                    </div>
                    <div className="py-4 flex justify-between">
                        <p className="font-medium text-gray-900">Purchase Interest Rate</p>
                        <p className="font-semibold text-gray-900">{card.purchaseInterestRateDisplay}</p>
                    </div>
                    <div className="py-4 flex justify-between">
                        <p className="font-medium text-gray-900">Cash Advance Interest Rate</p>
                        <p className="font-semibold text-gray-900">{card.cashAdvanceInterestRateDisplay}</p>
                    </div>
                </div>
            </section>

            {/* Rewards & Features */}
            {(card.rewardsProgram || card.features || card.featuresDetailed) && (
                <section className="bg-white rounded-2xl shadow-md p-6 lg:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Rewards & Features</h2>

                    {card.rewardsProgram && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-2">Rewards Program</h3>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {card.rewardsProgram}
                            </p>
                        </div>
                    )}

                    {card.features && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-2">Key Highlights</h3>
                            <div className="text-gray-700 prose prose-sm max-w-none">
                                <p>{card.features}</p>
                            </div>
                        </div>
                    )}

                    {card.featuresDetailed && (
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Detailed Benefits</h3>
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                                <p className="text-sm text-gray-600 preserve-whitespace whitespace-pre-wrap leading-relaxed">
                                    {card.featuresDetailed}
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Insurance Coverage */}
            {card.insurance && (
                <section className="bg-white rounded-2xl shadow-md p-6 lg:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </span>
                        Insurance Coverage
                    </h2>
                    <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                        <p className="text-gray-700 preserve-whitespace whitespace-pre-wrap leading-relaxed">
                            {card.insurance}
                        </p>
                    </div>
                </section>
            )}

            {/* Eligibility Requirements */}
            {card.cardEligibility && (
                <section className="bg-white rounded-2xl shadow-md p-6 lg:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </span>
                        Eligibility Requirements
                    </h2>
                    <div className="bg-green-50/50 rounded-xl p-6 border border-green-100">
                        <p className="text-gray-700 preserve-whitespace whitespace-pre-wrap leading-relaxed">
                            {card.cardEligibility}
                        </p>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-center text-white mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    Ready to apply for {card.creditCardName}?
                </h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Apply directly through {card.issuer}&apos;s secure application portal.
                </p>
                <a
                    href={card.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white py-4 px-10 rounded-lg font-semibold transition-colors text-lg"
                >
                    Apply Now
                </a>
            </section>

            {/* Related Cards */}
            {relatedCards.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                    <Suspense fallback={<div>Loading related cards...</div>}>
                        <CardGrid cards={relatedCards} />
                    </Suspense>
                </section>
            )}

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: card.creditCardName,
                        brand: {
                            '@type': 'Brand',
                            name: card.issuer,
                        },
                        category: 'Credit Card',
                        offers: {
                            '@type': 'Offer',
                            price: card.annualFee.toString(),
                            priceCurrency: 'CAD',
                        },
                    }),
                }}
            />
        </div>
    );
}
