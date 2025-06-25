export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed' });
  }

  const { url, method = 'GET', body } = req.body;

  const token = req.headers.authorization; // <-- берём Authorization из заголовков клиента

  try {
    const fetchResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '', // <-- пробрасываем токен дальше
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    const contentType = fetchResponse.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await fetchResponse.json();
      res.status(fetchResponse.status).json(data);
    } else {
      const text = await fetchResponse.text();
      res.status(fetchResponse.status).send(text);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
