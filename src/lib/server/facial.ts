import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

export async function detectFace(imageBuffer: Buffer) {
	const [result] = await client.faceDetection({
		image: { content: imageBuffer }
	});

	const faces = result.faceAnnotations || [];

	if (faces.length === 0) {
		throw new Error('No face detected');
	}

	if (faces.length > 1) {
		throw new Error('Multiple faces detected');
	}

	const face = faces[0];

	const encoding = {
		boundingPoly: face.boundingPoly,
		landmarks: face.landmarks?.map((l) => ({
			type: l.type,
			position: l.position
		})),
		rollAngle: face.rollAngle,
		panAngle: face.panAngle,
		tiltAngle: face.tiltAngle,
		detectionConfidence: face.detectionConfidence
	};

	return {
		encoding: JSON.stringify(encoding),
		confidence: face.detectionConfidence || 0
	};
}

export async function compareFaces(
	imageBuffer: Buffer,
	storedEncoding: string
): Promise<{ match: boolean; confidence: number }> {
	const newFace = await detectFace(imageBuffer);
	const stored = JSON.parse(storedEncoding);

	const similarity = calculateFaceSimilarity(newFace.encoding, stored);

	return {
		match: similarity > 0.85,
		confidence: similarity * 100
	};
}

function calculateFaceSimilarity(encoding1: string, encoding2: Record<string, unknown>): number {
	const e1 = JSON.parse(encoding1);

	const angleDiff =
		Math.abs(e1.rollAngle - (encoding2.rollAngle as number)) +
		Math.abs(e1.panAngle - (encoding2.panAngle as number)) +
		Math.abs(e1.tiltAngle - (encoding2.tiltAngle as number));

	const angleSimilarity = Math.max(0, 1 - angleDiff / 180);

	return angleSimilarity;
}
