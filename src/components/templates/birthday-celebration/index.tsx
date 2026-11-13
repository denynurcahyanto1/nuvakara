import React from 'react';
import { TemplateComponentProps } from '../registry';
import { Countdown } from '../shared/Countdown';
import { Gallery } from '../shared/Gallery';
import { MapEmbed } from '../shared/MapEmbed';
import { MusicPlayer } from '../shared/MusicPlayer';
import { formatEventDate } from '@/lib/datetime';

export const BirthdayCelebration: React.FC<TemplateComponentProps> = ({ data }) => {
  const title = (data.title as string) || "Let's Celebrate!";
  const date = (data.date as string) || '2026-12-31T18:00:00';
  const description = (data.description as string) || "You're invited to my birthday bash! Come join the fun!";
  const venue = (data.venue as string) || 'Fun World Center';
  const address = (data.address as string) || '';
  const city = (data.city as string) || '';
  const mapUrl = (data.mapUrl as string) || 'https://maps.google.com';
  const musicUrl = data.musicUrl as string;
  const images = (data.images as string[]) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-purple-50 to-pink-50 text-purple-950 font-sans selection:bg-pink-400 selection:text-white">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
        <span className="inline-block px-4 py-1.5 bg-yellow-300 text-yellow-900 font-bold rounded-full text-sm uppercase tracking-wider transform -rotate-2 mb-6 shadow-sm">
          Birthday Bash 🎉
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 mb-6 max-w-xl">
          {title}
        </h1>
        <p className="max-w-md text-base md:text-lg text-purple-800 font-medium mb-8">
          {description}
        </p>
        <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-purple-200">
          <Countdown targetDate={date} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {/* Party Details */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-pink-600">When & Where</h2>
          <p className="text-lg font-semibold text-purple-900">
            {formatEventDate(date)}
          </p>
          <p className="text-base text-gray-600">{venue}</p>
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-purple-900">Sweet Memories</h2>
            <div className="p-4 bg-white/60 rounded-3xl border border-purple-100">
              <Gallery images={images} />
            </div>
          </section>
        )}

        {/* Location Map */}
        {mapUrl && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-purple-900">Party Location</h2>
            <div className="rounded-3xl overflow-hidden border-2 border-purple-200 shadow-md">
              <MapEmbed url={mapUrl} venue={venue} address={address} city={city} />
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

      <footer className="text-center py-8 text-sm font-medium text-purple-400">
        Made with joy &bull; Nuvakara Birthday
      </footer>
    </div>
  );
};
