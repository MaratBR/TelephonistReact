import { maybeCSSVariable } from '@coreui/utils';
import styled from '@emotion/styled';

type PaddedProps = {
  thickness?: string;
};

const Padded = styled.div<PaddedProps>`
  padding: ${({ thickness }) => maybeCSSVariable(thickness ?? 'lg', 'spacing')};
`;

export default Padded;
