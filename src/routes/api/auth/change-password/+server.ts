import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
	const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
		return json({ message: 'Server not configured' }, { status: 503 });
	}

	const { newPassword } = await request.json();

	if (!newPassword || newPassword.length < 8) {
		return json({ message: 'La contrasena debe tener al menos 8 caracteres.' }, { status: 400 });
	}

	const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	const { error } = await supabase.auth.admin.updateUserById(
		locals.session.user.id,
		{ password: newPassword }
	);

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ message: 'Contrasena actualizada.' });
};
