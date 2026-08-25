package com.creatorhub.repository;

import com.creatorhub.entity.SeoData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeoDataRepository extends JpaRepository<SeoData, Long> {

    List<SeoData> findByUserUserIdOrderBySeoIdAsc(Long userId);

    Optional<SeoData> findBySeoIdAndUserUserId(Long seoId, Long userId);
}