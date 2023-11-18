import useSupabase from "src/boot/supabase"
import useAuthUser from "./UseAuthUser"
import { uid } from "quasar"
import { decode } from 'base64-arraybuffer'
import { ref } from 'vue';


export default function useApi() {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()

  const list = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')

    if (error) {
      throw error
    }

    return data
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
    if (error) {
      throw error
    }
    return data[0]

  }

  const post = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          ...form,
          user_id: user.value.id
        }
      ])
    if (error) { throw error }
    return data
  }

  const update = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({
        ...form
      })
      .match({ id: form.id })
    if (error) { throw error }
    return data
  }

  const remove = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ id })
    if (error) { throw error }
    return data
  }

  const uploadImg = async (file, storageInput) => {

    // const validExtensions = ['png', 'jpeg', 'jpg'];
    // const fileExtension = fileName.toLowerCase();

    // if (!validExtensions.includes(fileExtension)) {
    //   throw new Error('Formato de arquivo não suportado. Use imagens PNG, JPEG ou JPG.');
    // }

    // const arrayBuffer = decode(base64FileData);

    // // Crie um Blob a partir do ArrayBuffer
    // const blob = new Blob([arrayBuffer], { type: `image/${fileExtension}` });

    // // Crie um objeto FormData para enviar o Blob
    // const formData = new FormData();
    // formData.append('file', blob, fileName);

    // const { data, error } = await supabase.storage
    //   .from(storage)
    //   .upload(fileName, formData, {
    //     contentType: `image/${fileExtension}`,
    //     upsert: false,
    //   });

    // if (error) {
    //   throw error;
    // }

    // const publicUrl = await getUrlPublic(fileName, storage);

    // return publicUrl;

    // const fileName = uid();

    // const validExtensions = ['png', 'jpeg', 'jpg'];
    // const fileExtension = fileName.split('.').pop().toLowerCase();

    // if (!validExtensions.includes(fileExtension)) {
    //   throw new Error('Formato de arquivo não suportado. Use imagens PNG, JPEG ou JPG.');
    // }
    // const arrayBuffer = decode(base64FileData);

    // // Create a Blob from the ArrayBuffer
    // const blob = new Blob([arrayBuffer], { type: 'image/png' });

    // // Create a FormData object to send the Blob
    // const formData = new FormData();
    // formData.append('file', blob, fileName);

    // const { data, error } = await supabase.storage
    //   .from(storage)
    //   .upload(fileName, formData, {
    //     contentType: 'image/png', // Set the appropriate content type
    //     upsert: false,
    //   });

    // if (error) {
    //   throw error;
    // }

    // const publicUrl = await getUrlPublic(fileName, storage);

    // return publicUrl;

    const fileName = uid()
    const { error } = supabase
      .storage
      .from(storageInput)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    const publicUrl = await getUrlPublic(fileName, storageInput)
    if (error) {
      throw error
    }

    return publicUrl
  }

  const getUrlPublic = async (fileName, storageInput) => {
    try {
      const publicURL = supabase.storage
        .from(storageInput)
        .getPublicUrl(fileName)
      console.log("public URL dentro do getUrlPublic ", publicURL)
      console.log(publicURL)

      // if (error) {
      //   throw error
      // }
      return publicURL.data.publicUrl
    } catch (error) {
      throw error
      // return null
    }

  }


  return {
    list,
    getById,
    post,
    update,
    remove,
    uploadImg,
  }
}
