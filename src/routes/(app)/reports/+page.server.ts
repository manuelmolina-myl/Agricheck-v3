import type { PageServerLoad } from './$types';

const EMPTY = { attendances: [], workers: [], ranches: [], dateRange: { from: '', to: '' }, workerSummary: [], dailySummary: [], ranchFilter: '', workerFilter: '', tab: 'general' };

export const load: PageServerLoad = async ({ locals, url }) => {
	try {
		if (!locals?.supabase || !locals?.tenantId) {
			return EMPTY;
		}

		const tenantId = locals.tenantId;
		const now = new Date();
		const defaultFrom = url.searchParams.get('from') || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
		const defaultTo = url.searchParams.get('to') || now.toISOString().split('T')[0];
		const ranchFilter = url.searchParams.get('ranch') || '';
		const workerFilter = url.searchParams.get('worker') || '';
		const tab = url.searchParams.get('tab') || 'general';

		let query = locals.supabase
			.from('attendances')
			.select('*, workers(full_name, phone), ranches(name)')
			.eq('tenant_id', tenantId)
			.gte('date', defaultFrom)
			.lte('date', defaultTo)
			.order('date', { ascending: false });

		if (ranchFilter) query = query.eq('ranch_id', ranchFilter);
		if (workerFilter) query = query.eq('worker_id', workerFilter);

		const [attendancesResult, workersResult, ranchesResult] = await Promise.all([
			query,
			locals.supabase
				.from('workers')
				.select('id, full_name')
				.eq('tenant_id', tenantId)
				.eq('status', 'active')
				.order('full_name'),
			locals.supabase
				.from('ranches')
				.select('id, name')
				.eq('tenant_id', tenantId)
				.eq('active', true)
				.order('name')
		]);

		const attendances = attendancesResult.data || [];

		// Per-worker summary
		const workerMap = new Map<string, { name: string; days: number; hours: number; verified: number; total: number }>();
		for (const att of attendances) {
			const wid = att.worker_id;
			const wname = (att as any).workers?.full_name || 'Desconocido';
			if (!workerMap.has(wid)) {
				workerMap.set(wid, { name: wname, days: 0, hours: 0, verified: 0, total: 0 });
			}
			const entry = workerMap.get(wid)!;
			entry.days++;
			entry.hours += att.total_hours || 0;
			if (att.entry_verified) entry.verified++;
			entry.total++;
		}
		const workerSummary = Array.from(workerMap.entries())
			.map(([id, s]) => ({ id, ...s, avgHours: s.days > 0 ? (s.hours / s.days).toFixed(1) : '0' }))
			.sort((a, b) => b.days - a.days);

		// Daily summary
		const dayMap = new Map<string, { date: string; count: number; hours: number }>();
		for (const att of attendances) {
			if (!dayMap.has(att.date)) {
				dayMap.set(att.date, { date: att.date, count: 0, hours: 0 });
			}
			const entry = dayMap.get(att.date)!;
			entry.count++;
			entry.hours += att.total_hours || 0;
		}
		const dailySummary = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

		return {
			attendances,
			workers: workersResult.data || [],
			ranches: ranchesResult.data || [],
			dateRange: { from: defaultFrom, to: defaultTo },
			ranchFilter,
			workerFilter,
			workerSummary,
			dailySummary,
			tab
		};
	} catch {
		return EMPTY;
	}
};
