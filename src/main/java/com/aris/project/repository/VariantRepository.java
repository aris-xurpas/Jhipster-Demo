package com.aris.project.repository;

import com.aris.project.domain.Variant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Variant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VariantRepository extends JpaRepository<Variant, Long> {}
