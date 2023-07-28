import {ID, storage} from "@/appwrite"

const uploadImage =async (file :File) => {
    if(!file) return

    const fileUpload = await storage.createFile(
        "64bb96298f9b96d7f549",
        ID.unique(),
        file
    )
    return fileUpload
}


export default uploadImage