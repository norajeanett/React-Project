import React, { useState } from 'react';
import styles from './styles/Search.module.css';

/**
 * 
 * @param onSearch - handle search input
 * 
 * @constant searchTerm - State of a searchterm
 * 
 * @returns - Return title and search input
 */
const Search = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

	// handler to change searchTerm
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
		<div>
			<h1>View schools and inspections</h1>
			<div className={styles.searchContainer}>
				<label className={styles.formItem}>School name</label>
				<input 
					type="text" 
					value={searchTerm} 
					onChange={handleChange} 
					placeholder="Search for school name..." 
					className={styles.searchInput}
				/>
			</div>
		</div>
    );
};

export default Search;