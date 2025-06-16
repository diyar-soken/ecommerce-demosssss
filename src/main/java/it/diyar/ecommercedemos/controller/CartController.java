package it.diyar.ecommercedemos.controller;

import it.diyar.ecommercedemos.dto.CartItemDTO;
import it.diyar.ecommercedemos.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping
    public List<CartItemDTO> getCartItems(Authentication authentication) {
        return cartService.getCartItems(authentication.getName());
    }

    @PostMapping("/add/{productId}")
    public CartItemDTO addToCart(@PathVariable Long productId, Authentication authentication) {
        return cartService.addToCart(authentication.getName(), productId);
    }

    @DeleteMapping("/remove/{itemId}")
    public void removeFromCart(@PathVariable Long itemId, Authentication authentication) {
        cartService.removeFromCart(authentication.getName(), itemId);
    }

    @DeleteMapping("/clear")
    public void clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
    }
}
