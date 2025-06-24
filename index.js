import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/proxy', async (req, res) => {
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
      res.json(data);
    } else {
      const text = await fetchResponse.text();
      res.send(text);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
