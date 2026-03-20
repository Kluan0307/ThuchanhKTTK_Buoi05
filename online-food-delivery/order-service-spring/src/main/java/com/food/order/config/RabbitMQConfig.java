package com.food.order.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String EXCHANGE = "food-delivery-exchange";
    public static final String QUEUE = "order-notification-queue";
    public static final String ROUTING_KEY = "order.routing.key";

    @Bean public TopicExchange exchange() { return new TopicExchange(EXCHANGE); }
    @Bean public Queue queue() { return new Queue(QUEUE); }
    @Bean public Binding binding(Queue q, TopicExchange e) { 
        return BindingBuilder.bind(q).to(e).with(ROUTING_KEY); 
    }
}