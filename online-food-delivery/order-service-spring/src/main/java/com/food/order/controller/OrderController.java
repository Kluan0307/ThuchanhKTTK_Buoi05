package com.food.order.controller;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.food.order.config.RabbitMQConfig;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*") 
public class OrderController {
    @Autowired private RabbitTemplate rabbitTemplate;

    @PostMapping
    public String placeOrder(@RequestBody Map<String, String> orderData) {
        // Gửi sang Node.js qua RabbitMQ
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, orderData);
        return "Đã tiếp nhận đơn hàng cho: " + orderData.get("customerName");
    }
}