package com.aris.project.web.rest;

import com.aris.project.domain.Discount;
import com.aris.project.repository.DiscountRepository;
import com.aris.project.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aris.project.domain.Discount}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DiscountResource {

    private final Logger log = LoggerFactory.getLogger(DiscountResource.class);

    private static final String ENTITY_NAME = "discount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiscountRepository discountRepository;

    public DiscountResource(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    /**
     * {@code POST  /discounts} : Create a new discount.
     *
     * @param discount the discount to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new discount, or with status {@code 400 (Bad Request)} if the discount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/discounts")
    public ResponseEntity<Discount> createDiscount(@RequestBody Discount discount) throws URISyntaxException {
        log.debug("REST request to save Discount : {}", discount);
        if (discount.getId() != null) {
            throw new BadRequestAlertException("A new discount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Discount result = discountRepository.save(discount);
        return ResponseEntity
            .created(new URI("/api/discounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /discounts/:id} : Updates an existing discount.
     *
     * @param id the id of the discount to save.
     * @param discount the discount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discount,
     * or with status {@code 400 (Bad Request)} if the discount is not valid,
     * or with status {@code 500 (Internal Server Error)} if the discount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/discounts/{id}")
    public ResponseEntity<Discount> updateDiscount(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Discount discount
    ) throws URISyntaxException {
        log.debug("REST request to update Discount : {}, {}", id, discount);
        if (discount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Discount result = discountRepository.save(discount);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discount.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /discounts/:id} : Partial updates given fields of an existing discount, field will ignore if it is null
     *
     * @param id the id of the discount to save.
     * @param discount the discount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discount,
     * or with status {@code 400 (Bad Request)} if the discount is not valid,
     * or with status {@code 404 (Not Found)} if the discount is not found,
     * or with status {@code 500 (Internal Server Error)} if the discount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/discounts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Discount> partialUpdateDiscount(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Discount discount
    ) throws URISyntaxException {
        log.debug("REST request to partial update Discount partially : {}, {}", id, discount);
        if (discount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Discount> result = discountRepository
            .findById(discount.getId())
            .map(existingDiscount -> {
                if (discount.getDescription() != null) {
                    existingDiscount.setDescription(discount.getDescription());
                }
                if (discount.getRate() != null) {
                    existingDiscount.setRate(discount.getRate());
                }
                if (discount.getFixedAmount() != null) {
                    existingDiscount.setFixedAmount(discount.getFixedAmount());
                }

                return existingDiscount;
            })
            .map(discountRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discount.getId().toString())
        );
    }

    /**
     * {@code GET  /discounts} : get all the discounts.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of discounts in body.
     */
    @GetMapping("/discounts")
    public List<Discount> getAllDiscounts(@RequestParam(required = false) String filter) {
        if ("order-is-null".equals(filter)) {
            log.debug("REST request to get all Discounts where order is null");
            return StreamSupport
                .stream(discountRepository.findAll().spliterator(), false)
                .filter(discount -> discount.getOrder() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Discounts");
        return discountRepository.findAll();
    }

    /**
     * {@code GET  /discounts/:id} : get the "id" discount.
     *
     * @param id the id of the discount to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the discount, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/discounts/{id}")
    public ResponseEntity<Discount> getDiscount(@PathVariable Long id) {
        log.debug("REST request to get Discount : {}", id);
        Optional<Discount> discount = discountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(discount);
    }

    /**
     * {@code DELETE  /discounts/:id} : delete the "id" discount.
     *
     * @param id the id of the discount to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/discounts/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        log.debug("REST request to delete Discount : {}", id);
        discountRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
