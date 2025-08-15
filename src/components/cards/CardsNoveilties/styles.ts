import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledEllipsisText = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  padding: 0 0 2px 0;
`;

export const StyledUserImage = styled.img`
  width: 22px;
  height: 22px;
  border: 0.5px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  border-radius: 50%;
  object-fit: cover;
`;
