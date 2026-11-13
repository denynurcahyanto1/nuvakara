import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Countdown } from '@/components/templates/shared/Countdown';

const TARGET = '2026-12-12T03:00:00Z';
// 1 day, 1 hour, 2 minutes and 5 seconds.
const REMAINING = 86_400 + 3_600 + 120 + 5;

describe('Countdown', () => {
  afterEach(() => vi.useRealTimers());

  test('server render uses initialSeconds instead of showing zeros', () => {
    const html = renderToString(
      <Countdown targetDate={TARGET} initialSeconds={REMAINING} />,
    );

    expect(html).toContain('Hari');
    expect(html).toContain('Menit');
    expect(html).toContain('02');
    expect(html).toContain('05');
  });

  test('ticks with real time after mount and uses Indonesian labels', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-11T01:57:55Z'));

    render(<Countdown targetDate={TARGET} />);

    expect(screen.getByText('Hari')).toBeDefined();
    expect(screen.getByText('Jam')).toBeDefined();
    expect(screen.getByText('Menit')).toBeDefined();
    expect(screen.getByText('Detik')).toBeDefined();
    expect(screen.getByText('02')).toBeDefined();
    expect(screen.getByText('05')).toBeDefined();
  });

  test('never shows negative time for a past event', () => {
    render(<Countdown targetDate="2020-01-01T00:00:00Z" initialSeconds={-500} />);
    expect(screen.getAllByText('00')).toHaveLength(4);
  });
});
