import React, { useState } from 'react';
import classes from './App.module.css';
import { Navigation } from './components/Navigation';
import Schools from './pages/Schools';
import SchoolInfo from './pages/SchoolInfo';
import NewInspection from './pages/NewInspection';
import NewSchool from './pages/NewSchool';

/**
 * @constant activePage constains state of which is current page
 * @constant activeId conatins state of id to the school that is selected in school list
 * @constant activeName contains state of name to the chool that is selected in school list
 * 
 * @returns app returns current page that is selected in the nav menue
 */
function MyApp() {
  const [activePage, setActivePage] = useState('Schools');
  const [activeId, setActiveId] = useState("");
  const [activeName, setActiveName] = useState("");

  // set active page
  const activePageHandler = (page) => {
    setActivePage(page);
  };

  // set active school id
  const activeIdHandler = (id) => {
	setActiveId(id);
  };

  // set active school name
  const activeNameHandler = (name) => {
    setActiveName(name);
    };


  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
          activeNameHandler={activeNameHandler}
        />
      </div>
      <div className={classes.right}>
        {activePage === 'Schools' && <Schools activePage={activePage} activePageHandler={activePageHandler} activeIdHandler={activeIdHandler} activeNameHandler={activeNameHandler} id={activeId} />}
		    {activePage === 'SchoolInfo' && <SchoolInfo id={activeId} activeIdHandler={activeIdHandler} displayName={activeName} activePage={activePage} activePageHandler={activePageHandler} activeNameHandler={activeNameHandler} />}
        {activePage === 'NewInspection' && <NewInspection id={activeId} activeIdHandler={activeIdHandler} displayName={activeName} activeNameHandler={activeNameHandler} />}
        {activePage === 'NewSchool' && <NewSchool />}
      </div>
    </div>
  );
}

export default MyApp;
