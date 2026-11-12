import React from 'react';
import { WeddingClassic } from './wedding-classic';
import { BirthdayCelebration } from './birthday-celebration';
import { BabyShower } from './baby-shower';
import { GraduationModern } from './graduation-modern';

export interface TemplateComponentProps {
  data: Record<string, unknown>;
}

export type TemplateRenderer = React.FC<TemplateComponentProps>;

export interface TemplateMetadata {
  slug: string;
  name: string;
  renderer: TemplateRenderer;
}

const FallbackRenderer: TemplateRenderer = () => {
  return React.createElement('div', null, 'Template not found');
};

export const registry: Record<string, TemplateMetadata> = {
  'wedding-classic': { slug: 'wedding-classic', name: 'Wedding Classic', renderer: WeddingClassic },
  'birthday-celebration': { slug: 'birthday-celebration', name: 'Birthday Celebration', renderer: BirthdayCelebration },
  'baby-shower': { slug: 'baby-shower', name: 'Baby Shower', renderer: BabyShower },
  'graduation-modern': { slug: 'graduation-modern', name: 'Graduation Modern', renderer: GraduationModern },
};

export const getRenderer = (slug: string): TemplateRenderer => {
  return registry[slug]?.renderer || FallbackRenderer;
};

export const TemplateDispatcher: React.FC<{ slug: string; data: Record<string, unknown> }> = ({ slug, data }) => {
  const Renderer = getRenderer(slug);
  return React.createElement(Renderer, { data });
};
