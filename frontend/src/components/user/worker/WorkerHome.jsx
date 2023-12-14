import React, { useEffect, useState } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
import axiosInstance from '../../common/AxiosInstance';

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

const WorkerHome = () => {
   const [allWorks, setAllWorks] = useState([])

   const allProblems = async () => {
      try {
         const res = await axiosInstance.get('/api/user/worker/allproblems', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
         })

         if (res.data.success) {
            setAllWorks(res.data.allProblems)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      allProblems()
   }, [])

   const handleDownload = async (url, problemId) => {
      try {
         const res = await axiosInstance.get('/api/user/worker/getfiledownload', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            params: { problemId },
            responseType: 'blob'
         });
         if (res.data) {
            const fileUrl = window.URL.createObjectURL(new Blob([res.data], { "type": "application/pdf" }));
            const downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            downloadLink.setAttribute("href", fileUrl);

            // Extract the file name from the url parameter
            const fileName = url.split("/").pop(); // Assuming the URL is in the format "uploads/document.pdf"

            // Set the file name for the download
            downloadLink.setAttribute("download", fileName);
            downloadLink.style.display = "none";
            downloadLink.click();
         } else {
            message.error(res.data.error);
         }
      } catch (error) {
         console.log(error);
         message.error('Something went wrong');
      }
   };

   const changeStatus = async (problemID) => {
      try {
         const res = await axiosInstance.post(`/api/user/worker/changestatus/${problemID}`,null, {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
         })
         if (res.data.success) {
            message.success(res.data.message);
            allProblems()
         }
         else {
            message.error(res.data.message);
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
                  <StyledTableCell>Problem ID</StyledTableCell>
                  <StyledTableCell align="left">User Name</StyledTableCell>
                  <StyledTableCell align="left">Full Address</StyledTableCell>
                  <StyledTableCell align="left">Phone</StyledTableCell>
                  <StyledTableCell align="left">Comment</StyledTableCell>
                  <StyledTableCell align="left">File</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {
                  allWorks.length > 0 ? (
                     allWorks.map((work) => (
                        <StyledTableRow key={work._id}>
                           <StyledTableCell component="th" scope="row">
                              {work._id}
                           </StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              {work.name}
                           </StyledTableCell>
                           <StyledTableCell style={{ maxWidth: '300px' }} component="th" scope="row">
                              {work.address + ", " + work.city + ", " + work.pincode}
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              {work.phone}
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              {work.comment}
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              <p style={{ cursor: 'pointer', color: 'blue'}} onClick={() => handleDownload(work.file.path, work._id)}>{work.file.name}</p>
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              <Button onClick={() => changeStatus(work._id)}>{work.status}</Button>
                           </StyledTableCell >
                        </StyledTableRow>
                     )))
                     :
                     (<p className='px-2'>No work found</p>)
               }
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default WorkerHome
