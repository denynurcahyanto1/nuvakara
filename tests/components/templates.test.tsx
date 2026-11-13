import { render, screen } from '@testing-library/react';
import { test, describe, expect } from 'vitest';
import { WeddingClassic } from '../../src/components/templates/wedding-classic';
import { BirthdayCelebration } from '../../src/components/templates/birthday-celebration';
import { BabyShower } from '../../src/components/templates/baby-shower';
import { GraduationModern } from '../../src/components/templates/graduation-modern';

describe('Templates', () => {
  const mockData = {
    title: 'Custom Event Title',
    date: '2026-12-31T18:00:00',
    description: 'Custom celebration description',
    venue: 'Custom Location Hall',
    address: 'Jl. Contoh No. 1',
    city: 'Jakarta',
    mapUrl: 'https://maps.google.com/test',
    musicUrl: 'https://example.com/audio.mp3',
    images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  };

  test('WeddingClassic renders mock event data and components', () => {
    render(<WeddingClassic data={mockData} />);
    expect(screen.getByText('Custom Event Title')).toBeDefined();
    expect(screen.getByText('Custom celebration description')).toBeDefined();
    expect(screen.getAllByText('Custom Location Hall').length).toBeGreaterThan(0);
    expect(screen.getByText('Wedding Invitation')).toBeDefined();
    expect(screen.getByTitle(/Peta lokasi/)).toBeDefined();
  });

  test('BirthdayCelebration renders mock event data and components', () => {
    render(<BirthdayCelebration data={mockData} />);
    expect(screen.getByText('Custom Event Title')).toBeDefined();
    expect(screen.getByText('Custom celebration description')).toBeDefined();
    expect(screen.getAllByText('Custom Location Hall').length).toBeGreaterThan(0);
    expect(screen.getByText('Birthday Bash 🎉')).toBeDefined();
    expect(screen.getByTitle(/Peta lokasi/)).toBeDefined();
  });

  test('BabyShower renders mock event data and components', () => {
    render(<BabyShower data={mockData} />);
    expect(screen.getByText('Custom Event Title')).toBeDefined();
    expect(screen.getByText('Custom celebration description')).toBeDefined();
    expect(screen.getAllByText('Custom Location Hall').length).toBeGreaterThan(0);
    expect(screen.getByText('Baby Shower 🍼')).toBeDefined();
    expect(screen.getByTitle(/Peta lokasi/)).toBeDefined();
  });

  test('GraduationModern renders mock event data and components', () => {
    render(<GraduationModern data={mockData} />);
    expect(screen.getByText('Custom Event Title')).toBeDefined();
    expect(screen.getByText('Custom celebration description')).toBeDefined();
    expect(screen.getAllByText('Custom Location Hall').length).toBeGreaterThan(0);
    expect(screen.getByText('Commencement Ceremony')).toBeDefined();
    expect(screen.getByTitle(/Peta lokasi/)).toBeDefined();
  });
});
