import React from 'react';
import { TemplateComponentProps } from '../registry';
import { Countdown } from '../shared/Countdown';
import { Gallery } from '../shared/Gallery';
import { MapEmbed } from '../shared/MapEmbed';
import { MusicPlayer } from '../shared/MusicPlayer';
import { formatEventDate } from '@/lib/datetime';

export const GraduationModern: React.FC<TemplateComponentProps> = ({ data }) => {
  const title = (data.title as string) || 'Graduation Commencement 2026';
  const date = (data.date as string) || '2026-12-31T09:00:00';
  const description = (data.description as string) || 'Honoring the achievement, resilience, and success of the Class of 2026.';
  const venue = (data.venue as string) || 'Auditorium Magna, University Hall';
  const address = (data.address as string) || '';
  const city = (data.city as string) || '';
  const mapUrl = (data.mapUrl as string) || 'https://maps.google.com';
  const mapsLink = data.mapsLink as string | undefined;
  const musicUrl = data.musicUrl as string;
  const images = (data.images as string[]) || [];

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F3F4F6] font-sans selection:bg-[#E5A93C] selection:text-black">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center border-b border-neutral-800">
        <span className="text-xs uppercase tracking-[0.4em] text-[#E5A93C] font-semibold mb-6">
          Commencement Ceremony
        </span>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-3xl leading-none">
          {title}
        </h1>
        <p className="max-w-xl text-base md:text-lg text-neutral-400 font-light mb-10 leading-relaxed">
          {description}
        </p>
        <div className="p-6 bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-800 shadow-2xl">
          <Countdown
            targetDate={date}
            initialSeconds={Math.max(
              0,
              Math.floor((new Date(date).getTime() - Date.now()) / 1000),
            )}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Event Details */}
        <section className="border border-neutral-800 bg-neutral-900/40 p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-sm font-semibold tracking-widest text-[#E5A93C] uppercase">Schedule & Venue</h2>
          <p className="text-2xl font-bold text-white">
            {formatEventDate(date)}
          </p>
          <p className="text-neutral-400 text-base">{venue}</p>
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-sm font-semibold tracking-widest text-[#E5A93C] uppercase text-center">Class Highlights</h2>
            <div className="p-4 bg-neutral-900/40 rounded-2xl border border-neutral-800">
              <Gallery images={images} />
            </div>
          </section>
        )}

        {/* Location Map */}
        {mapUrl && (
          <section className="space-y-6">
            <h2 className="text-sm font-semibold tracking-widest text-[#E5A93C] uppercase text-center">Location & Access</h2>
            <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
              <MapEmbed url={mapUrl} href={mapsLink} venue={venue} address={address} city={city} />
            </div>
          </section>
        )}

        {/* Music Player */}
        {musicUrl && (
          <section className="flex justify-center pt-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2">
              <MusicPlayer url={musicUrl} />
            </div>
          </section>
        )}
      </main>

      <footer className="text-center py-10 text-xs text-neutral-600 tracking-widest uppercase border-t border-neutral-900">
        Class of 2026 &bull; Nuvakara Modern Editorial
      </footer>
    </div>
  );
};
