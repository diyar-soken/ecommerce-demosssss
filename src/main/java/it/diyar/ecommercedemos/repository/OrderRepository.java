package it.diyar.ecommercedemos.repository;

import it.diyar.ecommercedemos.model.Order;
import it.diyar.ecommercedemos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserOrderByDateDesc(User user);
}

