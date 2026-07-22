/**
 * 알림/안내 멘트 1차 카피 — 디자이너 검토용 초안.
 * 실제 적용 시 화면별로 이 상수를 참조합니다.
 */
export const GUIDANCE_COPY = {
  banner: {
    reviewSubmitted: '후기가 제출되었습니다. 팀원들에게도 후기를 남겨보세요.',
    projectCreated: '프로젝트가 생성되었습니다. 초대 링크를 팀원에게 공유해 보세요.',
    inviteAccepted: '프로젝트에 참여했습니다. 팀 확정 후 후기를 작성할 수 있어요.',
    signupComplete: '프로필 설정이 완료되었습니다. 프로젝트를 시작해 보세요.',
    alreadyMember: '이미 참여 중인 프로젝트입니다.',
    linkCopied: '초대 링크가 복사되었습니다.',
  },
  empty: {
    projects: {
      title: '참여 중인 프로젝트가 없어요',
      description: '새 프로젝트를 만들고 팀원을 초대해 후기를 주고받아 보세요.',
      action: '새 프로젝트 생성',
    },
    reviews: {
      title: '아직 도착한 후기가 없어요',
      description: '프로젝트가 확정되면 팀원들의 후기가 이곳에 쌓여요.',
    },
    tags: {
      title: '받은 태그가 없어요',
      description: '동료들이 남긴 태그가 모이면 협업 성향을 한눈에 볼 수 있어요.',
    },
    spectrum: {
      title: '받은 후기가 없어요',
      description: '피드백이 쌓이면 나의 협업 스펙트럼이 분석돼요.',
      action: '초대 링크 복사',
    },
    profileProjects: {
      title: '등록된 프로젝트가 없어요',
      description: '참여한 프로젝트가 프로필에 표시됩니다.',
    },
  },
  dialog: {
    invalidInvite: {
      title: '유효하지 않은 링크입니다',
      description: '이미 종료되었거나 유효하지 않은 링크입니다. 프로젝트 방장에게 새 초대 링크를 요청해 주세요.',
      confirm: '확인',
      cancel: '닫기',
    },
    inviteAccept: {
      title: '프로젝트 참여',
      descriptionPrefix: '이번 프로젝트에서 본인의 역할을 선택해주세요.',
      helper: '최대 2개까지 등록 가능해요.',
      confirm: '참여하기',
      cancel: '취소',
    },
    reviewSubmit: {
      title: '후기 제출',
      description: '후기를 제출 하시겠습니까? 제출 후 수정 및 삭제가 불가합니다.',
      confirm: '제출하기',
      cancel: '취소',
    },
  },
  status: {
    waitingConfirm: '방장의 확정을 기다리고 있습니다',
    teamConfirmed: '팀이 확정되었습니다! 후기 작성을 완료해볼까요?',
  },
  error: {
    reviewSubmitFailed: '제출에 실패했습니다. 다시 시도해주세요.',
    inviteJoinFailed: '프로젝트 참여에 실패했습니다. 다시 시도해 주세요.',
    alreadyInProject: '이미 참여 중인 프로젝트입니다.',
  },
} as const;
