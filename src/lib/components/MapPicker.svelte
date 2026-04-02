<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	export let lat = 20.67;
	export let lng = -103.35;
	export let radius = 500;
	export let height = '400px';
	export let interactive = true;

	const dispatch = createEventDispatcher();

	let mapContainer: HTMLDivElement;
	let map: any;
	let marker: any;
	let circle: any;
	let L: any;
	let loaded = false;

	function loadLeaflet(): Promise<void> {
		return new Promise((resolve) => {
			if ((window as any).L) {
				L = (window as any).L;
				resolve();
				return;
			}

			// Load CSS
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);

			// Load JS
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
			script.onload = () => {
				L = (window as any).L;
				resolve();
			};
			document.head.appendChild(script);
		});
	}

	function initMap() {
		const hasCoords = lat && lng && lat !== 0 && lng !== 0;
		const center = hasCoords ? [lat, lng] : [20.67, -103.35];
		const zoom = hasCoords ? 15 : 5;

		map = L.map(mapContainer, {
			zoomControl: true,
			attributionControl: false
		}).setView(center, zoom);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19
		}).addTo(map);

		// Attribution in corner
		L.control.attribution({ prefix: false, position: 'bottomright' })
			.addAttribution('OpenStreetMap')
			.addTo(map);

		if (hasCoords) {
			addMarkerAndCircle(lat, lng);
		}

		if (interactive) {
			map.on('click', (e: any) => {
				const { lat: newLat, lng: newLng } = e.latlng;
				updateLocation(newLat, newLng);
			});
		}
	}

	function addMarkerAndCircle(newLat: number, newLng: number) {
		if (marker) {
			marker.setLatLng([newLat, newLng]);
			circle.setLatLng([newLat, newLng]);
		} else {
			const markerIcon = L.divIcon({
				className: 'custom-marker',
				html: `<div style="width:32px;height:32px;background:linear-gradient(135deg,#0D3FFF,#2B5FFF);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
				</div>`,
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			});

			marker = L.marker([newLat, newLng], {
				icon: markerIcon,
				draggable: interactive
			}).addTo(map);

			if (interactive) {
				marker.on('dragend', () => {
					const pos = marker.getLatLng();
					updateLocation(pos.lat, pos.lng, false);
				});
			}

			circle = L.circle([newLat, newLng], {
				radius: radius,
				color: '#0D3FFF',
				fillColor: '#0D3FFF',
				fillOpacity: 0.1,
				weight: 2,
				dashArray: '6 4'
			}).addTo(map);
		}
	}

	function updateLocation(newLat: number, newLng: number, pan = true) {
		lat = parseFloat(newLat.toFixed(8));
		lng = parseFloat(newLng.toFixed(8));

		addMarkerAndCircle(lat, lng);

		if (pan && map) {
			map.setView([lat, lng], Math.max(map.getZoom(), 14));
		}

		dispatch('locationChange', { lat, lng });
	}

	// React to external lat/lng changes
	$: if (loaded && map && lat && lng && lat !== 0 && lng !== 0) {
		addMarkerAndCircle(lat, lng);
		map.setView([lat, lng], Math.max(map.getZoom(), 14));
	}

	// React to radius changes
	$: if (loaded && circle) {
		circle.setRadius(radius);
	}

	onMount(async () => {
		await loadLeaflet();
		initMap();
		loaded = true;
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="rounded-xl overflow-hidden border border-surface-200 shadow-inner-soft" style="height:{height}">
	<div bind:this={mapContainer} class="w-full h-full" />
</div>

{#if interactive}
	<p class="text-xs text-surface-400 mt-2 flex items-center gap-1.5">
		<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
		Haz clic en el mapa o arrastra el marcador para definir la ubicacion.
	</p>
{/if}
