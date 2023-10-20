import styled from "styled-components";
import {Container} from "../Songs/Songs";

const Form = styled.form`
  width: auto;
  height: auto;
  background: -webkit-linear-gradient(#eee, #000, #eee, #000, #eee, #000));
`;
const Input = styled.input`
  background: -webkit-linear-gradient(#eee, #000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: auto;
  height: 48px;
  font-size: 33px;
  margin-top: 12px;
  margin-bottom: 12px;
`;
export const Settings = () => {
  return (
    <Container>
      <Form>
        <div>
          <Input placeholder="Discogs User" />
        </div>
        <div>
          <Input placeholder="Youtube User" />
        </div>
      </Form>
    </Container>
  );
};
