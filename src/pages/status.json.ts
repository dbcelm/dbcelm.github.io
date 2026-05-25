import type { APIRoute } from 'astro';
import { getStatusJson } from '../data/ops-endpoints';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(getStatusJson(), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-SRE-Mandate': 'satisfied',
      'X-Readiness-Probe': 'hire-me',
    },
  });
