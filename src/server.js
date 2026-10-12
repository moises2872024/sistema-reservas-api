const app = require('./app');
const { PORT } = require('./config/env.config');

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});