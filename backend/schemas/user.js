export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'userName',
      title: 'userName',
      type: 'string',
    },
    {
      name: 'image',
      title: 'image',
      type: 'string',
    },
  ],
}
//So, the schema  provided defines a "user" document type in Sanity with two fields: "userName" and "image". 
//Each field is of type "string"