package it.diyar.ecommercedemos.service;

import it.diyar.ecommercedemos.dto.CheckoutRequestDTO;
import it.diyar.ecommercedemos.dto.OrderDTO;
import it.diyar.ecommercedemos.dto.OrderItemDTO;
import it.diyar.ecommercedemos.dto.ShippingAddressDTO;
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
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public OrderDTO createOrderFromCart(String userEmail, CheckoutRequestDTO checkoutRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calcola il totale
        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // Crea l'ordine
        Order order = new Order();
        order.setUser(user);
        order.setDate(new Date());
        order.setTotal(total);
        
        // Imposta l'indirizzo di spedizione
        if (checkoutRequest != null && checkoutRequest.getShippingAddress() != null) {
            ShippingAddressDTO shippingAddress = checkoutRequest.getShippingAddress();
            order.setShippingFullName(shippingAddress.getFullName());
            order.setShippingAddressLine1(shippingAddress.getAddressLine1());
            order.setShippingAddressLine2(shippingAddress.getAddressLine2());
            order.setShippingCity(shippingAddress.getCity());
            order.setShippingPostalCode(shippingAddress.getPostalCode());
            order.setShippingProvince(shippingAddress.getProvince());
            order.setShippingCountry(shippingAddress.getCountry());
            order.setShippingPhoneNumber(shippingAddress.getPhoneNumber());
        }
        
        Order savedOrder = orderRepository.save(order);

        // Crea gli OrderItem dal carrello
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);

        // Svuota il carrello
        cartItemRepository.deleteAll(cartItems);

        return convertToDTO(savedOrder);
    }

    // Metodo di fallback per compatibilità
    @Transactional
    public OrderDTO createOrderFromCart(String userEmail) {
        return createOrderFromCart(userEmail, null);
    }

    public List<OrderDTO> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserOrderByDateDesc(user);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return convertToDTO(order);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setDate(order.getDate());
        orderDTO.setTotal(order.getTotal());

        // Converti l'indirizzo di spedizione
        if (order.getShippingFullName() != null) {
            ShippingAddressDTO shippingAddressDTO = new ShippingAddressDTO();
            shippingAddressDTO.setFullName(order.getShippingFullName());
            shippingAddressDTO.setAddressLine1(order.getShippingAddressLine1());
            shippingAddressDTO.setAddressLine2(order.getShippingAddressLine2());
            shippingAddressDTO.setCity(order.getShippingCity());
            shippingAddressDTO.setPostalCode(order.getShippingPostalCode());
            shippingAddressDTO.setProvince(order.getShippingProvince());
            shippingAddressDTO.setCountry(order.getShippingCountry());
            shippingAddressDTO.setPhoneNumber(order.getShippingPhoneNumber());
            orderDTO.setShippingAddress(shippingAddressDTO);
        }

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPrice(item.getPrice());
            return itemDTO;
        }).collect(Collectors.toList());

        orderDTO.setItems(itemDTOs);
        return orderDTO;
    }
}