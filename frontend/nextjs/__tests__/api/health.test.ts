/**
 * @jest-environment node
 */
import { GET } from '../../app/api/health/route';

describe('/api/health', () => {
  it('should return health status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
    expect(data.system).toBeDefined();
    expect(data.components).toBeDefined();
  });

  it('should include service information', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.supabase).toBeDefined();
    expect(data.vercel).toBeDefined();
    expect(data.environment).toBeDefined();
  });
});

