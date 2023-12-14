import React, { useState } from 'react'
import axiosInstance from '../../common/AxiosInstance'
import { message } from 'antd'

const SimpleUser = () => {
   const [problem, setProblem] = useState({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      comment: "",
      file: ""
   })

   const handleChange = (e) => {
      const { name, value } = e.target
      setProblem({ ...problem, [name]: value })
   }

   const handleDocumentChange = (e) => {
      const file = e.target.files[0];
      setProblem({ ...problem, file: file });
   };

   const handleSubmit = async (e) => {
      e.preventDefault()

      const formData = new FormData()
      formData.append('name', problem.name)
      formData.append('address', problem.address)
      formData.append('city', problem.city)
      formData.append('state', problem.state)
      formData.append('pincode', problem.pincode)
      formData.append('phone', problem.phone)
      formData.append('comment', problem.comment)
      formData.append('file', problem.file)

      try {
         const res = await axiosInstance.post(`/api/user/sendcomplaint`, formData, {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
               "Content-Type": "multipart/form-data"
            },
         })
         if (res.data.success) {
            message.success(res.data.message)
         }
         else {
            message.error(res.data.message)
         }
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <div className="text-white complaint-box">
         <form onSubmit={handleSubmit} className="compliant-form row bg-dark">

            <div className="col-md-6 p-3 p-3">
               <label htmlFor="name" className="form-label">Name</label>
               <input name="name" onChange={handleChange} value={problem.name} type="text" className="form-control" id="name" required />
            </div>
            <div className="col-md-6 p-3">
               <label htmlFor="address" className="form-label">Address</label>
               <input name="address" onChange={handleChange} value={problem.address} type="text" className="form-control" id="address" required />
            </div>

            <div className="col-md-6 p-3">
               <label htmlFor="city" className="form-label">City</label>
               <input name="city" onChange={handleChange} value={problem.city} type="text" className="form-control" id="city" required />
            </div>
            <div className="col-md-6 p-3">
               <label htmlFor="state" className="form-label">State</label>
               <input name="state" onChange={handleChange} value={problem.state} type="text" className="form-control" id="state" required />
            </div>

            <div className="col-md-6 p-3">
               <label htmlFor="pincode" className="form-label">Pincode</label>
               <input name="pincode" onChange={handleChange} value={problem.pincode} type="number" className="form-control" id="pincode" required />
            </div>

            <div className="col-md-6 p-3">
               <label htmlFor="phone" className="form-label">phone</label>
               <input name="phone" onChange={handleChange} value={problem.phone} type="number" className="form-control" id="pincode" required />
            </div>

            <div className="col-md-6 p-3">
               <label htmlFor="file" className="form-label">Image</label>
               <input name="file" accept='images/*' type="file" onChange={handleDocumentChange} className="form-control" id="file" required />
            </div>

            <label className=" p-3form-label text-light" htmlFor="comment">Descrption</label>
            <div className="form-floating">
               <textarea name="comment" onChange={handleChange} value={problem.comment} className="form-control" required></textarea>
            </div>
            <div className="text-center p-1 col-12">
               <button type="submit" className="mt-2 btn btn-success">Send</button>
            </div>
         </form>
      </div>
   )
}

export default SimpleUser
