"use client"
import {DragDropContext, Droppable} from 'react-beautiful-dnd'
import {useEffect} from 'react'
const Board = () => {


  useEffect (() =>{
    
  })


  return (
    <DragDropContext>
        <Droppable droppableId='board' direction='horizontal' type='column'>
        {
            (provided) => <div></div>
        }
        </Droppable>

    </DragDropContext>
  )
}

export default Board