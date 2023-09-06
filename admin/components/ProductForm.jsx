import { useState, React, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Cloudinary } from "@cloudinary/url-gen";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";
export default function ProductForm({
  _id,
  title: existingtitle,
  description: existingdescription,
  price: existingprice,
  images: existingimages,
  category:assignedcategory,
  technicalSheet:assignedtechnicalSheet,
}) {
  const [title, setTitle] = useState(existingtitle || "");
  const [description, setDescription] = useState(existingdescription || "");
  const [price, setPrice] = useState(existingprice || "");
  const [goBack, setGoBack] = useState(false);
  const router = useRouter();
  const [categories,setCategories]=useState('')
  const [category,setCategory]=useState(assignedcategory || '');
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState(existingimages || "");
  const [technicalSheet,setTechnicalSheet]=useState(assignedtechnicalSheet||'')
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/Categories');
      setCategories(response.data.allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  function updateImagesorder(images){
    setImages(images)
  }
  function getPublicIdFromImageUrl(imageUrl) {
    const parts = imageUrl.split("/");
    const publicIdIndex = parts.findIndex((part) => part === "image") + 1;
    return parts[publicIdIndex];
  }
  
  async function saveProduct(ev) {
    ev.preventDefault();
    
    if (!title || !price) {
      alert("Please fill in the title and price fields");
      return;
    }
   
    const data = { 
      title, description, price, images,
      category: category || null,
      technicalSheet,
    };
    if (_id) {
      await axios.put("/api/Products", { ...data, _id });
    } else {
      await axios.post("/api/Products", data);
    }
    setGoBack(true);
  }

  if (goBack) {
    router.push("/Products");
  }

  async function uploadImage(ev) {
    const files = ev.target.files?.[0];
    if (!files) return;

    if (!files.type.includes("image")) {
      alert("Please upload an image!");
      return;
    }
    setIsUploading(true);
    const data = new FormData();
    data.append("file", files);
    data.append("upload_preset", "shop-upload-image");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dzviiebsw/image/upload",
        data
      );
      const imageUrl = response.data.secure_url; 
      setImages([...images, imageUrl]); 
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploading(false);
  }

  

  
    
    
  return (
    <form
    onSubmit={saveProduct}
      action=""
      className="text-white flex flex-col gap-1 flex-grow "
    >
      
      <label>Product name</label>
      <input
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        type="text"
        placeholder="Product Name"
      />
      {title === "" && <p className="error-message">Title is required</p>}
      <label>Technical Sheet</label>
<textarea
  type="text"
  value={technicalSheet} // Make sure this value matches the state variable name
  placeholder="separate with:-| example:size:14 - battery:5000ma"
  onChange={(ev) => setTechnicalSheet(ev.target.value)}
/>

      <label >Category</label>
      <select value={category} onChange={ev=>setCategory(ev.target.value)} className="ml-0">
        <option value=''>Uncategorized</option>
        {categories.length > 0  && categories.map((category) => (
          <option value={category._id} key={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      
      
      
      <label className="text-xl mt-1 mb-2">Photos</label>
      <div className="flex gap-2">
        {!!images?.length && (
          
            <ReactSortable list={images} setList={updateImagesorder} className="flex flex-wrap gap-2 ">
              {images.map((imageUrl, index) => (
                <div key={imageUrl} className="image-container h-36 relative">
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-36 h-36 object-cover rounded-md cursor-pointer"
                    key={imageUrl}
                  />
                 
                </div>
              ))}
            </ReactSortable>
          
        )}
        <label className="cursor-pointer w-36 h-36 bg-gray-400 flex items-center justify-center  gap-1 rounded-lg ml-2 border border-gray-300">
          {isUploading ? (
            <Spinner />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          )}
          <input type="file" className="hidden " onChange={uploadImage} />
          {isUploading ? <h3>Uploading</h3> : <h3>Upload</h3>}
        </label>
      </div>

      <label>Description</label>
      <textarea
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
        placeholder="Description"
      ></textarea>
      <label>Price Da</label>
      <input
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
        type="number"
        placeholder="Price"
      />
      {price === "" && <p className="error-message">Price is required</p>}

      <div className="flex justify-end w-4/6">
        <button
          type="submit"
          className="p-3 bg-green-700 my-1  rounded-lg w-1/5 text-xl shadow-md"
        >
          Save
        </button>
      </div>
    </form>
  );
}
