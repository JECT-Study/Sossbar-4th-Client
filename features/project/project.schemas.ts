import { z } from 'zod';

import {
  PROJECT_FIELD_MAX_LENGTH,
  PROJECT_IMAGE_ACCEPT,
  PROJECT_IMAGE_MAX_SIZE,
  PROJECT_POSITIONS_MAX_SELECT,
  PROJECT_POSITION_VALUES,
} from './project.constants';

const imageMimeTypes = PROJECT_IMAGE_ACCEPT.split(',');

const isFile = (value: unknown): value is File => typeof File !== 'undefined' && value instanceof File;
const isDate = (value: unknown): value is Date => value instanceof Date && !Number.isNaN(value.getTime());

export const CreateProjectFormSchema = z
  .object({
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
    projectPositions: z
      .array(z.enum(PROJECT_POSITION_VALUES))
      .min(1, { message: '직군을 1개 이상 선택해 주세요.' })
      .max(PROJECT_POSITIONS_MAX_SELECT, {
        message: `직군은 최대 ${PROJECT_POSITIONS_MAX_SELECT}개까지 선택할 수 있어요.`,
      }),
    startDate: z
      .custom<Date | null>((value) => value === null || isDate(value), { message: '시작일을 선택해 주세요.' })
      .refine((date) => date !== null, { message: '시작일을 선택해 주세요.' }),
    endDate: z
      .custom<Date | null>((value) => value === null || isDate(value), { message: '종료일을 선택해 주세요.' })
      .refine((date) => date !== null, { message: '종료일을 선택해 주세요.' }),
    image: z
      .custom<File | null>((value) => value === null || isFile(value), { message: '이미지 파일을 선택해 주세요.' })
      .refine((file) => file !== null, { message: '이미지를 첨부해 주세요.', abort: true })
      .refine((file) => imageMimeTypes.includes(file.type), {
        message: 'JPG, JPEG, PNG 이미지만 업로드할 수 있습니다.',
      })
      .refine((file) => file.size <= PROJECT_IMAGE_MAX_SIZE, {
        message: '이미지는 5MB 이하로 업로드해 주세요.',
      }),
    projectUrl: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || /^https?:\/\//i.test(value), {
        message: 'http:// 또는 https://로 시작하는 URL을 입력해 주세요.',
      })
      .refine((value) => value.length === 0 || z.string().url().safeParse(value).success, {
        message: '올바른 URL 형식이 아닙니다.',
      }),
    projectUrlType: z.literal('LINK'),
  })
  .refine(({ startDate, endDate }) => startDate === null || endDate === null || startDate <= endDate, {
    message: '종료일은 시작일 이후로 선택해 주세요.',
    path: ['endDate'],
  });

export const UpdateProjectFormSchema = z
  .object({
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
    startDate: z
      .custom<Date | null>((value) => value === null || isDate(value), { message: '시작일을 선택해 주세요.' })
      .refine((date) => date !== null, { message: '시작일을 선택해 주세요.' }),
    endDate: z
      .custom<Date | null>((value) => value === null || isDate(value), { message: '종료일을 선택해 주세요.' })
      .refine((date) => date !== null, { message: '종료일을 선택해 주세요.' }),
    projectUrl: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || /^https?:\/\//i.test(value), {
        message: 'http:// 또는 https://로 시작하는 URL을 입력해 주세요.',
      })
      .refine((value) => value.length === 0 || z.string().url().safeParse(value).success, {
        message: '올바른 URL 형식이 아닙니다.',
      }),
    projectUrlType: z.literal('LINK'),
  })
  .refine(({ startDate, endDate }) => startDate === null || endDate === null || startDate <= endDate, {
    message: '종료일은 시작일 이후로 선택해 주세요.',
    path: ['endDate'],
  });
