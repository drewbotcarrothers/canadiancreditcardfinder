'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '@/lib/types';

interface FilterPanelProps {
    categories: string[];
    issuers: string[];
    rewardsPrograms: string[];
}

const FEE_RANGES = [
    { label: '$0', value: '0' },
    { label: '$1-$99', value: '1-99' },
    { label: '$100-$199', value: '100-199' },
    { label: '$200+', value: '200+' },
];

export default function FilterPanel({ categories, issuers, rewardsPrograms }: FilterPanelProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getFilterValues = (key: string): string[] => {
        return searchParams.get(key)?.split(',').filter(Boolean) || [];
    };

    const selectedCategories = getFilterValues('category');
    const selectedIssuers = getFilterValues('issuer');
    const selectedFeeRanges = getFilterValues('fee');
    const selectedRewardsPrograms = getFilterValues('rewards');

    const updateFilters = (key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (values.length > 0) {
            params.set(key, values.join(','));
        } else {
            params.delete(key);
        }
        router.push(`/?${params.toString()}`);
    };

    const toggleFilter = (key: string, value: string, currentValues: string[]) => {
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        updateFilters(key, newValues);
    };

    const clearAllFilters = () => {
        router.push('/');
    };

    const hasActiveFilters = selectedCategories.length > 0 ||
        selectedIssuers.length > 0 ||
        selectedFeeRanges.length > 0 ||
        selectedRewardsPrograms.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map(category => (
                        <label key={category} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleFilter('category', category, selectedCategories)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Issuer Filter */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Issuer</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {issuers.map(issuer => (
                        <label key={issuer} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedIssuers.includes(issuer)}
                                onChange={() => toggleFilter('issuer', issuer, selectedIssuers)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
                                {issuer}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Annual Fee Filter */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Annual Fee</h3>
                <div className="flex flex-wrap gap-2">
                    {FEE_RANGES.map(range => (
                        <button
                            key={range.value}
                            onClick={() => toggleFilter('fee', range.value, selectedFeeRanges)}
                            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedFeeRanges.includes(range.value)
                                    ? 'bg-red-600 border-red-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rewards Program Filter */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Rewards Program</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {rewardsPrograms.map(program => (
                        <label key={program} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedRewardsPrograms.includes(program)}
                                onChange={() => toggleFilter('rewards', program, selectedRewardsPrograms)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
                                {program}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
