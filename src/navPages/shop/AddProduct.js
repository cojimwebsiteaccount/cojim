import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import product_placeholder from 'img/product-placeholder.svg';
import Alert from 'components/Alert';
import ProgressBar from 'components/ProgressBar';

const AddProduct = () => {
    // state for storing uploaded image 
    const [selectedImage, setSelectedImage] = useState(product_placeholder);
    const [thumbnailFile, setThumbnailFile] = useState(product_placeholder);
    const [thumbnailFileReaderResult, setThumbnailFileReaderResult] = useState();

    // states for storing form data
    const [formInputData, setFormInputData] = useState({
        productName: '', description: '', category: '', language: '', sellingPrice: '', quantity: '',
        unitOfMeasurement: '', status: 'available'
    });
    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErroMsg] = useState("");

    /**
     * Handle image upload, replace the placeholder
     * image with the uploaded image
     */
    const handleSelectImage = (e) => {
        let imageFile = e.target.files[0];
        setSelectedImage(URL.createObjectURL(imageFile));
        setThumbnailFile(imageFile);
    }

    const handleFormInput = (e) => {
        setFormInputData({
            ...formInputData,
            [e.target.name]: e.target.value
        });
    }

    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // make sure none of the inputs is empty
        if (formInputData.productName === '' ||
            formInputData.language === '' || formInputData.category === '' ||
            formInputData.sellingPrice === '' || formInputData.quantity === '') {
            setErroMsg("Please fill all the required fields");
            setError(true);
            return false;
        }

        if (thumbnailFile === product_placeholder) {
            setErroMsg("Please select a product thumbnail");
            setError(true);
            return false;
        }

        setError(false);
        setSubmitted(true);

        // send form data as post request to the server
        (async () => {
            const rawResponse = await fetch('/api/product/add-product', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formInputData,
                    thumbnailFile: thumbnailFileReaderResult,
                })
            });
            const content = await rawResponse.json();
            // stop the progress bar
            setSubmitted(false);
            // check if there is an error in the response
            if (content.error) {
                setErroMsg(content.message);
                setError(true);
            } else {
                setFormInputData({
                    ...formInputData,
                    productName: '', description: '', category: '', language: '', sellingPrice: '', quantity: '',
                    unitOfMeasurement: '', status: 'available'
                });
                Swal.fire({
                    title: 'Success!',
                    text: content.message,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
            }
        })();
    }

    useEffect(() => {
        if (thumbnailFile === product_placeholder) {
            return;
        }

        const thumbnailFileReader = new FileReader();
        thumbnailFileReader.readAsDataURL(thumbnailFile);
        thumbnailFileReader.onloadend = () => {
            setThumbnailFileReaderResult(thumbnailFileReader.result);
        };
        thumbnailFileReader.onerror = () => {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong with the uploaded passport photo',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thumbnailFile]);

    return (
        <>
            <div className="w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                <div className="grid  gap-8 grid-cols-1">
                    <div className="flex flex-col ">
                        <div className="form">
                            {
                                // show the alert message if the fields are left empty
                                (error) ? (
                                    <Alert errorMsg={errorMsg} color="red" />
                                ) : ""
                            }
                            {
                                // show the progress bar if data is submited and being processed
                                (submitted) ? (
                                    <div className="bg-gray-900">
                                        <ProgressBar />
                                    </div>
                                ) : ""
                            }
                            <div className="md:space-y-2 mb-3">
                                <label className="text-xs font-semibold text-gray-600 py-2">Product thumbnail<abbr className="hidden" title="required">*</abbr></label>
                                <div className="flex items-center py-6">
                                    <div className="w-12 h-12 mr-4 flex-none rounded-xl border overflow-hidden">
                                        <img className="w-12 h-12 mr-4 object-cover" src={selectedImage} alt="Avatar Upload" />
                                    </div>
                                    <label className="cursor-pointer ">
                                        <span className="focus:outline-none text-white text-sm py-2 px-4 rounded-full bg-blue-400 hover:bg-blue-500 hover:shadow-lg">Browse</span>
                                        <input onChange={handleSelectImage} type="file" className="hidden" multiple="multiple" accept="accept" />
                                    </label>
                                </div>
                            </div>
                            <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                <div className="mb-3 space-y-2 w-full text-xs">
                                    <label className="font-semibold text-gray-600 py-2">Product  Name <abbr title="required">*</abbr></label>
                                    <input onChange={handleFormInput} placeholder="Product Name" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" required="required" type="text" name="productName" />
                                    <p className="text-red text-xs hidden">Please fill out this field.</p>
                                </div>
                                <div className="mb-3 space-y-2 w-full text-xs">
                                    <label className="font-semibold text-gray-600 py-2">Language <abbr title="required">*</abbr></label>
                                    <input onChange={handleFormInput} placeholder="Message or Book language" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" required="required" type="text" name="language" />
                                    <p className="text-red text-xs hidden">Please fill out this field.</p>
                                </div>
                                <div className="mb-3 space-y-2 w-full text-xs">
                                    <label className="font-semibold text-gray-600 py-2">Selling Price <abbr title="required">*</abbr></label>
                                    <input onChange={handleFormInput} placeholder="Selling Price" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" required="required" type="text" name="sellingPrice" />
                                    <p className="text-red text-xs hidden">Please fill out this field.</p>
                                </div>
                                <div className="mb-3 space-y-2 w-full text-xs">
                                    <label className="font-semibold text-gray-600 py-2">Quantity <abbr title="required">*</abbr></label>
                                    <input onChange={handleFormInput} placeholder="Quantity" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" required="required" type="text" name="quantity" />
                                    <p className="text-red text-xs hidden">Please fill out this field.</p>
                                </div>
                            </div>
                            <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                <div className="w-full flex flex-col mb-3">
                                    <label className="font-semibold text-gray-600 py-2">Unit</label>
                                    <input onChange={handleFormInput} placeholder="Unit of measurement" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" type="text" name="unitOfMeasurement" />
                                </div>
                                <div className="w-full flex flex-col mb-3">
                                    <label className="font-semibold text-gray-600 py-2">Category</label>
                                    <select onChange={handleFormInput} className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4 md:w-full " required="required" name="category">
                                        <option value="">Select or type to search categories</option>
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                        <option value="books">Books</option>
                                        <option value="others">Others</option>
                                    </select>
                                    <p className="text-sm text-red-500 hidden mt-3" id="error">Please fill out this field.</p>
                                </div>
                            </div>

                            <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                <label className="font-semibold text-gray-600 py-2">Description</label>
                                <textarea onChange={handleFormInput} required="" name="description" id="" className="min-h-[100px] max-h-[300px] h-28 appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg  py-4 px-4" placeholder="Enter product description" spellCheck="false"></textarea>
                            </div>
                            {/* <p className="text-xs text-red-500 text-right my-3">Required fields are marked with an
                                asterisk <abbr title="Required field">*</abbr></p> */}
                            <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                                <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"> Cancel </button>
                                <button onClick={handleSubmit} className="mb-2 md:mb-0 bg-blue-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-blue-500">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProduct;