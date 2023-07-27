import { databases } from "@/appwrite";



export const getTodosGroupbyColumn = async () => {
  const data = await databases.listDocuments(
    "64bb9391327d697e9976",
    "64bb939d116876880015"
  );

  const todos = data.documents;

  const columns = todos.reduce( (acc : any, todo : any)  => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>);



  //if columns does not have inprogress, todo, done, add them with empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  //sort columns by columnType
  const sortedColumns  = new Map(
    Array.from(columns.entries()).sort(
        (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns as Map <TypedColumn, Column>
  }

  return board;

};
