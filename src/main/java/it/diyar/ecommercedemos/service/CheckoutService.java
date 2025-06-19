package it.diyar.ecommercedemos.service;

import it.diyar.ecommercedemos.dto.*;
import it.diyar.ecommercedemos.model.*;
import it.diyar.ecommercedemos.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CheckoutService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public OrderDTO checkout(String email, CheckoutRequest checkoutRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total
        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setDate(new Date());
        order.setTotal(total);
        orderRepository.save(order);

        // Create order items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        // Clear cart
        cartItemRepository.deleteByUser(user);

        return convertToOrderDto(order);
    }

    public List<OrderDTO> getOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUser(user).stream()
                .map(this::convertToOrderDto)
                .collect(Collectors.toList());
    }

    private OrderDTO convertToOrderDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setDate(order.getDate());
        dto.setTotal(order.getTotal());

        List<OrderItemDTO> items = orderItemRepository.findByOrder(order).stream()
                .map(this::convertToOrderItemDto)
                .collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }

    private OrderItemDTO convertToOrderItemDto(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProduct().getId());
        dto.setProductName(orderItem.getProduct().getName());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }
}
