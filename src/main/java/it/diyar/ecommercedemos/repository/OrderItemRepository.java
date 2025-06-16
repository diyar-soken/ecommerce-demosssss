package it.diyar.ecommercedemos.repository;

import it.diyar.ecommercedemos.model.Order;
import it.diyar.ecommercedemos.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
}