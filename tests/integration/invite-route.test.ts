import { expect, test, describe, vi } from 'vitest';
import { getEventBySlug, getEventById } from '@/lib/dal/events';
import InvitePage from '@/app/invite/[slug]/page';
import PreviewPage from '@/app/dashboard/invitations/[id]/preview/page';
import { requireUser } from '@/lib/dal/auth';

vi.mock('@/lib/dal/events', () => ({
  getEventBySlug: vi.fn(),
  getEventById: vi.fn(),
  getRSVPs: vi.fn().mockResolvedValue([]),
  getGuestbook: vi.fn().mockResolvedValue([]),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NOT_FOUND'); }),
}));

vi.mock('@/lib/dal/auth', () => ({
  requireUser: vi.fn(),
}));

describe('Invite Route', () => {
  test('Public access works for published events', async () => {
    const mockEvent = {
      id: 1,
      slug: 'my-event',
      is_published: true,
      is_active: true,
      name: 'My Event',
      template_slug: 'wedding-classic',
      template_data: {},
      description: '',
      cover_image: null,
    };
    (getEventBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(mockEvent);

    const result = await InvitePage({ params: Promise.resolve({ slug: 'my-event' }) });
    expect(result).toBeDefined();
  });

  test('Public access fails (404) for draft events', async () => {
    const mockEvent = {
      id: 1,
      slug: 'my-event',
      is_published: false,
      is_active: true,
      name: 'My Event',
      template_slug: 'wedding-classic',
      template_data: {},
      description: '',
      cover_image: null,
    };
    (getEventBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(mockEvent);

    await expect(InvitePage({ params: Promise.resolve({ slug: 'my-event' }) }))
      .rejects.toThrow('NOT_FOUND');
  });
});

describe('Preview Route', () => {
  test('Preview access works for owner', async () => {
    const mockUser = { id: 'user1' };
    const mockEvent = {
      id: 1,
      owner_id: 'user1',
      name: 'My Draft',
      template_slug: 'wedding-classic',
      template_data: {},
      description: '',
      cover_image: null,
      is_published: false,
      is_active: true,
      slug: 'my-draft',
      created_at: null,
      updated_at: null,
    };
    (requireUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);
    (getEventById as ReturnType<typeof vi.fn>).mockResolvedValue(mockEvent);

    const result = await PreviewPage({ params: Promise.resolve({ id: '1' }) });
    expect(result).toBeDefined();
  });
});
