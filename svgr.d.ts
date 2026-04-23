import type { FC, SVGProps } from 'react';

declare module '*.svg' {
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  // eslint-disable-next-line import/no-default-export
  export default ReactComponent;
}
