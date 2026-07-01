'use client';

import { useMemo } from 'react';

import { Button } from '@/shared/components/button';
import { SectionCard } from '@/shared/components/section-card';

import type { ProjectDetailInfoFormValues } from '../project.hooks';
import type { ProjectResponse } from '../project.types';

import { useProjectDetailInfoForm } from '../project.hooks';
import { ProjectInfoEdit } from './project-info-edit';
import { ProjectInfoView } from './project-info-view';

interface Props {
  project: ProjectResponse;
  isLeader: boolean;
}

const mapProjectToFormDefaults = (project: ProjectResponse): ProjectDetailInfoFormValues => ({
  projectName: project.projectName,
  host: project.host,
  startDate: project.startDate,
  endDate: project.endDate,
  projectLink: project.projectLink ?? '',
  image: project.projectImage,
});

export const ProjectInfoCard = ({ project, isLeader }: Props) => {
  const defaultValues = useMemo(() => mapProjectToFormDefaults(project), [project]);
  const { form, isSaving, isEditing, startEditing, cancelEditing, onSubmit } = useProjectDetailInfoForm({
    projectId: project.projectId,
    defaultValues,
  });

  const action = !isLeader ? null : isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="tertiary" onClick={cancelEditing} disabled={isSaving} className="text-text-basic">
        취소
      </Button>
      <Button
        type="button"
        variant="tertiary"
        onClick={form.handleSubmit(onSubmit)}
        disabled={isSaving}
        className="border-border-gray-dark text-text-basic border"
      >
        저장
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="tertiary"
      onClick={startEditing}
      className="border-border-gray-dark text-text-subtle w-17 border"
    >
      수정
    </Button>
  );

  return (
    <SectionCard title="프로젝트 정보" action={action}>
      {isEditing ? <ProjectInfoEdit form={form} /> : <ProjectInfoView project={project} />}
    </SectionCard>
  );
};
