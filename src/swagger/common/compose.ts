import { applyDecorators } from '@nestjs/common';

export type DecoratorArg = Parameters<typeof applyDecorators>[number];

export function composeMethod(
  ...decorators: DecoratorArg[]
): ReturnType<typeof applyDecorators> {
  return applyDecorators(...decorators);
}

export function composeClass(
  ...decorators: DecoratorArg[]
): ReturnType<typeof applyDecorators> {
  return applyDecorators(...decorators);
}

export function composeMethodGroups(
  groups: DecoratorArg[][],
): ReturnType<typeof applyDecorators> {
  const flat: DecoratorArg[] = [];
  for (const group of groups) {
    for (const d of group) {
      flat.push(d);
    }
  }
  return applyDecorators(...flat);
}
