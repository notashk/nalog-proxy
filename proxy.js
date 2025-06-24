export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed' });
  }

  const { url, method = 'GET', headers = {}, body } = req.body;

  try {
    const fetchResponse = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    const contentType = fetchResponse.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await fetchResponse.json();
      res.status(200).json(data);
    } else {
      const text = await fetchResponse.text();
      res.status(200).send(text);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
