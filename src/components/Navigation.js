import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

/**
 * 
 * @param activePage - A state of which is current page
 * @param activePageHandler - handler for setting state of active page
 * @param activeNameHandler - handler for setting state of current school name
 * 
 * @returns - A menu containing different routing possibilities  
 */
export function Navigation({ activePage, activePageHandler, activeNameHandler }) {
  return (
    <Menu>
        <MenuItem
        label="View schools and inspections"
        active={activePage === "Schools"} 
        onClick={() => activePageHandler("Schools")}
      />
        <MenuItem
          label="Create new school inspection"
          active={activePage === "NewInspection"} 
          onClick={() => {activePageHandler("NewInspection"), activeNameHandler("")}}
      />
        <MenuItem
          label="Create new school"
          active={activePage === "NewSchool"} 
          onClick={() => activePageHandler("NewSchool")}
      />
    </Menu>
  );
}
