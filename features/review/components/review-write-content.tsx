'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { useProject } from '@/features/project';
import { Button } from '@/shared/components/button';
import { Textarea } from '@/shared/components/textarea';
import { cn } from '@/shared/lib/cn';
import { useSessionUser } from '@/shared/lib/session-user';

import { ReviewSpectrumRow, spectrumStepToValue } from './review-spectrum-row';
import { ReviewSubmitDialog } from './review-submit-dialog';
import { useCreateReview } from '../api/mutations';
import { useReviewFormData } from '../api/queries';

const PRAISE_MIN_LENGTH = 10;
const TEXT_MAX_LENGTH = 250;
const MAX_TAGS = 3;
const DEFAULT_SPECTRUM_STEP = 2;

export const ReviewWriteContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = useMemo(() => {
    const raw = searchParams.get('projectId');
    const n = raw != null ? Number.parseInt(raw, 10) : Number.NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);
  const revieweeId = useMemo(() => {
    const raw = searchParams.get('revieweeId');
    const n = raw != null ? Number.parseInt(raw, 10) : Number.NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);
  const revieweeName = searchParams.get('reviewee')?.trim() || '';
  const hasRequiredParams = projectId != null && revieweeId != null && revieweeName.length > 0;

  const sessionUser = useSessionUser();
  const { data: projectData } = useProject(projectId ?? 0, projectId != null, { throwOnError: false });
  const { data: formData, isPending, isError, refetch } = useReviewFormData();
  const { mutateAsync: submitReview, isPending: isSubmitting } = useCreateReview();

  // 같은 프로젝트에서 이미 한 명에게 후기를 제출했으면 스펙트럼은 서버에 저장된 상태 → 빈 배열로 전송
  const hasSubmittedAnyReview = useMemo(() => {
    if (!projectData || !sessionUser) {
      return false;
    }
    return projectData.members.some((m) => m.userId !== sessionUser.userId && m.reviewWritten === true);
  }, [projectData, sessionUser]);

  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(() => new Set());
  const [spectrumSteps, setSpectrumSteps] = useState<Record<number, number>>({});
  const [praise, setPraise] = useState('');
  const [improvement, setImprovement] = useState('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleTag = useCallback((tagId: number) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
        return next;
      }
      if (next.size >= MAX_TAGS) {
        return prev;
      }
      next.add(tagId);
      return next;
    });
  }, []);

  const onSpectrumChange = useCallback((spectrumId: number, step: number) => {
    setSpectrumSteps((prev) => ({ ...prev, [spectrumId]: step }));
  }, []);

  const praiseTrimmed = praise.trim();
  const improvementTrimmed = improvement.trim();
  const praiseOk = praiseTrimmed.length >= PRAISE_MIN_LENGTH;
  const improvementOk = improvementTrimmed.length === 0 || improvementTrimmed.length >= PRAISE_MIN_LENGTH;
  const tagsOk = selectedTagIds.size > 0 && selectedTagIds.size <= MAX_TAGS;
  const spectrumsOk = !!formData?.spectrums?.length;
  const canSubmit = praiseOk && tagsOk && spectrumsOk && !isSubmitting;

  const handleSubmitFromDialog = useCallback(async () => {
    if (!formData || !canSubmit || projectId == null || revieweeId == null) {
      return;
    }
    setSubmitError(null);
    const tagIds = [...selectedTagIds];
    const spectrums = hasSubmittedAnyReview
      ? []
      : formData.spectrums.map((s) => ({
          spectrumId: s.spectrumId,
          value: spectrumStepToValue(spectrumSteps[s.spectrumId] ?? DEFAULT_SPECTRUM_STEP),
        }));
    try {
      await submitReview({
        projectId,
        revieweeId,
        praise: praise.trim(),
        improvement: improvement.trim(),
        tagIds,
        spectrums,
      });
      setSubmitDialogOpen(false);
      router.push('/projects');
    } catch {
      setSubmitError('제출에 실패했습니다. 다시 시도해주세요.');
    }
  }, [
    formData,
    canSubmit,
    hasSubmittedAnyReview,
    selectedTagIds,
    spectrumSteps,
    projectId,
    revieweeId,
    praise,
    improvement,
    submitReview,
    router,
  ]);

  if (!hasRequiredParams) {
    return (
      <div className="border-divider-gray-light bg-surface-white flex min-h-[320px] w-full flex-col items-center justify-center gap-4 border-b px-4">
        <p className="text-body-base text-text-basic text-center">후기 작성 대상 정보가 올바르지 않습니다.</p>
        <Button type="button" variant="secondary" size="medium" onClick={() => router.push('/projects')}>
          프로젝트 관리로 돌아가기
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="border-divider-gray-light bg-surface-white flex min-h-[320px] w-full items-center justify-center border-b">
        <p className="text-body-base text-text-subtle">불러오는 중…</p>
      </div>
    );
  }

  if (isError || !formData) {
    return (
      <div className="border-divider-gray-light bg-surface-white flex min-h-[320px] w-full flex-col items-center justify-center gap-4 border-b px-4">
        <p className="text-body-base text-text-basic text-center">폼 데이터를 불러오지 못했습니다.</p>
        <Button type="button" variant="secondary" size="medium" onClick={() => void refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <>
      <ReviewSubmitDialog
        open={submitDialogOpen}
        onOpenChange={(open) => {
          setSubmitDialogOpen(open);
          if (!open) {
            setSubmitError(null);
          }
        }}
        isSubmitting={isSubmitting}
        errorMessage={submitError ?? undefined}
        onConfirm={handleSubmitFromDialog}
      />
      <header className="bg-surface-white w-full">
        <div className="border-divider-gray-light mx-auto w-full max-w-[1200px] border-b-2 px-4 pt-[62px] pb-8 md:px-0">
          <h1 className="text-heading-lg text-text-basic leading-normal font-bold">후기 작성</h1>
          <p className="text-body-base text-text-basic mt-2 leading-normal">
            <span className="font-bold">{revieweeName}</span>
            <span>님에 대한 솔직한 후기를 작성해주세요.</span>
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] px-4 pt-[46px] pb-20">
        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-4" aria-labelledby="review-tags-heading">
            <h2 id="review-tags-heading" className="text-heading-sm text-text-basic leading-normal font-bold">
              태그 선택(최대 {MAX_TAGS}개)
            </h2>
            <div className="flex max-w-[781px] flex-wrap gap-x-2 gap-y-2">
              {formData.tags.map((tag) => {
                const selected = selectedTagIds.has(tag.tagId);
                return (
                  <button
                    key={tag.tagId}
                    type="button"
                    aria-pressed={selected}
                    disabled={!selected && selectedTagIds.size >= MAX_TAGS}
                    className={cn(
                      'text-body-sm inline-flex h-[33px] max-w-full shrink-0 items-center justify-center rounded-full border px-2.5 font-normal transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-primary) focus-visible:ring-offset-1',
                      selected
                        ? 'border-border-gray-light bg-action-secondary-pressed text-text-basic'
                        : 'border-border-gray-light bg-action-gray-light text-text-basic hover:border-action-secondary-hover hover:bg-action-secondary-hover',
                      !selected &&
                        selectedTagIds.size >= MAX_TAGS &&
                        'hover:border-border-gray-light hover:bg-action-gray-light cursor-not-allowed opacity-30',
                    )}
                    onClick={() => {
                      toggleTag(tag.tagId);
                    }}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-[15px]" aria-labelledby="review-spectrum-heading">
            <h2 id="review-spectrum-heading" className="text-heading-sm text-text-basic leading-normal font-bold">
              소프트 스킬 스펙트럼 성향
            </h2>
            <div className="grid w-full max-w-[781px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-[15px] gap-y-4">
              {formData.spectrums.map((spectrum) => (
                <ReviewSpectrumRow
                  key={spectrum.spectrumId}
                  spectrumId={spectrum.spectrumId}
                  leftLabel={spectrum.leftLabel}
                  rightLabel={spectrum.rightLabel}
                  valueStep={spectrumSteps[spectrum.spectrumId] ?? DEFAULT_SPECTRUM_STEP}
                  onChange={onSpectrumChange}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <section className="flex flex-col gap-2" aria-labelledby="review-praise-heading">
            <h2 id="review-praise-heading" className="text-heading-sm text-text-basic leading-normal font-bold">
              칭찬해요
            </h2>
            <p className="text-body-sm text-text-subtle">(필수) 최소 {PRAISE_MIN_LENGTH}자 이상 작성해주세요.</p>
            <Textarea
              name="praise"
              className="text-body-sm min-h-[144px] rounded-md"
              placeholder="ex) 적극적이고 배려심이 깊다."
              value={praise}
              maxLength={TEXT_MAX_LENGTH}
              error={praise.length > 0 && !praiseOk}
              helperText={
                praise.length > 0 && !praiseOk ? `칭찬은 ${PRAISE_MIN_LENGTH}자 이상 입력해 주세요.` : undefined
              }
              onChange={(e) => {
                setPraise(e.target.value);
              }}
            />
          </section>

          <section className="flex flex-col gap-2" aria-labelledby="review-improve-heading">
            <h2 id="review-improve-heading" className="text-heading-sm text-text-basic leading-normal font-bold">
              아쉬워요
            </h2>
            <p className="text-body-sm text-text-subtle">이 팀원과 협업하며 아쉬웠던 점을 작성해주세요.</p>
            <Textarea
              name="improvement"
              className="text-body-sm min-h-[144px] rounded-md"
              placeholder="ex) 소통이 조금 더 적극적이었으면 좋았을 것 같다."
              value={improvement}
              maxLength={TEXT_MAX_LENGTH}
              error={improvement.length > 0 && !improvementOk}
              helperText={
                improvement.length > 0 && !improvementOk
                  ? `아쉬워요는 ${PRAISE_MIN_LENGTH}자 이상 입력해 주세요.`
                  : undefined
              }
              onChange={(e) => {
                setImprovement(e.target.value);
              }}
            />
          </section>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="tertiary"
              size="large"
              className="text-body-xl min-w-[91px] px-7 font-medium"
              onClick={() => {
                router.back();
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              size="large"
              className="text-body-xl min-w-[91px] px-7 font-medium"
              disabled={!canSubmit}
              onClick={() => {
                if (canSubmit) {
                  setSubmitDialogOpen(true);
                }
              }}
            >
              후기 제출하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
