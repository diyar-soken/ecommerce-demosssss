package it.diyar.ecommercedemos.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String shippingAddress;
    private String paymentMethod;
}
