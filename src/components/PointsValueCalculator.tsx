import { useMemo, useState } from 'react';
import { POINT_PROGRAMS, formatCentsPerPoint, pointsValueCad } from '../lib/pointValues';

function formatCad(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export default function PointsValueCalculator() {
    const [programId, setProgramId] = useState(POINT_PROGRAMS[0].id);
    const [balance, setBalance] = useState('');

    const program = POINT_PROGRAMS.find((item) => item.id === programId) ?? POINT_PROGRAMS[0];

    const result = useMemo(() => {
        const trimmed = balance.trim();
        if (!trimmed) return { status: 'empty' as const };
        if (!/^\d+$/.test(trimmed)) return { status: 'invalid' as const };
        const points = Number(trimmed);
        if (!Number.isSafeInteger(points)) return { status: 'invalid' as const };
        const dollars = pointsValueCad(points, program.centsPerPoint);
        return { status: 'ok' as const, points, dollars };
    }, [balance, program]);

    return (
        <form
            className="space-y-5"
            onSubmit={(event) => event.preventDefault()}
        >
            <div>
                <label htmlFor="points-program" className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                </label>
                <select
                    id="points-program"
                    value={program.id}
                    onChange={(event) => setProgramId(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
                >
                    {POINT_PROGRAMS.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                    {program.basis} ({formatCentsPerPoint(program.centsPerPoint)} per point)
                </p>
            </div>

            <div>
                <label htmlFor="points-balance" className="block text-sm font-medium text-gray-700 mb-1">
                    Point balance
                </label>
                <input
                    id="points-balance"
                    inputMode="numeric"
                    autoComplete="off"
                    value={balance}
                    placeholder="10000"
                    onChange={(event) => setBalance(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
                />
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-5" aria-live="polite">
                <p className="text-sm font-medium text-gray-500 mb-1">Estimated value</p>
                {result.status === 'empty' && (
                    <p className="text-lg text-gray-700">Enter a point balance to see the estimate.</p>
                )}
                {result.status === 'invalid' && (
                    <p className="text-lg text-gray-700">Enter a whole number of points.</p>
                )}
                {result.status === 'ok' && result.dollars === 0 && result.points > 0 && (
                    <p className="text-lg text-gray-900">
                        Under 1¢ at the published rate ({result.points.toLocaleString('en-CA')}{' '}
                        {program.name} × {formatCentsPerPoint(program.centsPerPoint)}).
                    </p>
                )}
                {result.status === 'ok' && (result.dollars > 0 || result.points === 0) && (
                    <>
                        <p className="text-3xl font-bold text-gray-900">{formatCad(result.dollars)}</p>
                        <p className="mt-2 text-gray-600">
                            {result.points.toLocaleString('en-CA')} {program.name} points ×{' '}
                            {formatCentsPerPoint(program.centsPerPoint)} = {formatCad(result.dollars)}
                        </p>
                    </>
                )}
            </div>
        </form>
    );
}
