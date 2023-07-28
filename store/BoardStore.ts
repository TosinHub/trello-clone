import { databases, storage, ID } from '@/appwrite';
import Column from '@/components/Column';
import { getTodosGroupbyColumn } from '@/lib/getTodosGroupbyColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: ()=> void;
    setBoardState: (board : Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

    searchString: string;
    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;

    setImage: (image: File | null) => void
    setNewTaskType: (columnId : TypedColumn) => void
    setNewTaskInput: (input: string) => void;
    setSearchString: (searchString: string) => void;


    addTask: (todo: string, columnId: TypedColumn, image?: File | null ) => void
    deleteTask: (taskIndex: number, todoId: Todo, id:TypedColumn) => void;


}

export const useBoardStore = create<BoardState>((set, get) => ({
   board: {
    columns: new Map<TypedColumn, Column>()
   },
   searchString: "",
   newTaskInput: "",
   newTaskType: "todo",
   image: null,
   
   setNewTaskInput: (input: string) => set({newTaskInput: input}),
   setSearchString: (searchString) => set({searchString}),
   setNewTaskType: (ColumnId: TypedColumn) => set({newTaskType: ColumnId}),
   setImage: (image: File | null) =>set({image}),

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
   },
   addTask: async (todo: string, columnId: TypedColumn, image?: File | null ) => {

    let file: Image | undefined
    if(image){
        const fileUpload = await uploadImage(image);
        if(fileUpload){
            file = {
                bucketId: fileUpload.bucketId,
                fileId: fileUpload.$id
            }
        }
    }

  const {$id}  =  await databases.createDocument(
        "64bb9391327d697e9976",
        "64bb939d116876880015",
        ID.unique(),
        {
            title: todo,
            status: columnId,
            //include image if it exist

            ...(file &&  {image: JSON.stringify(file)})
        }
    )

    set({newTaskInput : ""})

    set((state) => {
        const newColumns = new Map(state.board.columns)
        const newTodo: Todo = { 
            $id, 
            $createdAt: new Date().toISOString(),
            title: todo,
            status: columnId,
            //if image
            ...$id(file && {image: file})
        }

        const column = newColumns.get(columnId)

        if(!column) {
            newColumns.set(columnId, {
                id: columnId,
                todos: [newTodo]
            })
        }else{
            newColumns.get(columnId)?.todos.push(newTodo)
        }

        return {
            board : {
                columns : newColumns
            }
        }
    })

   }

}))

