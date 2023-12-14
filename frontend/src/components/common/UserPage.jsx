import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../App';

import SimpleUser from '../user/simple/SimpleUser';
import WorkerHome from '../user/worker/WorkerHome'
import AdminHome from '../admin/AdminHome'
const UserPage = () => {
   const user = useContext(UserContext);
   let content;
   {
      switch (user.userData.type) {
         case "user":
            content = <SimpleUser />
            break;
         case "admin":
            content = <AdminHome />
            break;
         case "worker":
            content = <WorkerHome />
            break;

         default:
            break;
      }
   }

   return (
      <Container>
         {content}
      </Container>
   );
};

export default UserPage;
