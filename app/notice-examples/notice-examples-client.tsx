'use client';

import { useState, type ReactNode } from 'react';

import { ProjectStatusAlert } from '@/features/project/components/project-status-alert';
import { CopyIcon, SettingIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { EmptyState } from '@/shared/components/empty-state';
import { GuidanceBanner } from '@/shared/components/guidance-banner/guidance-banner';
import { GUIDANCE_COPY } from '@/shared/constants/guidance-copy';
import { cn } from '@/shared/lib/cn';

const SAMPLE_PROJECT_NAME = 'Sossbar 4기 프로젝트';

const SampleSection = ({
  title,
  description,
  usage,
  children,
}: {
  title: string;
  description: string;
  usage: string;
  children: ReactNode;
}) => (
  <section className="border-border-gray-light bg-surface-white flex flex-col gap-6 rounded-2xl border p-6 sm:p-8">
    <div className="flex flex-col gap-2">
      <p className="text-detail-base text-text-primary font-semibold tracking-wide uppercase">Sample</p>
      <h2 className="text-heading-base text-text-basic font-bold">{title}</h2>
      <p className="text-body-base text-text-subtle">{description}</p>
      <p className="text-body-sm text-text-subtler">
        <span className="text-text-basic font-medium">적용 위치:</span> {usage}
      </p>
    </div>
    <div className="border-divider-gray-light flex flex-col gap-4 border-t pt-6">{children}</div>
  </section>
);

const PreviewFrame = ({ label, children, className }: { label: string; children: ReactNode; className?: string }) => (
  <div className="flex flex-col gap-2">
    <p className="text-body-sm text-text-subtler font-medium">{label}</p>
    <div className={cn('bg-surface-gray-subtler rounded-xl p-4 sm:p-6', className)}>{children}</div>
  </div>
);

export const NoticeExamplesClient = () => {
  const [dismissedBanner, setDismissedBanner] = useState<string | null>(null);
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(true);
  const [invalidInviteOpen, setInvalidInviteOpen] = useState(false);
  const [inviteAcceptOpen, setInviteAcceptOpen] = useState(false);
  const [reviewSubmitOpen, setReviewSubmitOpen] = useState(false);

  return (
    <>
      <header className="border-border-gray-light mt-15.5 flex flex-col gap-3 border-b-[3px] pb-8">
        <p className="text-detail-base text-text-primary font-semibold">Guidance UI v1</p>
        <h1 className="text-heading-lg text-text-basic font-bold">알림 · 안내 멘트 샘플</h1>
        <p className="text-heading-xs text-text-subtle max-w-3xl font-normal">
          기존 Sossbar UI 토큰과 컴ponent 패턴을 기준으로 한 1차 시안입니다. 디자이너 검토 후 카피·레이아웃·컬러를
          조정해 실제 화면에 반영할 예정입니다.
        </p>
      </header>

      <div className="my-10 flex flex-col gap-8">
        <SampleSection
          title="페이지 상단 배너"
          description="작업 완료·참여 성공 등 페이지 진입 직후 한 번 보여주는 안내입니다. 닫기 버튼으로 dismiss 가능합니다."
          usage="/projects, /signup 완료 후 redirect, 초대 수락 후"
        >
          <PreviewFrame label="success — 후기 제출 완료">
            {dismissedBanner === 'review' ? (
              <p className="text-body-sm text-text-subtler">닫힌 상태 (새로고침 시 다시 표시됨 — 샘플용)</p>
            ) : (
              <GuidanceBanner variant="success" onDismiss={() => setDismissedBanner('review')}>
                {GUIDANCE_COPY.banner.reviewSubmitted}
              </GuidanceBanner>
            )}
          </PreviewFrame>

          <PreviewFrame label="info — 프로젝트 생성 완료">
            <GuidanceBanner variant="info">{GUIDANCE_COPY.banner.projectCreated}</GuidanceBanner>
          </PreviewFrame>

          <PreviewFrame label="success — 초대 수락 완료">
            <GuidanceBanner variant="success">{GUIDANCE_COPY.banner.inviteAccepted}</GuidanceBanner>
          </PreviewFrame>

          <PreviewFrame label="info — 이미 참여 중">
            <GuidanceBanner variant="info">{GUIDANCE_COPY.banner.alreadyMember}</GuidanceBanner>
          </PreviewFrame>

          <PreviewFrame label="error — API 실패">
            <GuidanceBanner variant="error">{GUIDANCE_COPY.error.reviewSubmitFailed}</GuidanceBanner>
          </PreviewFrame>
        </SampleSection>

        <SampleSection
          title="빈 상태 (Empty State)"
          description="데이터가 없을 때 다음 행동을 안내합니다. 제목 + 설명 + CTA 버튼 조합입니다."
          usage="프로젝트 목록, 프로필 후기/태그/스펙트럼, 마이프로필 프로젝트"
        >
          <PreviewFrame label="프로젝트 목록 — empty" className="min-h-[280px]">
            <EmptyState
              title={GUIDANCE_COPY.empty.projects.title}
              description={GUIDANCE_COPY.empty.projects.description}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="medium"
                  leftIcon={<SettingIcon aria-hidden className="size-5" />}
                >
                  {GUIDANCE_COPY.empty.projects.action}
                </Button>
              }
            />
          </PreviewFrame>

          <div className="grid gap-4 lg:grid-cols-2">
            <PreviewFrame label="후기 목록 — empty" className="min-h-[220px]">
              <EmptyState
                title={GUIDANCE_COPY.empty.reviews.title}
                description={GUIDANCE_COPY.empty.reviews.description}
              />
            </PreviewFrame>

            <PreviewFrame label="태그 — empty" className="min-h-[220px]">
              <EmptyState title={GUIDANCE_COPY.empty.tags.title} description={GUIDANCE_COPY.empty.tags.description} />
            </PreviewFrame>
          </div>

          <PreviewFrame label="스펙트럼 — empty + CTA" className="min-h-[240px]">
            <EmptyState
              title={GUIDANCE_COPY.empty.spectrum.title}
              description={GUIDANCE_COPY.empty.spectrum.description}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="medium"
                  leftIcon={<CopyIcon aria-hidden className="size-5" />}
                >
                  {GUIDANCE_COPY.empty.spectrum.action}
                </Button>
              }
            />
          </PreviewFrame>
        </SampleSection>

        <SampleSection
          title="카드/섹션 인라인 상태"
          description="프로젝트 카드 등 특정 컨텍스트 안에서 보여주는 짧은 상태 메시지입니다. (기존 ProjectStatusAlert 재사용)"
          usage="프로젝트 카드 — 확정 대기 / 팀 확정"
        >
          <PreviewFrame label="warning — 확정 대기">
            <ProjectStatusAlert variant="warning">{GUIDANCE_COPY.status.waitingConfirm}</ProjectStatusAlert>
          </PreviewFrame>
          <PreviewFrame label="success — 팀 확정">
            <ProjectStatusAlert variant="success">{GUIDANCE_COPY.status.teamConfirmed}</ProjectStatusAlert>
          </PreviewFrame>
        </SampleSection>

        <SampleSection
          title="짧은 피드백 (Toast / Tooltip)"
          description="복사·저장 등 즉각적인 행동 결과를 짧게 알립니다. 3초 후 자동 dismiss."
          usage="초대 링크 복사 버튼, 공유 액션"
        >
          <PreviewFrame label="CopyFeedbackTooltip — 링크 복사">
            <div className="relative flex min-h-[80px] items-end justify-center pt-10">
              <div className="relative">
                <CopyFeedbackTooltip
                  open={copyTooltipOpen}
                  onClose={() => setCopyTooltipOpen(false)}
                  message={GUIDANCE_COPY.banner.linkCopied}
                />
                <Button type="button" variant="secondary" size="medium" onClick={() => setCopyTooltipOpen(true)}>
                  툴팁 다시 보기
                </Button>
              </div>
            </div>
          </PreviewFrame>

          <PreviewFrame label="GuidanceBanner — 페이지 하단 고정 (제안)">
            <GuidanceBanner variant="success" className="shadow-md">
              {GUIDANCE_COPY.banner.linkCopied}
            </GuidanceBanner>
            <p className="text-body-sm text-text-subtler mt-2">
              * 모바일에서 툴팁 대신 하단 스낵바 형태를 검토할 수 있습니다.
            </p>
          </PreviewFrame>
        </SampleSection>

        <SampleSection
          title="다이얼로그 / 모달"
          description="확인·경고가 필요한 흐름입니다. 기존 ConfirmationDialog 패턴을 그대로 사용합니다."
          usage="초대 수락, 만료 링크, 후기 제출 확인"
        >
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" size="medium" onClick={() => setInviteAcceptOpen(true)}>
              초대 수락 모달
            </Button>
            <Button type="button" variant="secondary" size="medium" onClick={() => setInvalidInviteOpen(true)}>
              만료/무효 링크 모달
            </Button>
            <Button type="button" variant="secondary" size="medium" onClick={() => setReviewSubmitOpen(true)}>
              후기 제출 확인 모달
            </Button>
          </div>

          <PreviewFrame label="다이얼로그 내 에러 메시지 예시">
            <p className="text-body-sm text-text-error" role="alert">
              {GUIDANCE_COPY.error.inviteJoinFailed}
            </p>
          </PreviewFrame>
        </SampleSection>

        <section className="border-border-gray-light bg-surface-gray-subtler rounded-2xl border p-6 sm:p-8">
          <h2 className="text-heading-base text-text-basic font-bold">디자이너 검토 체크리스트</h2>
          <ul className="text-body-base text-text-subtle mt-4 list-disc space-y-2 pl-5">
            <li>배너 4종(success / info / warning / error) 컬러·아이콘 조합</li>
            <li>Empty State 설명문 길이, CTA 버튼 유무·문구</li>
            <li>페이지 상단 배너 vs 하단 스낵바 중 선호 패턴</li>
            <li>다이얼로그 카피 톤 (존댓말 / 행동 유도 강도)</li>
            <li>모바일(360px)에서 배너·empty state 줄바꿈</li>
          </ul>
        </section>
      </div>

      <ConfirmationDialog
        open={inviteAcceptOpen}
        title={GUIDANCE_COPY.dialog.inviteAccept.title}
        description={
          <>
            <span className="text-text-basic font-bold">{SAMPLE_PROJECT_NAME}</span>{' '}
            {GUIDANCE_COPY.dialog.inviteAccept.descriptionPrefix}
          </>
        }
        confirmText={GUIDANCE_COPY.dialog.inviteAccept.confirm}
        cancelText={GUIDANCE_COPY.dialog.inviteAccept.cancel}
        onOpenChange={setInviteAcceptOpen}
        onConfirm={() => setInviteAcceptOpen(false)}
      />

      <ConfirmationDialog
        open={invalidInviteOpen}
        title={GUIDANCE_COPY.dialog.invalidInvite.title}
        description={GUIDANCE_COPY.dialog.invalidInvite.description}
        confirmText={GUIDANCE_COPY.dialog.invalidInvite.confirm}
        cancelText={GUIDANCE_COPY.dialog.invalidInvite.cancel}
        onOpenChange={setInvalidInviteOpen}
        onConfirm={() => setInvalidInviteOpen(false)}
      />

      <ConfirmationDialog
        open={reviewSubmitOpen}
        title={GUIDANCE_COPY.dialog.reviewSubmit.title}
        description={
          <>
            <p className="mb-0 leading-normal">후기를 제출 하시겠습니까?</p>
            <p className="leading-normal">제출 후 수정 및 삭제가 불가합니다.</p>
          </>
        }
        confirmText={GUIDANCE_COPY.dialog.reviewSubmit.confirm}
        cancelText={GUIDANCE_COPY.dialog.reviewSubmit.cancel}
        onOpenChange={setReviewSubmitOpen}
        onConfirm={() => setReviewSubmitOpen(false)}
      />
    </>
  );
};
