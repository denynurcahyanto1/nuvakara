import React from 'react';
import { TemplateComponentProps } from '../registry';
import { Countdown } from '../shared/Countdown';
import { Gallery } from '../shared/Gallery';
import { MapEmbed } from '../shared/MapEmbed';
import { MusicPlayer } from '../shared/MusicPlayer';
import { formatEventDate, secondsUntil } from '@/lib/datetime';

export const WeddingClassic: React.FC<TemplateComponentProps> = ({ data }) => {
  const title = (data.title as string) || 'The Wedding of Romeo & Juliet';
  const date = (data.date as string) || '2026-12-31T18:00:00';
  const description = (data.description as string) || 'Together with their families, invite you to celebrate their wedding';
  const venue = (data.venue as string) || 'Grand Ballroom, Jakarta';
  const address = (data.address as string) || '';
  const city = (data.city as string) || '';
  const mapUrl = (data.mapUrl as string) || 'https://maps.google.com';
  const mapsLink = data.mapsLink as string | undefined;
  const musicUrl = data.musicUrl as string;
  const images = (data.images as string[]) || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2B49] font-serif selection:bg-[#D4AF37] selection:text-white">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center border-b border-[#D4AF37]/30">
        <span className="text-sm tracking-[0.3em] uppercase text-[#D4AF37] mb-4">Wedding Invitation</span>
        <h1 className="text-4xl md:text-6xl font-normal tracking-wide text-[#1A2B49] mb-6 max-w-2xl leading-tight">
          {title}
        </h1>
        <p className="max-w-md text-base md:text-lg text-gray-600 italic mb-8">
          {description}
        </p>
        <div className="p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 shadow-sm">
          <Countdown
            targetDate={date}
            initialSeconds={secondsUntil(date)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* Event Details */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-normal text-[#D4AF37] tracking-wider uppercase">Event Details</h2>
          <p className="text-lg text-gray-700">{formatEventDate(date)}</p>
          <p className="text-base text-gray-600 font-sans">{venue}</p>
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-normal text-center text-[#D4AF37] tracking-wider uppercase">Our Moments</h2>
            <Gallery images={images} />
          </section>
        )}

        {/* Location Map */}
        {mapUrl && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-normal text-center text-[#D4AF37] tracking-wider uppercase">Location</h2>
            <div className="rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-md">
              <MapEmbed url={mapUrl} href={mapsLink} venue={venue} address={address} city={city} />
            </div>
          </section>
        )}

        {/* Music Player */}
        {musicUrl && (
          <section className="flex justify-center pt-8">
            <MusicPlayer url={musicUrl} />
          </section>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-gray-400 tracking-widest uppercase border-t border-[#D4AF37]/20">
        Nuvakara Classic Wedding
      </footer>
    </div>
  );
};
