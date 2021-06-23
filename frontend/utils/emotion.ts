import { css } from '@emotion/core'

export const lineCramp = (count: number) => {
  return css`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${count};
    overflow: hidden;
  `
}
