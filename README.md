# IN5320-2024-Group-6
**This is our DHIS2 App for education.**

**Created by:**
- Marius Emil Green Holten (meholten)
- Jørgen Traasdahl Fornes (jorgetf)
- Nora Jeanett Tønnessen (norajto)
- Thomas Naper Kristiansen (thomank)
- Inana Baker (inanab)

## App functionality

**The App has the following features:**
* Page with a list of Schools that include the condition from the latest inspection for each school (vist planner).
* Page with a list of inspections for each school
* New inspection form
* New school form

## App implementation
* **View Schools and Inspections:** List of schools is implemented by ``School`` component which is the parent of four other components:
    * ``Search``: Is a component that enables us to search through different schools.
    * ``SchoolListSize``: Is a component that enables to change the page size of school list from 10 -> 15.
    * ``SchoolList``: Is a component that contains a table of all schools. School data is called from ``useDataQuery`` hook that is imported in to the ``School`` component and is then sent as a parameter to the ``SchoolList`` component to be rendered in a table list.
    * ``Pagination``: Is a component that enables rendering of the next or previous page of schools.
* **Create new School inspection:** Form page for adding a new inspection for selected school is implemented in the ``NewInspection`` component.
* **Create new School:** Form page for adding a new school is implemented in the ``NewSchool`` component.
* **School inspections:** ``SchoolInfo`` component is responsible for displaying a list of inspection for selected school.

## Missing functionalities/implementations
* **School Search:** We encountered problems with implementing the search functionality for schools. There is a rendering problem when the number of schools change due to search filtering. The render problem happens because ``useDataQuery`` hook render more hooks than during the previous rendering.
* **Minor issue:** When opening a new school inspection and clicking on ``Create Inspection`` without the ``School Name`` field filled, there is no red warning marker to the left of the input field.
