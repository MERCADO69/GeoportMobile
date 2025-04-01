import fetchReports from "../../Functions/fetchReports"
import FetchReportedReports from "../../Functions/fetchReportedReports"
import GetUserData from  "../../Functions/getUserData"
import { toFormData } from "axios";
const React = require('react');
const { createContext, useState, useEffect } = React;

export const DataContext = createContext()



const DataFetcher = ({children}) =>{
    const [reportData, setReportData] = useState('');
    const [userData, setUserData] = useState('');
    const [reportedReports, setReportedReports] = useState('');

   async function reportDataProvider(){

    }
    
    async function userDataProvider(){
        
    }
    
    async function userReportedReportsProvider(){

    }   

    return(
        <DataContext.Provider value={{reportData,userData,reportedReports}}>
        {children}
        </DataContext.Provider>
    )

}

module.exports = DataFetcher