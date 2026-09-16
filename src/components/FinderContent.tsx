import { useMemo, useState } from 'react';
import { HUBS, type HubSlug } from '../lib/hubs';
import {
    applyFinderAnswer,
    FINDER_QUESTIONS,
    getNextQuestionId,
    getQuestionPath,
    isFinderComplete,
    recommendCards,
    retractLastFinderAnswer,
    summarizeAnswers,
    type FinderAnswers,
    type FinderQuestionId,
} from '../lib/finder';
import type { CreditCard } from '../lib/types';
import CardItem from './CardItem';
import FinderBestMatch from './FinderBestMatch';

interface FinderContentProps {
    cards: CreditCard[];
}

export default function FinderContent({ cards }: FinderContentProps) {
    const [answers, setAnswers] = useState<FinderAnswers>({});

    const nextQuestionId = getNextQuestionId(answers);
    const complete = isFinderComplete(answers);
    const path = getQuestionPath(answers);
    const answeredCount = path.filter((id) => answers[id] != null).length;
    const totalSteps = answers.goal ? path.length : 5;
    const currentStep = complete ? totalSteps : Math.min(answeredCount + 1, totalSteps);
    const progressPercent = complete ? 100 : Math.round((answeredCount / totalSteps) * 100);

    const question = nextQuestionId ? FINDER_QUESTIONS[nextQuestionId] : null;
    const canGoBack = answeredCount > 0 || complete;

    const recommendation = useMemo(
        () => (complete ? recommendCards(cards, answers) : null),
        [complete, cards, answers],
    );

    const recap = complete ? summarizeAnswers(answers) : [];

    const handleChoice = (questionId: FinderQuestionId, value: string) => {
        setAnswers((current) => applyFinderAnswer(current, questionId, value));
    };

    const handleBack = () => {
        setAnswers((current) => retractLastFinderAnswer(current));
    };

    const handleRestart = () => {
        setAnswers({});
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm font-medium text-gray-600">
                        {complete ? 'Your matches' : `Step ${currentStep} of ${totalSteps}`}
                    </p>
                    {canGoBack && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                        >
                            Back
                        </button>
                    )}
                </div>
                <div
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressPercent}
                    aria-label="Finder progress"
                >
                    <div
                        className="h-full bg-red-600 rounded-full transition-all duration-200"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {!complete && question && (
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8" aria-live="polite">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {question.title}
                    </h2>
                    {question.subtitle && (
                        <p className="text-gray-600 mb-6 leading-relaxed">{question.subtitle}</p>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {question.choices.map((choice) => (
                            <button
                                key={choice.value}
                                type="button"
                                onClick={() => handleChoice(question.id, choice.value)}
                                className="w-full text-left rounded-xl border-2 border-gray-200 bg-white px-4 py-4 min-h-16 hover:border-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                                <span className="block font-semibold text-gray-900 text-lg">
                                    {choice.label}
                                </span>
                                <span className="block text-sm text-gray-600 mt-1 leading-snug">
                                    {choice.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {complete && recommendation && (
                <ResultsPanel
                    recommendation={recommendation}
                    recap={recap}
                    choseAmex={answers.issuer === 'amex'}
                    onRestart={handleRestart}
                />
            )}

            <p className="mt-8 text-xs text-gray-500 leading-relaxed">
                This quiz is not financial advice and does not guarantee approval. Eligibility depends on
                the issuer. Fees, rewards, and offers can change — confirm details on the card review page
                and with the issuer before you apply.
            </p>
        </div>
    );
}

function ResultsPanel({
    recommendation,
    recap,
    choseAmex,
    onRestart,
}: {
    recommendation: ReturnType<typeof recommendCards>;
    recap: { label: string; value: string }[];
    choseAmex: boolean;
    onRestart: () => void;
}) {
    const { best, alternatives, relaxed, fallbackHubs } = recommendation;
    const compareSlugs = [best, ...alternatives]
        .filter((item): item is NonNullable<typeof item> => item != null)
        .slice(0, 3)
        .map((item) => item.card.slug);
    const compareHref = compareSlugs.length > 1 ? `/compare/?cards=${compareSlugs.join(',')}` : '/compare/';

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {best ? 'Cards that fit your answers' : 'No close match in this round'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {best
                            ? 'One top match plus a few alternatives from our current Canadian card data. Offers are not guaranteed.'
                            : 'We could not find a card that fits those answers. Browse a related list below, or start over with different choices.'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRestart}
                    className="shrink-0 border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 font-semibold py-2.5 px-5 rounded-lg transition-colors"
                >
                    Restart
                </button>
            </div>

            {recap.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-6">
                    {recap.map((item) => (
                        <li
                            key={item.label}
                            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                        >
                            <span className="font-medium">{item.value}</span>
                        </li>
                    ))}
                </ul>
            )}

            {relaxed.map((note) => (
                <p
                    key={note}
                    className="mb-4 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
                >
                    {note}
                </p>
            ))}

            {choseAmex && best && (
                <p className="mb-6 text-sm text-gray-700 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                    American Express is accepted at fewer merchants than Visa or Mastercard. Confirm the
                    places you shop most often take Amex before you apply.
                </p>
            )}

            {best && (
                <div className="mb-10">
                    <FinderBestMatch card={best.card} reason={best.reason} />
                </div>
            )}

            {alternatives.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Also consider</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {alternatives.map((item) => (
                            <CardItem
                                key={item.card.id}
                                card={item.card}
                                reason={item.reason}
                                showApply
                            />
                        ))}
                    </div>
                </div>
            )}

            {best && compareSlugs.length > 1 && (
                <div className="mb-10 text-center">
                    <a
                        href={compareHref}
                        className="inline-block bg-gray-900 hover:bg-gray-800 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
                    >
                        Compare these cards
                    </a>
                </div>
            )}

            <RelatedHubs hubs={fallbackHubs} />
        </section>
    );
}

function RelatedHubs({ hubs }: { hubs: HubSlug[] }) {
    const related = HUBS.filter((hub) => hubs.includes(hub.slug));
    if (related.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related lists</h3>
            <div className="flex flex-wrap gap-2">
                {related.map((hub) => (
                    <a
                        key={hub.slug}
                        href={`/best/${hub.slug}/`}
                        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors"
                    >
                        {hub.navLabel}
                    </a>
                ))}
                <a
                    href="/"
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors"
                >
                    All cards
                </a>
            </div>
        </div>
    );
}
