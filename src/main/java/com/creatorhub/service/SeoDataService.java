package com.creatorhub.service;

import com.creatorhub.dto.seo.SeoDataRequest;
import com.creatorhub.dto.seo.SeoDataResponse;
import com.creatorhub.entity.ContentIdea;
import com.creatorhub.entity.SeoData;
import com.creatorhub.entity.User;
import com.creatorhub.repository.ContentIdeaRepository;
import com.creatorhub.repository.SeoDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeoDataService {

    private final SeoDataRepository seoDataRepository;
    private final ContentIdeaRepository contentIdeaRepository;

    @Transactional
    public SeoDataResponse create(SeoDataRequest request, Long userId) {

        ContentIdea content = contentIdeaRepository
                .findByIdeaIdAndUserUserId(request.contentId(), userId)
                .orElseThrow(() ->
                        new RuntimeException("Content idea not found"));

        User user = new User();
        user.setUserId(userId);

        SeoData seoData = SeoData.builder()
                .user(user)
                .content(content)
                .keywords(request.keywords())
                .hashtags(request.hashtags())
                .description(request.description())
                .build();

        return toResponse(seoDataRepository.save(seoData));
    }

    @Transactional(readOnly = true)
    public List<SeoDataResponse> getAll(Long userId) {

        return seoDataRepository
                .findByUserUserIdOrderBySeoIdAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SeoDataResponse getById(Long seoId, Long userId) {

        return toResponse(findOwnedSeo(seoId, userId));
    }

    @Transactional
    public SeoDataResponse update(
            Long seoId,
            SeoDataRequest request,
            Long userId
    ) {

        SeoData seoData = findOwnedSeo(seoId, userId);

        ContentIdea content = contentIdeaRepository
                .findByIdeaIdAndUserUserId(request.contentId(), userId)
                .orElseThrow(() ->
                        new RuntimeException("Content idea not found"));

        seoData.setContent(content);
        seoData.setKeywords(request.keywords());
        seoData.setHashtags(request.hashtags());
        seoData.setDescription(request.description());

        return toResponse(seoDataRepository.save(seoData));
    }

    @Transactional
    public void delete(Long seoId, Long userId) {

        SeoData seoData = findOwnedSeo(seoId, userId);

        seoDataRepository.delete(seoData);
    }

    private SeoData findOwnedSeo(Long seoId, Long userId) {

        return seoDataRepository
                .findBySeoIdAndUserUserId(seoId, userId)
                .orElseThrow(() ->
                        new RuntimeException("SEO data not found"));
    }

    private SeoDataResponse toResponse(SeoData seoData) {

        return new SeoDataResponse(
                seoData.getSeoId(),
                seoData.getContent().getIdeaId(),
                seoData.getKeywords(),
                seoData.getHashtags(),
                seoData.getDescription()
        );
    }
}