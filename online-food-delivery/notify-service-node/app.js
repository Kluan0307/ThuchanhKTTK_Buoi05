const amqp = require('amqplib');

async function listen() {
    // Kết nối tới container rabbitmq (tên service trong docker-compose)
    // Thay 'rabbitmq' bằng 'localhost'
const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();

    const queue = 'order-notification-queue';
    await channel.assertQueue(queue, { durable: true });

    console.log("🔔 Đang đợi tin nhắn từ Spring Boot...");

    channel.consume(queue, (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log(`[THÔNG BÁO] Gửi Email tới khách: ${data.customerName} cho món: ${data.foodName}`);
        channel.ack(msg);
    });
}
listen();