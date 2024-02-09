import styled from "styled-components";
import {Container} from "../Songs/Songs";
import React, {useState} from "react";
import {Droppable} from "../Droppable/Droppable";
import {DndContext} from '@dnd-kit/core';
import {Draggable} from "../Draggable/Draggable";

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

  const [parent, setParent] = useState(null);
  const draggable = (
    <Draggable id="draggable">
      Go ahead, drag me.
    </Draggable>
  );
  return (
    <Container>
      <DndContext onDragEnd={handleDragEnd}>
        {!parent ? draggable : null}
        <DndContext onDragEnd={handleDragEnd}>
          {!parent ? draggable : null}
          <Droppable id="droppable">
            {parent === "droppable" ? draggable : 'Drop here'}
          </Droppable>
        </DndContext>
      </DndContext>
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
  function handleDragEnd({over}) {
    console.log("over", over);
    setParent(over ? over.id : null);
  }
};
