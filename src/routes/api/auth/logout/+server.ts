import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('sb-access-token', { path: '/' });
	cookies.delete('sb-refresh-token', { path: '/' });
	return json({ message: 'Logged out' });
};

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('sb-access-token', { path: '/' });
	cookies.delete('sb-refresh-token', { path: '/' });
	throw redirect(303, '/login');
};
