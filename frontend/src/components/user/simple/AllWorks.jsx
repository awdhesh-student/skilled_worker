import React, { useEffect, useState } from 'react'
import { Tooltip, Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
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


const AllWorks = () => {
   const [allWorks, setAllWorks] = useState([])

   const allProblems = async () => {
      try {
         const res = await axiosInstance.get('/api/user/allproblems', {
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

   const makeRegularDateTime = (datetime) => {
      const regularDateTime = new Date(datetime).toLocaleString();
      return regularDateTime
   }

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Problem ID</StyledTableCell>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell align="left">Comment</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="left">Created at</StyledTableCell>
                  <StyledTableCell align="left">Assigned to</StyledTableCell>
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
                              {work.comment}
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              {work.status}
                           </StyledTableCell >
                           <StyledTableCell component="th" scope="row">
                              {makeRegularDateTime(work.createdAt)}
                           </StyledTableCell >
                           <StyledTableCell>
                              

                              {work.assigned === null ? null :
                                 <Tooltip title="Add" arrow>
                                    <Button>{work.assigned}</Button>
                                 </Tooltip>
                              }
                           </StyledTableCell>

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

export default AllWorks

