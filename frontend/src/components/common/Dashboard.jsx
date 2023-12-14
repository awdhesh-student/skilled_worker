import React, { useContext, useState } from 'react';
import NavBar from './NavBar';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../App';

// import Assigned from '../user/teacher/Assigned';
// import Notification from './Notification';
// import HomeWork from './../user/student/HomeWork';
import UserPage from './UserPage';
import AllWorks from '../user/simple/AllWorks';
import AllAssignedProblems from '../admin/AllAssignedProblems';


const Dashboard = () => {
   const user = useContext(UserContext)
   const [selectedComponent, setSelectedComponent] = useState('home');

   const renderSelectedComponent = () => {
      switch (selectedComponent) {
         case 'home':
            return <UserPage />
         case 'works':
            return <AllWorks />
         case 'assignedworks':
            return <AllAssignedProblems />
         // case 'homework':
         //    return <HomeWork />
         // case 'cousres':
         //    return <AllCourses />
         default:
            return <UserPage />

      }
   };
   return (
      <>
         <NavBar setSelectedComponent={setSelectedComponent} />
         <Container className='my-3'>
            {renderSelectedComponent()}
         </Container>
      </>
   );
};

export default Dashboard;