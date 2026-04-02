import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const { data: worker, error } = await locals.supabase
		.from('workers')
		.select('*, ranches(name, id)')
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId)
		.single();

	if (error || !worker) {
		return json({ message: 'Trabajador no encontrado' }, { status: 404 });
	}

	// Optionally load recent attendances
	const limit = parseInt(url.searchParams.get('attendance_limit') || '10');
	const { data: attendances } = await locals.supabase
		.from('attendances')
		.select('*')
		.eq('worker_id', params.id)
		.order('date', { ascending: false })
		.limit(limit);

	return json({ worker, attendances: attendances || [] });
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const body = await request.json();

	// Only allow updating safe fields
	const allowed = ['full_name', 'phone', 'ranch_id', 'employee_number', 'status'];
	const updates: Record<string, unknown> = {};
	for (const key of allowed) {
		if (key in body) updates[key] = body[key];
	}

	const { data, error } = await locals.supabase
		.from('workers')
		.update(updates)
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId)
		.select('*, ranches(name)')
		.single();

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ worker: data });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const { error } = await locals.supabase
		.from('workers')
		.update({ status: 'inactive' })
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId);

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ message: 'Trabajador desactivado' });
};
