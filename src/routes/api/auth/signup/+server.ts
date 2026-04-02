import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: RequestHandler = async ({ request }) => {
	if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
		return json({ message: 'Server not configured. Set Supabase environment variables.' }, { status: 503 });
	}

	const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	const { companyName, slug, ownerName, email, phone, password } = await request.json();

	if (!companyName || !ownerName || !email || !password) {
		return json({ message: 'Todos los campos son requeridos.' }, { status: 400 });
	}

	if (password.length < 8) {
		return json({ message: 'La contraseña debe tener al menos 8 caracteres.' }, { status: 400 });
	}

	// 1. Create auth user
	const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
		email,
		password,
		email_confirm: true
	});

	if (authError) {
		if (authError.message.includes('already')) {
			return json({ message: 'Ya existe una cuenta con este correo.' }, { status: 409 });
		}
		return json({ message: authError.message }, { status: 400 });
	}

	const userId = authData.user.id;

	// 2. Create tenant
	const { data: tenant, error: tenantError } = await supabaseAdmin
		.from('tenants')
		.insert({
			company_name: companyName,
			slug: slug || companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			owner_name: ownerName,
			owner_email: email,
			owner_phone: phone || null
		})
		.select('id')
		.single();

	if (tenantError) {
		// Cleanup: delete auth user
		await supabaseAdmin.auth.admin.deleteUser(userId);

		if (tenantError.message.includes('duplicate')) {
			return json({ message: 'Ya existe una empresa con este nombre o correo.' }, { status: 409 });
		}
		return json({ message: 'Error al crear la empresa.' }, { status: 500 });
	}

	// 3. Create tenant_user linking auth user to tenant
	const { error: tuError } = await supabaseAdmin
		.from('tenant_users')
		.insert({
			tenant_id: tenant.id,
			email,
			full_name: ownerName,
			role: 'owner',
			auth_user_id: userId
		});

	if (tuError) {
		await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
		await supabaseAdmin.auth.admin.deleteUser(userId);
		return json({ message: 'Error al crear el usuario.' }, { status: 500 });
	}

	// 4. Sign in to get session tokens
	const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
		email,
		password
	});

	if (signInError || !signInData.session) {
		return json({
			message: 'Cuenta creada. Por favor inicia sesión.',
			redirect: '/login'
		});
	}

	return json({
		message: 'Cuenta creada exitosamente.',
		session: {
			access_token: signInData.session.access_token,
			refresh_token: signInData.session.refresh_token
		},
		tenantId: tenant.id
	});
};
