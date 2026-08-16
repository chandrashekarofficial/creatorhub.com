package com.creatorhub.repository;

import com.creatorhub.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByUserUserId(Long userId);
}