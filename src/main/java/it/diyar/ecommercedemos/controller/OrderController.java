package it.diyar.ecommercedemos.controller;

import it.diyar.ecommercedemos.dto.OrderDTO;
import it.diyar.ecommercedemos.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout(Authentication authentication) {
        try {
            OrderDTO order = orderService.createOrderFromCart(authentication.getName());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getUserOrders(Authentication authentication) {
        List<OrderDTO> orders = orderService.getUserOrders(authentication.getName());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId, Authentication authentication) {
        try {
            OrderDTO order = orderService.getOrderById(orderId, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}