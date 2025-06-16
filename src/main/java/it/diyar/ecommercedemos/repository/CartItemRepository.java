package it.diyar.ecommercedemos.repository;

import it.diyar.ecommercedemos.model.CartItem;
import it.diyar.ecommercedemos.model.Product;
import it.diyar.ecommercedemos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
}
