package it.diyar.ecommercedemos.controller;

import it.diyar.ecommercedemos.dto.CartItemDTO;
import it.diyar.ecommercedemos.model.CartItem;
import it.diyar.ecommercedemos.model.User;
import it.diyar.ecommercedemos.repository.CartItemRepository;
import it.diyar.ecommercedemos.repository.UserRepository;
import it.diyar.ecommercedemos.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartService cartService;
    private CartItemRepository cartItemRepository;

    @GetMapping
    public List<CartItemDTO> getCartItems(Authentication authentication) {
        return cartService.getCartItems(authentication.getName());
    }


    @PostMapping("/add/{productId}")
    public CartItemDTO addToCart(@PathVariable Long productId, Authentication authentication) {
        return cartService.addToCart(authentication.getName(), productId);
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId, Authentication authentication) {
        cartService.removeFromCart(authentication.getName(), itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public void clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
    }


}
