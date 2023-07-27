
"use client"
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd";

type Props = {
    todo: Todo;
    index:number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}

const TodoCard = ({todo, index, id, innerRef, draggableProps, dragHandleProps  } : Props) => {


  const [deleteTask] =  useBoardStore((state)=>[
    state.deleteTask
  ])
  return (

    


    <div className="bg-white rounded-md space-y-2 drop-shadow-md p-2"   

      {...draggableProps}
      {...dragHandleProps}
      ref={(innerRef)}
    
    > 

         <div className="flex justify-between items-center p-2">
            <p>{todo.title}</p>
            <button className="text-red-400 hover:text-red-500" onClick={() => deleteTask(index,todo,id)}>
                <XCircleIcon className="ml-5 h-8 w-8" />
            </button>
         </div>
    </div>
  )
}

export default TodoCard