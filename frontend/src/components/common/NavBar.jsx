// import React, { useState, useContext } from 'react'
// import { Navbar, Nav, Button, Container, Modal, Form } from 'react-bootstrap';
// import { UserContext } from '../../App';
// import { NavLink } from 'react-router-dom';
// import axiosInstance from './AxiosInstance';
// import { message } from 'antd';

// const NavBar = ({ setSelectedComponent }) => {
//    const [show, setShow] = useState(false);

//    const handleClose = () => setShow(false);
//    const handleShow = () => setShow(true);

//    const [changeUserType, setChangeUserType] = useState({
//       specialized: '',
//       expierence: 0,
//       address: '',
//       phoneNumber: 0,

//    })

//    const handleChange = (e) => {
//       const { name, value } = e.target
//       setChangeUserType({ ...changeUserType, [name]: value })
//    }

//    const user = useContext(UserContext)
//    if (!user) {
//       return null
//    }


//    const handleLogout = () => {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/";
//    }
//    const handleOptionClick = (component) => {
//       setSelectedComponent(component);
//    };

//    const changeType = async (userId) => {

//       console.log(changeUserType)
//       // try {
//       //    const res = await axiosInstance.post(`/api/user/requestchangeusertype/${userId}`, changeUserType, {
//       //       headers: {
//       //          'Authorization': `Bearer ${localStorage.getItem("token")}`,
//       //       },
//       //    });

//       //    if (res.data.success) {
//       //       message.success(res.data.message);
//       //    } else {
//       //       message.error(res.data.message);
//       //    }
//       // } catch (error) {
//       //    console.log(error);
//       // }
//    }


//    return (
//       <Navbar expand="lg" className="bg-body-tertiary">
//          <Container fluid>
//             <Navbar.Brand>
//                <h3>Skilled Workers</h3>
//             </Navbar.Brand>
//             <Navbar.Toggle aria-controls="navbarScroll" />
//             <Navbar.Collapse id="navbarScroll">
//                <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
//                   <NavLink onClick={() => handleOptionClick('home')}>Home</NavLink>
//                   {user.userData.type === 'user' && (<>
//                      <NavLink onClick={() => handleOptionClick('works')}>Works</NavLink>
//                   </>

//                   )}
//                   {user.userData.type === 'admin' && (
//                      <>
//                         <NavLink onClick={() => handleOptionClick('assignedworks')}>Assigned Works</NavLink>
//                      </>
//                   )}
//                   {user.userData.type === 'Student' && (
//                      <>
//                         <NavLink onClick={() => handleOptionClick('homework')}>Home Work</NavLink>
//                      </>

//                   )}
//                </Nav>
//                <Nav>
//                   {
//                      user.userData.type === "user" ? (<>
//                         <Button onClick={handleShow} size='sm' variant='outline-secondary'>Apply for Worker</Button>
//                         <Modal show={show} onHide={handleClose}>
//                            <Modal.Header closeButton>
//                               <Modal.Title>Applying for Worker</Modal.Title>
//                            </Modal.Header>
//                            <Modal.Body>
//                               <Form onSubmit={(e) => {
//                                  e.preventDefault()
//                                  changeType(user.userData._id)
//                               }}>
//                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//                                     <Form.Label>Specialized as</Form.Label>
//                                     <Form.Control
//                                        type="type"
//                                        placeholder="Specialization"
//                                        name="specialized"
//                                        onChange={handleChange}
//                                     />
//                                  </Form.Group>
//                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//                                     <Form.Label>Experience</Form.Label>
//                                     <Form.Control
//                                        type="experience"
//                                        placeholder="experience"
//                                        autoFocus
//                                        name="name"
//                                        onChange={handleChange}
//                                     />
//                                  </Form.Group>
//                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//                                     <Form.Label>Address</Form.Label>
//                                     <Form.Control
//                                        type="type"
//                                        placeholder="address"
//                                        autoFocus
//                                        name="address"
//                                        onChange={handleChange}
//                                     />
//                                  </Form.Group>
//                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//                                     <Form.Label>Phone Number</Form.Label>
//                                     <Form.Control
//                                        type="tel"
//                                        placeholder="phone number"
//                                        autoFocus
//                                        name="phoneNumber"
//                                        onChange={handleChange}
//                                     />
//                                  </Form.Group>
//                                  <Button type='suubmit' variant="primary">
//                                     Save Changes
//                                  </Button>
//                               </Form>
//                            </Modal.Body>
//                         </Modal>
//                      </>) : null
//                   }
//                   <h5 className='mx-3'>Hi {user.userData.name}</h5>

//                   <Button onClick={handleLogout} size='sm' variant='outline-danger'>Log Out</Button >
//                </Nav>
//             </Navbar.Collapse>
//          </Container>
//       </Navbar>


//    )
// }

// export default NavBar


import React, { useState, useContext } from 'react';
import { Navbar, Nav, Button, Container, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import { NavLink } from 'react-router-dom';
import axiosInstance from './AxiosInstance';
import { message } from 'antd';

const NavBar = ({ setSelectedComponent }) => {
   const [show, setShow] = useState(false);

   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   const [changeUserType, setChangeUserType] = useState({
      specialized: '',
      experience: 0,
      address: '',
      phoneNumber: 0,
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setChangeUserType({ ...changeUserType, [name]: value });
   };

   const user = useContext(UserContext);
   if (!user) {
      return null;
   }

   const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
   };

   const handleOptionClick = (component) => {
      setSelectedComponent(component);
   };

   const changeType = async (userId) => {

      try {
         const res = await axiosInstance.post(`/api/user/requestchangeusertype/${userId}`, changeUserType, {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
         });

         if (res.data.success) {
            message.success(res.data.message);
         } else {
            message.error(res.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Navbar expand="lg" className="bg-body-tertiary">
         <Container fluid>
            <Navbar.Brand>
               <h3>Skilled Workers</h3>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
               <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                  <NavLink onClick={() => handleOptionClick('home')}>Home</NavLink>
                  {user.userData.type === 'user' && (
                     <>
                        <NavLink onClick={() => handleOptionClick('works')}>Works</NavLink>
                     </>
                  )}
                  {user.userData.type === 'admin' && (
                     <>
                        <NavLink onClick={() => handleOptionClick('assignedworks')}>Assigned Works</NavLink>
                     </>
                  )}
                  {user.userData.type === 'Student' && (
                     <>
                        <NavLink onClick={() => handleOptionClick('homework')}>Home Work</NavLink>
                     </>
                  )}
               </Nav>
               <Nav>
                  {user.userData.type === 'user' ? (
                     <>
                        <Button onClick={handleShow} size="sm" variant="outline-secondary">
                           Apply for Worker
                        </Button>
                        <Modal show={show} onHide={handleClose}>
                           <Modal.Header closeButton>
                              <Modal.Title>Applying for Worker</Modal.Title>
                           </Modal.Header>
                           <Modal.Body>
                              <Form onSubmit={() => changeType(user.userData._id)}>
                                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Specialized as</Form.Label>
                                    <Form.Control
                                       type="text"
                                       placeholder="Specialization"
                                       name="specialized"
                                       onChange={handleChange}
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Experience</Form.Label>
                                    <Form.Control
                                       type="number"
                                       placeholder="experience"
                                       autoFocus
                                       name="experience"
                                       onChange={handleChange}
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                       type="text"
                                       placeholder="address"
                                       autoFocus
                                       name="address"
                                       onChange={handleChange}
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                       type="tel"
                                       placeholder="phone number"
                                       autoFocus
                                       name="phoneNumber"
                                       onChange={handleChange}
                                    />
                                 </Form.Group>
                                 <Button type="submit" variant="primary">
                                    Save Changes
                                 </Button>
                              </Form>
                           </Modal.Body>
                        </Modal>
                     </>
                  ) : null}
                  <h5 className="mx-3">Hi {user.userData.name}</h5>
                  <Button onClick={handleLogout} size="sm" variant="outline-danger">
                     Log Out
                  </Button>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default NavBar;
