import { useState } from 'react'
import { useMutate } from 'restful-react'

const UploadProfilePicture = ({ user_id }) => {
  const [selectedImage, setSelectedImage] = useState()

  const { mutate: uploadImage } = useMutate({
    verb: 'POST',
    path: 'http://localhost:8000/profile/updateProfilePicture'
  })

  const handleChange = event => {
    setSelectedImage(event.target.files[0])
  }

  console.log('user_id', user_id)

  const handleImageUpload = () => {
    if (!selectedImage) {
      return
    }
    const formData = new FormData()
    formData.append('user_id', user_id)
    formData.append('avatar', selectedImage)

    uploadImage(formData)
      .then(uploadedImage => {
        console.log('uploadedImage', uploadedImage)
      })
      .catch(console.log('Oooops, something went wrong!'))
  }

  return (
    <>
      <h1>Upload Profile Image</h1>
      <input
        onChange={handleChange}
        accept=".jpg, .png, .jpeg"
        className="fileInput mb-2"
        type="file"
      ></input>
      <div>
        <button
          onClick={handleImageUpload}
          disabled={!selectedImage}
          className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          Upload Profile Picture
        </button>
      </div>
    </>
  )
}

export default UploadProfilePicture
