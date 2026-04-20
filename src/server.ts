import { env } from './lib/env.js';
import app from './app.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Planora Backend running on http://localhost:${PORT}`);
});
