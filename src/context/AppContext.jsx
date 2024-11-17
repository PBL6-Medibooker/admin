import {createContext} from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const calculateAge = (dob) =>{
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }

    const separateDayAndDate = (appointmentDay) => {
        const [dayOfWeek, date] = appointmentDay.split(' ');
        return { dayOfWeek, date };
    };



    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dateFormat = (slotDate) => {
        if (!slotDate) {
            console.error("Invalid slotDate:", slotDate);
            return '';
        }


        if (typeof slotDate === 'string') {
            const dateArray = slotDate.split('-');
            if (dateArray.length === 3) {
                const day = dateArray[2];
                const month = months[Number(dateArray[1])] || '';
                const year = dateArray[0];

                return `${day} ${month} ${year}`;
            } else {
                console.error("Invalid date format:", slotDate);
                return '';
            }
        }

        console.error("Invalid slotDate type:", typeof slotDate);
        return '';
    }




    const value = {
        calculateAge, dateFormat, separateDayAndDate
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
