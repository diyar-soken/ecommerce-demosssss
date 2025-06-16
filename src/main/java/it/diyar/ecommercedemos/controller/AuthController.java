package it.diyar.ecommercedemos.controller;

import it.diyar.ecommercedemos.dto.AuthRequest;
import it.diyar.ecommercedemos.dto.AuthResponse;
import it.diyar.ecommercedemos.dto.SignupRequest;
import it.diyar.ecommercedemos.security.JwtUtils;
import it.diyar.ecommercedemos.security.UserDetailsImpl;
import it.diyar.ecommercedemos.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    ((UserDetailsImpl) authentication.getPrincipal()).getId(),
                    ((UserDetailsImpl) authentication.getPrincipal()).getUsername(),
                    ((UserDetailsImpl) authentication.getPrincipal()).getName()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenziali non valide");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accesso negato: " + e.getMessage());
        }
    }



    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        Map<String, String> response = new HashMap<>();

        if (authService.existsByEmail(signUpRequest.getEmail())) {
            response.put("message", "Email già in uso");
            return ResponseEntity.badRequest().body(response);
        }

        authService.registerUser(signUpRequest);
        response.put("messsage", "Registrazione avvenuta con successo");
        return ResponseEntity.ok(response);
    }
}
