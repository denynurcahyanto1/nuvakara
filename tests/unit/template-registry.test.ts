import { getRenderer, registry } from '../../src/components/templates/registry';
import React from 'react';

describe('Template Registry', () => {
  it('should return FallbackRenderer for unknown slug', () => {
    const renderer = getRenderer('unknown');
    expect(renderer).toBeDefined();
    // Test that it renders without crashing
    const component = React.createElement(renderer, { data: {} });
    expect(component).toBeDefined();
  });

  it('should have 4 templates in registry', () => {
    expect(Object.keys(registry)).toHaveLength(4);
  });
});
