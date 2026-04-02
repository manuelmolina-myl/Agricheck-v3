import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		return json({ message: 'Server not configured. Set Supabase environment variables.' }, { status: 503 });
	}

	const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ message: 'Correo y contraseña son requeridos.' }, { status: 400 });
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		return json({ message: 'Credenciales inválidas.' }, { status: 401 });
	}

	if (data.session) {
		cookies.set('sb-access-token', data.session.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		cookies.set('sb-refresh-token', data.session.refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
	}

	return json({
		message: 'Login exitoso.',
		user: { id: data.user.id, email: data.user.email }
	});
};
