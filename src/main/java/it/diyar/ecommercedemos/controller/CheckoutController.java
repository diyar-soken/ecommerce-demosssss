package it.diyar.ecommercedemos.controller;

import it.diyar.ecommercedemos.dto.CheckoutRequest;
import it.diyar.ecommercedemos.dto.OrderDTO;
import it.diyar.ecommercedemos.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    @Autowired
    private CheckoutService checkoutService;

    @PostMapping
    public OrderDTO checkout(@RequestBody CheckoutRequest checkoutRequest, Authentication authentication) {
        return checkoutService.checkout(authentication.getName(), checkoutRequest);
    }

    @GetMapping("/orders")
    public List<OrderDTO> getOrders(Authentication authentication) {
        return checkoutService.getOrders(authentication.getName());
    }
}
