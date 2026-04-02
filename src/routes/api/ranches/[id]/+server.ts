import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const { data, error } = await locals.supabase
		.from('ranches')
		.select('*')
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId)
		.single();

	if (error || !data) {
		return json({ message: 'Rancho no encontrado' }, { status: 404 });
	}

	return json({ ranch: data });
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const body = await request.json();

	const { data, error } = await locals.supabase
		.from('ranches')
		.update(body)
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId)
		.select()
		.single();

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ ranch: data });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const { error } = await locals.supabase
		.from('ranches')
		.update({ active: false })
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId);

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ message: 'Rancho desactivado' });
};
