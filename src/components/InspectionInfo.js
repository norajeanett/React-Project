import { Button } from '@dhis2/ui';
import styles from './styles/InspectionInfo.module.css';
import { Table, TableRowHead, TableCellHead, TableBody, TableRow, TableCell } from '@dhis2/ui';

/**
 * 
 * @param inspectionData - Dictionary including data from a specific inspection 
 * @param emptyInspection - Set the state setInspectionDataValues to null
 * 
 * @returns - A table to view the data in inspectionData
 */
const InspectionInfo = ({ inspectionData, emptyInspection }) => {
    return (
        <div className={styles.card}>
			<h2 className={styles.inHeader}>Inspection</h2>
            <Button 
                Destructive 
                className={styles.exit} 
                onClick={emptyInspection}
                >
					<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M291-253.85 253.85-291l189-189-189-189L291-706.15l189 189 189-189L706.15-669l-189 189 189 189L669-253.85l-189-189-189 189Z"/></svg>
				</Button>

            <Table suppressZebraStriping>
                    <TableBody>
                        <TableRowHead>
                        <TableCellHead>Inspection ID: </TableCellHead>
                        <TableCellHead colSpan="7">{inspectionData['id']}</TableCellHead>
                        </TableRowHead>
                        <TableRow>
                            <TableCell>Inspection date: </TableCell>
                            <TableCell>{inspectionData['date'].substring(0,10)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>School inspected: </TableCell>
                            <TableCell>{inspectionData['schoolName']}</TableCell>
                        </TableRow>
                            <TableCell>Seats for students: </TableCell>
                            <TableCell>{inspectionData['seatsForStudents']}</TableCell>
                        <TableRow>
                            <TableCell>Number of students: </TableCell>
                            <TableCell>{inspectionData['numberOfStudents']}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Number of Textbooks: </TableCell>
                            <TableCell>{inspectionData['numberOfTextbooks']}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Number of classrooms: </TableCell>
                            <TableCell>{inspectionData['numberOfClassrooms']}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Number of teachers: </TableCell>
                            <TableCell>{inspectionData['numberOfTeachers']}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Toilets for teachers: </TableCell>
                            <TableCell>{inspectionData['toiletsForTeachers']}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Toilets for students: </TableCell>
                            <TableCell>{inspectionData['toiletsForStudents']}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>School condition: </TableCell>
                            <TableCell>{inspectionData['condition']}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
        </div>
    );
    
}

export default InspectionInfo;