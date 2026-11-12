import React from 'react';

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

export const registry: Record<string, TemplateMetadata> = {};

export const getRenderer = (slug: string): TemplateRenderer => {
  return registry[slug]?.renderer || FallbackRenderer;
};
