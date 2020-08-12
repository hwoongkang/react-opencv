import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
`;

export const StyledVideo = styled.video`
  max-width: 600px;
  display: none;
`;

export const StyledCanvas = styled.canvas`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;
