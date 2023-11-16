import styled from "styled-components";

const StyledButton = styled.div`
  margin: auto;
  padding: auto;
  margin-left: 2px;
  margin-right: 23px;
  background: transparent;
  cursor: pointer;
  border: 0px;
`;

const Svg = styled.svg` 
    stroke: currentColor
    fill: currentColor
    stroke-width: 0
    version: 1.1
    viewBox: 0 0 16 16
    height: 40px
    width: 40px
    xmlns: http://www.w3.org/2000/svg
`;

export enum ButtonType {
  NEXT,
  PREV,
  START,
  PAUSE,
}

export default function Button(
  buttonType: ButtonType,
  handleEvent: Function,
  args?: any,
) {
  const createButton = () => {
    switch (buttonType) {
      case ButtonType.PREV:
        return (
          <StyledButton onClick={handleEvent}>
            <Svg>
              <path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"></path>
              <path d="M7 8l4-3v6z"></path>
              <path d="M5 5h2v6h-2v-6z"></path>
            </Svg>
          </StyledButton>
        );
      case ButtonType.PAUSE:
        return (
          <StyledButton onClick={() => handleEvent(args)}>
            <Svg>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"></path>
            </Svg>
          </StyledButton>
        );
      case ButtonType.START:
        return (
          <StyledButton onClick={() => handleEvent(args)}>
            <Svg>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
            </Svg>
          </StyledButton>
        );
      case ButtonType.NEXT:
        return (
          <StyledButton onClick={() => handleEvent(args)}>
            <Svg>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
            </Svg>
          </StyledButton>
        );
      default:
        return <></>;
    }
  };
  return createButton();
}
