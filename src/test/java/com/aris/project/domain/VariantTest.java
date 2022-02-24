package com.aris.project.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.aris.project.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VariantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Variant.class);
        Variant variant1 = new Variant();
        variant1.setId(1L);
        Variant variant2 = new Variant();
        variant2.setId(variant1.getId());
        assertThat(variant1).isEqualTo(variant2);
        variant2.setId(2L);
        assertThat(variant1).isNotEqualTo(variant2);
        variant1.setId(null);
        assertThat(variant1).isNotEqualTo(variant2);
    }
}
