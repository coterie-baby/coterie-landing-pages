const ENDPOINT = 'https://amplitude.com/api/2/';

function encodeCredentials(apiKey: string, apiSecret: string) {
  const credentialsString: string = `${apiKey}:${apiSecret}`;
  const encodedString: string = btoa(credentialsString);

  return encodedString;
}

interface AmplitudeUserParams {
  start: string; // YYYYMMDD format
  end: string; // YYYYMMDD format
  m?: 'new' | 'active'; // metric type, defaults to 'active'
  i?: 1 | 7 | 30; // interval: daily, weekly, or monthly
  s?: string; // segment definitions
  g?: string; // group by property
}

interface AmplitudeUserResponse {
  series: number[][];
  seriesMeta: { segmentIndex: number }[];
  xValues: string[];
}

export async function fetchAmplitudeData(
  params: AmplitudeUserParams
): Promise<AmplitudeUserResponse> {
  const apiKey = process.env.AMPLITUDE_API_KEY;
  const apiSecret = process.env.AMPLITUDE_SECRET_KEY;

  if (!apiKey || !apiSecret) {
    throw new Error('Amplitude API credentials not configured');
  }

  const searchParams = new URLSearchParams({
    start: params.start,
    end: params.end,
  });

  if (params.m) searchParams.set('m', params.m);
  if (params.i) searchParams.set('i', params.i.toString());
  if (params.s) searchParams.set('s', params.s);
  if (params.g) searchParams.set('g', params.g);

  const response = await fetch(`${ENDPOINT}users?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${encodeCredentials(apiKey, apiSecret)}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Amplitude API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
