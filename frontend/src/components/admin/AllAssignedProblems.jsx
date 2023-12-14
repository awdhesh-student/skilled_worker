// import React, { useEffect, useState } from 'react'
// import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
// import axiosInstance from '../common/AxiosInstance';
// import { message } from 'antd';
// import Dropdown from 'react-bootstrap/Dropdown';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//    [`&.${tableCellClasses.head}`]: {
//       backgroundColor: theme.palette.common.black,
//       color: theme.palette.common.white,
//    },
//    [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//    },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//    '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//    },
//    // hide last border
//    '&:last-child td, &:last-child th': {
//       border: 0,
//    },
// }));

// const AllAssignedProblems = () => {
//    const [allProblems, setAllProblems] = useState([])
//    const [allWorkers, setAllWorkers] = useState([])
//    const [selectedOption, setSelectedOption] = useState('Select Worker');

//    const allWorks = async () => {
//       try {
//          const res = await axiosInstance.get('/api/admin/getallworks', {
//             headers: {
//                'Authorization': `Bearer ${localStorage.getItem("token")}`,
//             },
//          })
//          if (res.data.success) {
//             setAllProblems(res.data.allworks)
//             setAllWorkers(res.data.allworkers)
//          }
//          else {
//             message.error(res.data.message)
//          }
//       } catch (error) {
//          console.log(error)
//       }
//    }

//    useEffect(() => {
//       allWorks()
//    }, [])

//    const makeRegularDateTime = (datetime) => {
//       const regularDateTime = new Date(datetime).toLocaleString();
//       return regularDateTime
//    }

//    // const handleSelect = (eventKey) => {
//    //    setSelectedOption(eventKey);
//    //    setData({ ...data, type: eventKey });
//    // };

//    return (
//       <TableContainer component={Paper}>
//          <Table sx={{ minWidth: 700 }} aria-label="customized table">
//             <TableHead>
//                <TableRow>
//                   <StyledTableCell>Problem ID</StyledTableCell>
//                   <StyledTableCell align="left">User Name</StyledTableCell>
//                   <StyledTableCell align="left">Comment</StyledTableCell>
//                   <StyledTableCell align="left">Status</StyledTableCell>
//                   <StyledTableCell align="left">Created At</StyledTableCell>
//                   <StyledTableCell align="left">All Workers</StyledTableCell>
//                </TableRow>
//             </TableHead>
//             <TableBody>
//                {
//                   allProblems.length > 0 ? (
//                      allProblems.map((problem) => (
//                         <StyledTableRow key={problem._id}>
//                            <StyledTableCell component="th" scope="row">
//                               {problem._id}
//                            </StyledTableCell>
//                            <StyledTableCell component="th" scope="row">
//                               {problem.name}
//                            </StyledTableCell>
//                            <StyledTableCell component="th" scope="row">
//                               {problem.comment}
//                            </StyledTableCell >
//                            <StyledTableCell component="th" scope="row">
//                               {problem.status}
//                            </StyledTableCell >
//                            <StyledTableCell component="th" scope="row">
//                               {makeRegularDateTime(problem.createdAt)}
//                            </StyledTableCell >
//                            <StyledTableCell component="th" scope="row">
//                               <Dropdown className='my-3'>
//                                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
//                                     {selectedOption}
//                                  </Dropdown.Toggle>

//                                  <Dropdown.Menu>
//                                     {allWorkers.map((worker) => (
//                                        <Dropdown.Item>{worker.name}</Dropdown.Item>
//                                     ))}

//                                  </Dropdown.Menu>
//                               </Dropdown>
//                            </StyledTableCell>

//                         </StyledTableRow>
//                      )))
//                      :
//                      (<p className='px-2'>No problem found</p>)
//                }
//             </TableBody>
//          </Table>
//       </TableContainer>
//    )
// }

// export default AllAssignedProblems


import React, { useEffect, useState } from 'react';
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material';
import axiosInstance from '../common/AxiosInstance';
import { message } from 'antd';
import Dropdown from 'react-bootstrap/Dropdown';

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
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const AllAssignedProblems = () => {
   const [allProblems, setAllProblems] = useState([]);
   const [allWorkers, setAllWorkers] = useState([]);
   const [selectedOption, setSelectedOption] = useState('Select Worker');

   const allWorks = async () => {
      try {
         const res = await axiosInstance.get('/api/admin/getallworks', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
         });
         if (res.data.success) {
            const problemsWithWorkers = res.data.allworks.map(problem => ({ ...problem, selectedWorker: '' }));
            setAllProblems(problemsWithWorkers);
            setAllWorkers(res.data.allworkers);
         } else {
            message.error(res.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      allWorks();
   }, []);

   const makeRegularDateTime = (datetime) => {
      const regularDateTime = new Date(datetime).toLocaleString();
      return regularDateTime;
   };

   const handleWorkerSelect = async (index, selectedWorker, workerID, problemID) => {
      const updatedProblems = [...allProblems];
      updatedProblems[index].selectedWorker = selectedWorker;
      setAllProblems(updatedProblems);

      try {
         const res = await axiosInstance.post(`/api/admin/selectworker/${problemID}`, { workerID }, {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
         })

         if (res.data.success) {
            message.info(res.data.message)
            allWorks()

         }
         else {
            message.warning(res.data.message)
         }
      } catch (error) {
         console.log(error)
      }
   };

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Problem ID</StyledTableCell>
                  <StyledTableCell align="left">User Name</StyledTableCell>
                  <StyledTableCell align="left">Comment</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="left">Created At</StyledTableCell>
                  <StyledTableCell align="left">Assigned Worker</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {allProblems.length > 0 ? (
                  allProblems.map((problem, index) => (
                     <StyledTableRow key={problem._id}>
                        <StyledTableCell component="th" scope="row">
                           {problem._id}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {problem.name}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {problem.comment}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {problem.status}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {makeRegularDateTime(problem.createdAt)}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                           {problem.assigned ? problem.assigned : <Dropdown className='my-3'>
                              <Dropdown.Toggle variant="outline-secondary" id={`dropdown-${index}`}>
                                 {problem.selectedWorker || selectedOption}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                 {allWorkers.map((worker, workerIndex) => (
                                    <Dropdown.Item
                                       key={workerIndex}
                                       onClick={() => handleWorkerSelect(index, worker.name, worker._id, problem._id)}
                                    >
                                       {worker.name}
                                    </Dropdown.Item>
                                 ))}
                              </Dropdown.Menu>
                           </Dropdown>}

                        </StyledTableCell>
                     </StyledTableRow>
                  ))
               ) : (
                  <TableRow>
                     <StyledTableCell colSpan={6} align="center">
                        No problems found
                     </StyledTableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export default AllAssignedProblems;
