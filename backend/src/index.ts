import 'dotenv/config';
import app from './app';
import connectDB from './config/db';

const PORT = parseInt(process.env.PORT || '5000', 10);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Lingua-Cam API démarrée sur http://localhost:${PORT}/api/v1`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

start().catch((err) => {
  console.error('❌ Erreur démarrage serveur:', err);
  process.exit(1);
});
