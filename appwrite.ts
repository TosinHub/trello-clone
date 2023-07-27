import {Account, Client, Databases, Storage, ID} from 'appwrite'



const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
    .setProject("64bb8eb6b2aa000f2e83");


const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)


export { client, account, databases, storage, ID}