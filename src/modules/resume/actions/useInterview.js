import { generateInterviewReport } from "."
import { interviewProvider } from "@/store/interview.store"
import { useParams } from "next/navigation"
import { useEffect, useCallback } from "react"

export const useInterview = () => {

    const params = useParams()

    const { loading,report,reports, setLoading, setReports, setReport} = interviewProvider()

    const generateReport = async ({jobDescription, selfDescription, resume}) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({jobDescription, selfDescription, resume})

            setReport(response?.data)
        } catch (error) {
            console.error("Error in generating report : ",error)
     
        }finally{
            setLoading(false)
        }

        return response
    }

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)

            setReport(response.data)
        } catch (error) {
            console.error("Error in fetching report :", error)
        }finally{
            setLoading(false)  
        }

        return response
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response?.data)
        } catch (error) {
            console.error("Error in fetching reports : ", error)
        }finally{
            setLoading(false)
        }

        return response
    },[setLoading, setReports])

    useEffect(() => {
    if(params.interviewId){
      getReportById(params.interviewId)
    }else{
        getReports()
    }
  }, [params.interviewId,getReportById,getReports])

    return { loading,report,reports, generateReport, getReportById, getReports}
}