const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onMessagePublished } = require('firebase-functions/v2/pubsub');
const admin = require('firebase-admin');

admin.initializeApp();

const NOTIFICATIONS_TOPIC = 'notifications';

// Function to handle notification logic (gatilho de Pub/Sub)
exports.handleNotifications = onMessagePublished(
  NOTIFICATIONS_TOPIC,
  async (event) => {
    console.log('Checking for notifications to send');
    const db = admin.firestore();
    const snapshot = await db.collection('cards').get();
    snapshot.forEach(doc => {
      // Lógica de notificação
    });
    return null;
  }
);

// Schedule the function to run every 24 hours at 08:00
exports.scheduleNotifications = onSchedule(
  {
    schedule: 'every 24 hours',
    timeZone: 'America/Sao_Paulo',
  },
  async (event) => {
    // Lógica agendada: aqui você pode acionar a lógica desejada
    console.log('Scheduled notification check triggered');
    // Se quiser publicar em Pub/Sub, use Firestore/Cloud Task, não PubSub client!
    return null;
  }
);
