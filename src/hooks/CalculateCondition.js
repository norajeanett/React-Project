const CONDITION_TYPES = {
    poor: 'Poor',
    good: 'Good'
}

/**
 * 
 * @param formData - object containing data inputs from inspection form
 * 
 * @returns string decribing condition of school based on parameters from the form inputs
 */
export const CalculateCondition = (formData) => {
    let condition = CONDITION_TYPES.good
    const students = parseInt(formData.numberOfStudents);
    const seats = parseInt(formData.seatsForStudents);
    const textBooks = parseInt(formData.numberOfTextBooks);
    const classrooms = parseInt(formData.numberOfClassrooms)
    const teachers = parseInt(formData.numberOfTeachers)
    const toilets = parseInt(formData.toiletsForStudents);

    if (students > seats) condition = CONDITION_TYPES.poor
    if (students > textBooks) condition = CONDITION_TYPES.poor
    if ((students / classrooms) >= 53) condition = CONDITION_TYPES.poor
    if ((students / teachers) >= 45) condition = CONDITION_TYPES.poor
    if ((students / toilets) >= 25) condition = CONDITION_TYPES.poor

    return condition.toString();
}