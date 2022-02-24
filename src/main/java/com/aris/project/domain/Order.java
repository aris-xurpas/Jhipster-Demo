package com.aris.project.domain;

import com.aris.project.domain.enumeration.Status;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "date_ordered")
    private LocalDate dateOrdered;

    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Discount discount;

    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Staff cashier;

    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Payment payment;

    @OneToMany(mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "category", "variants", "order" }, allowSetters = true)
    private Set<Item> items = new HashSet<>();

    @OneToMany(mappedBy = "orders")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "orders" }, allowSetters = true)
    private Set<Customer> customers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Order id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return this.status;
    }

    public Order status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDateOrdered() {
        return this.dateOrdered;
    }

    public Order dateOrdered(LocalDate dateOrdered) {
        this.setDateOrdered(dateOrdered);
        return this;
    }

    public void setDateOrdered(LocalDate dateOrdered) {
        this.dateOrdered = dateOrdered;
    }

    public Discount getDiscount() {
        return this.discount;
    }

    public void setDiscount(Discount discount) {
        this.discount = discount;
    }

    public Order discount(Discount discount) {
        this.setDiscount(discount);
        return this;
    }

    public Staff getCashier() {
        return this.cashier;
    }

    public void setCashier(Staff staff) {
        this.cashier = staff;
    }

    public Order cashier(Staff staff) {
        this.setCashier(staff);
        return this;
    }

    public Payment getPayment() {
        return this.payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Order payment(Payment payment) {
        this.setPayment(payment);
        return this;
    }

    public Set<Item> getItems() {
        return this.items;
    }

    public void setItems(Set<Item> items) {
        if (this.items != null) {
            this.items.forEach(i -> i.setOrder(null));
        }
        if (items != null) {
            items.forEach(i -> i.setOrder(this));
        }
        this.items = items;
    }

    public Order items(Set<Item> items) {
        this.setItems(items);
        return this;
    }

    public Order addItems(Item item) {
        this.items.add(item);
        item.setOrder(this);
        return this;
    }

    public Order removeItems(Item item) {
        this.items.remove(item);
        item.setOrder(null);
        return this;
    }

    public Set<Customer> getCustomers() {
        return this.customers;
    }

    public void setCustomers(Set<Customer> customers) {
        if (this.customers != null) {
            this.customers.forEach(i -> i.setOrders(null));
        }
        if (customers != null) {
            customers.forEach(i -> i.setOrders(this));
        }
        this.customers = customers;
    }

    public Order customers(Set<Customer> customers) {
        this.setCustomers(customers);
        return this;
    }

    public Order addCustomer(Customer customer) {
        this.customers.add(customer);
        customer.setOrders(this);
        return this;
    }

    public Order removeCustomer(Customer customer) {
        this.customers.remove(customer);
        customer.setOrders(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", dateOrdered='" + getDateOrdered() + "'" +
            "}";
    }
}
