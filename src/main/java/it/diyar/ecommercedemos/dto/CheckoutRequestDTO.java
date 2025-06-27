package it.diyar.ecommercedemos.dto;

import lombok.Data;

@Data
public class CheckoutRequestDTO {
    private ShippingAddressDTO shippingAddress;
    private String paymentMethod;

    public ShippingAddressDTO getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddressDTO shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}