package com.aris.project.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.aris.project.IntegrationTest;
import com.aris.project.domain.Variant;
import com.aris.project.repository.VariantRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VariantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VariantResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final String ENTITY_API_URL = "/api/variants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VariantRepository variantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVariantMockMvc;

    private Variant variant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Variant createEntity(EntityManager em) {
        Variant variant = new Variant().name(DEFAULT_NAME).price(DEFAULT_PRICE);
        return variant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Variant createUpdatedEntity(EntityManager em) {
        Variant variant = new Variant().name(UPDATED_NAME).price(UPDATED_PRICE);
        return variant;
    }

    @BeforeEach
    public void initTest() {
        variant = createEntity(em);
    }

    @Test
    @Transactional
    void createVariant() throws Exception {
        int databaseSizeBeforeCreate = variantRepository.findAll().size();
        // Create the Variant
        restVariantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(variant)))
            .andExpect(status().isCreated());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeCreate + 1);
        Variant testVariant = variantList.get(variantList.size() - 1);
        assertThat(testVariant.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVariant.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createVariantWithExistingId() throws Exception {
        // Create the Variant with an existing ID
        variant.setId(1L);

        int databaseSizeBeforeCreate = variantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVariantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(variant)))
            .andExpect(status().isBadRequest());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVariants() throws Exception {
        // Initialize the database
        variantRepository.saveAndFlush(variant);

        // Get all the variantList
        restVariantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(variant.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)));
    }

    @Test
    @Transactional
    void getVariant() throws Exception {
        // Initialize the database
        variantRepository.saveAndFlush(variant);

        // Get the variant
        restVariantMockMvc
            .perform(get(ENTITY_API_URL_ID, variant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(variant.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE));
    }

    @Test
    @Transactional
    void getNonExistingVariant() throws Exception {
        // Get the variant
        restVariantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVariant() throws Exception {
        // Initialize the database
        variantRepository.saveAndFlush(variant);

        int databaseSizeBeforeUpdate = variantRepository.findAll().size();

        // Update the variant
        Variant updatedVariant = variantRepository.findById(variant.getId()).get();
        // Disconnect from session so that the updates on updatedVariant are not directly saved in db
        em.detach(updatedVariant);
        updatedVariant.name(UPDATED_NAME).price(UPDATED_PRICE);

        restVariantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVariant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVariant))
            )
            .andExpect(status().isOk());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
        Variant testVariant = variantList.get(variantList.size() - 1);
        assertThat(testVariant.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVariant.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingVariant() throws Exception {
        int databaseSizeBeforeUpdate = variantRepository.findAll().size();
        variant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVariantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, variant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(variant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVariant() throws Exception {
        int databaseSizeBeforeUpdate = variantRepository.findAll().size();
        variant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVariantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(variant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVariant() throws Exception {
        int databaseSizeBeforeUpdate = variantRepository.findAll().size();
        variant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVariantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(variant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVariantWithPatch() throws Exception {
        // Initialize the database
        variantRepository.saveAndFlush(variant);

        int databaseSizeBeforeUpdate = variantRepository.findAll().size();

        // Update the variant using partial update
        Variant partialUpdatedVariant = new Variant();
        partialUpdatedVariant.setId(variant.getId());

        partialUpdatedVariant.name(UPDATED_NAME);

        restVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVariant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVariant))
            )
            .andExpect(status().isOk());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
        Variant testVariant = variantList.get(variantList.size() - 1);
        assertThat(testVariant.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVariant.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateVariantWithPatch() throws Exception {
        // Initialize the database
        variantRepository.saveAndFlush(variant);

        int databaseSizeBeforeUpdate = variantRepository.findAll().size();

        // Update the variant using partial update
        Variant partialUpdatedVariant = new Variant();
        partialUpdatedVariant.setId(variant.getId());

        partialUpdatedVariant.name(UPDATED_NAME).price(UPDATED_PRICE);

        restVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVariant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVariant))
            )
            .andExpect(status().isOk());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
        Variant testVariant = variantList.get(variantList.size() - 1);
        assertThat(testVariant.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVariant.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingVariant() throws Exception {
        int databaseSizeBeforeUpdate = variantRepository.findAll().size();
        variant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, variant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(variant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVariant() throws Exception {
        int databaseSizeBeforeUpdate = variantRepository.findAll().size();
        variant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(variant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVariant() throws Exception {
        int databaseSizeBeforeUpdate = variantRepository.findAll().size();
        variant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVariantMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(variant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Variant in the database
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVariant() throws Exception {
        // Initialize the database
        variantRepository.saveAndFlush(variant);

        int databaseSizeBeforeDelete = variantRepository.findAll().size();

        // Delete the variant
        restVariantMockMvc
            .perform(delete(ENTITY_API_URL_ID, variant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Variant> variantList = variantRepository.findAll();
        assertThat(variantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
