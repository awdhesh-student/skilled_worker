import React, { useEffect, useState } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
import axiosInstance from '../common/AxiosInstance';
import { message } from 'antd';
import { Modal } from 'react-bootstrap';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   // hide last border
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const AdminHome = () => {
   const [allUsers, setAllUsers] = useState([])
   const [show, setShow] = useState(false);

   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   const getAllUsers = async () => {
      try {
         const res = await axiosInstance.get('/api/admin/getallusers', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
         })

         if (res.data.success) {
            setAllUsers(res.data.users)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      getAllUsers()
   }, [])

   const changeType = async (userId) => {
      try {
         const res = await axiosInstance.post(`/api/admin/changetype/${userId}`, null, {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
         })

         if (res.data.success) {
            message.success(res.data.message)
            getAllUsers()
         }
         else {
            message.error(res.data.message)
         }
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>User ID</StyledTableCell>
                  <StyledTableCell align="left">User Name</StyledTableCell>
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Type</StyledTableCell>
                  <StyledTableCell align="left">Details</StyledTableCell>
                  <StyledTableCell align="center">Change Type</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {
                  allUsers.length > 0 ? (
                     allUsers.map((user) => (
                        <StyledTableRow key={user._id}>
                           <StyledTableCell component="th" scope="row">
                              {user._id}
                           </StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              {user.name}
                           </StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              {user.email}
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              {user.type}
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              {user.request === "yes" ? <>
                                 <Button onClick={handleShow}>
                                    Worker Info
                                 </Button>

                                 <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                       <Modal.Title>User Details</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                       <h6>Specialized as: {user.work_description.specialized}</h6>
                                       <h6>Expereince : {user.work_description.experience}</h6>
                                       <h6>Address : {user.work_description.address}</h6>
                                       <h6>Phone Number : {user.work_description.phoneNumber}</h6>
                                    </Modal.Body>
                                    <Modal.Footer>
                                       <Button variant="secondary" onClick={handleClose}>
                                          Close
                                       </Button>
                                    </Modal.Footer>
                                 </Modal>
                              </> : null}

                           </StyledTableCell >
                           <StyledTableCell align='center' component="th" scope="row">
                              {user.request === 'yes' ? <Button
                                 onClick={() => changeType(user._id)}
                                 color='info'
                              >
                                 Change
                              </Button> : null}
                           </StyledTableCell >
                        </StyledTableRow>
                     )))
                     :
                     (<p className='px-2'>No user found</p>)
               }
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default AdminHome
