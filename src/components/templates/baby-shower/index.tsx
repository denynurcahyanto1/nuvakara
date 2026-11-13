import React from 'react';
import { TemplateComponentProps } from '../registry';
import { Countdown } from '../shared/Countdown';
import { Gallery } from '../shared/Gallery';
import { MapEmbed } from '../shared/MapEmbed';
import { MusicPlayer } from '../shared/MusicPlayer';
import { formatEventDate } from '@/lib/datetime';

export const BabyShower: React.FC<TemplateComponentProps> = ({ data }) => {
  const title = (data.title as string) || 'A Sweet Baby is on the Way!';
  const date = (data.date as string) || '2026-12-31T14:00:00';
  const description = (data.description as string) || 'Join us to celebrate the upcoming arrival of our little bundle of joy.';
  const venue = (data.venue as string) || 'Sweet Garden Cafe';
  const address = (data.address as string) || '';
  const city = (data.city as string) || '';
  const mapUrl = (data.mapUrl as string) || 'https://maps.google.com';
  const mapsLink = data.mapsLink as string | undefined;
  const musicUrl = data.musicUrl as string;
  const images = (data.images as string[]) || [];

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-slate-700 font-sans selection:bg-rose-200 selection:text-slate-800">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
        <span className="inline-block px-5 py-2 bg-rose-100 text-rose-700 font-medium rounded-full text-xs tracking-wider uppercase mb-6">
          Baby Shower 🍼
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-slate-800 mb-6 max-w-xl leading-relaxed">
          {title}
        </h1>
        <p className="max-w-md text-base text-slate-500 font-light mb-8">
          {description}
        </p>
        <div className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-emerald-100/60">
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
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {/* Celebration Details */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center space-y-3">
          <h2 className="text-xl md:text-2xl font-normal text-emerald-800">Date & Location</h2>
          <p className="text-lg text-slate-700">
            {formatEventDate(date)}
          </p>
          <p className="text-sm text-slate-500">{venue}</p>
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-normal text-center text-slate-800">Little Moments</h2>
            <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Gallery images={images} />
            </div>
          </section>
        )}

        {/* Location Map */}
        {mapUrl && (
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-normal text-center text-slate-800">How to Get There</h2>
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <MapEmbed url={mapUrl} href={mapsLink} venue={venue} address={address} city={city} />
            </div>
          </section>
        )}

        {/* Music Player */}
        {musicUrl && (
          <section className="flex justify-center pt-4">
            <MusicPlayer url={musicUrl} />
          </section>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-slate-400 tracking-wider">
        Welcoming Little Miracles &bull; Nuvakara Baby Shower
      </footer>
    </div>
  );
};
