import { z } from 'zod';

import { PROJECT_FIELD_MAX_LENGTH, PROJECT_IMAGE_ACCEPT, PROJECT_IMAGE_MAX_SIZE } from './project.constants';

const imageMimeTypes = PROJECT_IMAGE_ACCEPT.split(',');

const isFile = (value: unknown): value is File => typeof File !== 'undefined' && value instanceof File;

export const CreateProjectFormSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, { message: '프로젝트명을 입력해 주세요.' })
    .max(PROJECT_FIELD_MAX_LENGTH, `프로젝트명은 ${PROJECT_FIELD_MAX_LENGTH}자 이하로 입력해 주세요.`),
  host: z
    .string()
    .trim()
    .min(1, { message: '주최사를 입력해 주세요.' })
    .max(PROJECT_FIELD_MAX_LENGTH, `주최사는 ${PROJECT_FIELD_MAX_LENGTH}자 이하로 입력해 주세요.`),
  image: z
    .custom<File | null>((value) => value === null || isFile(value), { message: '이미지 파일을 선택해 주세요.' })
    .refine((file) => file !== null, { message: '이미지를 첨부해 주세요.', abort: true })
    .refine((file) => imageMimeTypes.includes(file.type), {
      message: 'JPG, JPEG, PNG 이미지만 업로드할 수 있습니다.',
    })
    .refine((file) => file.size <= PROJECT_IMAGE_MAX_SIZE, {
      message: '이미지는 5MB 이하로 업로드해 주세요.',
    }),
});

export const UpdateProjectFormSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, { message: '프로젝트명을 입력해 주세요.' })
    .max(PROJECT_FIELD_MAX_LENGTH, `프로젝트명은 ${PROJECT_FIELD_MAX_LENGTH}자 이하로 입력해 주세요.`),
  host: z
    .string()
    .trim()
    .min(1, { message: '주최사를 입력해 주세요.' })
    .max(PROJECT_FIELD_MAX_LENGTH, `주최사는 ${PROJECT_FIELD_MAX_LENGTH}자 이하로 입력해 주세요.`),
  image: z
    .custom<File | null>((value) => value === null || isFile(value), { message: '이미지 파일을 선택해 주세요.' })
    .refine((file) => file === null || imageMimeTypes.includes(file.type), {
      message: 'JPG, JPEG, PNG 이미지만 업로드할 수 있습니다.',
    })
    .refine((file) => file === null || file.size <= PROJECT_IMAGE_MAX_SIZE, {
      message: '이미지는 5MB 이하로 업로드해 주세요.',
    }),
});
