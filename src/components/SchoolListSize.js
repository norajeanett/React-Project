import styles from './styles/ListSize.module.css';

/**
 * @param handler function for setting new value of pageSize and refetch api call
 * 
 * @returns selction menu with alternitives to set page size from 10 to 50
 */
const SchoolListSize = ({ handler }) => {
    
    return (
        <div>
            <label className={styles.Size}>
                Maximum number of schools displayed:
            </label>
            <select 
				onChange={e => handler(e.target.value)}
				className={styles.Dropdown}
			>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
            </select>
        </div>
    );
}

export default SchoolListSize;