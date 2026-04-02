export async function uploadPhoto(file: File, path: string): Promise<string> {
	const response = await fetch(`${process.env.PUBLIC_R2_ENDPOINT}/${path}`, {
		method: 'PUT',
		headers: {
			'X-Custom-Auth-Key': process.env.R2_AUTH_TOKEN!
		},
		body: file
	});

	if (!response.ok) {
		throw new Error('Upload failed');
	}

	return `${process.env.PUBLIC_R2_PUBLIC_URL}/${path}`;
}
