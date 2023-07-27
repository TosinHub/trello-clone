import { databases, storage } from '@/appwrite';
import Column from '@/components/Column';
import { getTodosGroupbyColumn } from '@/lib/getTodosGroupbyColumn';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: ()=> void;
    setBoardState: (board : Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

    searchString: string;
    newTaskInput: string;
    newTaskType: TypedColumn;

    setNewTaskType: (columnId : TypedColumn) => void
    setNewTaskInput: (input: string) => void;
    setSearchString: (searchString: string) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id:TypedColumn) => void;


}

export const useBoardStore = create<BoardState>((set, get) => ({
   board: {
    columns: new Map<TypedColumn, Column>()
   },
   searchString: "",
   newTaskInput: "",
   newTaskType: "todo",

   setNewTaskInput: (input: string) => set({newTaskInput: input}),
   setSearchString: (searchString) => set({searchString}),
   setNewTaskType: (ColumnId: TypedColumn) => set({newTaskType: ColumnId}),

   getBoard: async ()=> {
    const board = await getTodosGroupbyColumn();
    set({board})
    
   }, 
   setBoardState: (board) => set({board}),

   deleteTask:  async (taskIndex: number, todo: Todo, id: TypedColumn) =>{
        const newColumns = new Map(get().board.columns)
    //delete todoId from new column
        newColumns.get(id)?.todos.splice(taskIndex,1)


        set({board: {columns:newColumns}})
        if(todo.image){
            await storage.deleteFile(todo.image.bucketId,todo.image.fileId)
        }

        await databases.deleteDocument(
            "64bb9391327d697e9976",
            "64bb939d116876880015",
            todo.$id
        )
   },

   updateTodoInDB:async (todo, columnId) => {
        await databases.updateDocument(
            "64bb9391327d697e9976",
            "64bb939d116876880015",
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
   }
}))

