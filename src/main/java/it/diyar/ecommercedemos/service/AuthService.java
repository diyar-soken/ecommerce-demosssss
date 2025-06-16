package it.diyar.ecommercedemos.service;

import it.diyar.ecommercedemos.dto.SignupRequest;
import it.diyar.ecommercedemos.model.ERole;
import it.diyar.ecommercedemos.model.Role;
import it.diyar.ecommercedemos.model.User;
import it.diyar.ecommercedemos.repository.RoleRepository;
import it.diyar.ecommercedemos.repository.UserRepository;
import it.diyar.ecommercedemos.security.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    SecurityConfig securityConfig;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void registerUser(SignupRequest signUpRequest) {
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(securityConfig.passwordEncoder().encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);
    }
}
