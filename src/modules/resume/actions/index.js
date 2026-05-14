"use server"

import { currentUser } from "@/modules/authentication_module/actions"
import { db } from "@/lib/db"
// const pdfParse = (await import("pdf-parse")).default;
import { Severity } from "@/generated/prisma"
import pdfParse from "pdf-parse-fork"
import { generateReport } from "../services/ai-report"


const generateInterviewReport =async (values) => {
    try {
        const user = await currentUser();

        if(!user){
            return {
                success: false,
                message: "Unauthorized user"
            }
        }
        // console.log("User : ", user);
        // console.log("Values :",values);

        const file = values.get("file")
        const selfDescription = values.get("selfDescription")

        if (!file || !selfDescription) {
        return {
            success: false,
            message: "Resume and selfDescription is required!",
        }
        }

    const buffer = await file.arrayBuffer()

    const resumeContext = await pdfParse(buffer)
// console.log("Resume content : ",resumeContext)
    // const { selfDescription } = values;

    const interViewReportByAI = await generateReport({
        resume: resumeContext.text,
        selfDescription, 
    })

    console.log("🤖 AI report : ",interViewReportByAI);

    const interviewReport = await db.interviewReport.create({
        data: {
            userId: user.id,
            resume: resumeContext.text,
            selfDescription,
            title: interViewReportByAI.title,
            matchScore: interViewReportByAI.matchScore,
            technicalQuestions: {
                create: interViewReportByAI.technicalQuestions,
            },
            behavioralQuestions: {
                create: interViewReportByAI.behavioralQuestions,
            },
            skillGaps: {
                create: interViewReportByAI.skillGaps,
            },
            preparationPlan: {
                create: interViewReportByAI.preparationPlan.map((p) => ({
                    day: String(p.day), 
                    focus: p.focus,
                    tasks: p.tasks,
          })),
        },

        }
    })

    return{
        success: true,
        message: "Interview report generated successfully",
        data: interviewReport 
    }
    } catch (error) {
        console.log("Report generation failed : ", error)
        return{
        success: false,
        message: "Interview report failed", 
    } 
    }

} 

const getReportById = async (interviewId) => {
    try {
        if (!interviewId) {
            return {
                success: false,
                message: "Interview ID is required",
            }
        }
        console.log("Interview Id: ",interviewId)

    const interviewReport = await db.interviewReport.findUnique({
        where: {id : interviewId},

        include: {
            technicalQuestions: true,
            behavioralQuestions: true,
            skillGaps: true,
            preparationPlan: true,
        }
    })

    if(!interviewReport){
        console.error("Interview report not found")
        return res.status(401).json({
            message: "Report not found"
        })
    }

    return{
        success: true,
        message: "Interview report fetched successfully",
        data: interviewReport
    }
    } catch (error) {
        console.error("Error in finding report : ",error)
        return {
            success: false,
            message: "Interview report finding problem",
        }
    }
}

const getAllInterviewReports = async () => {
  try {
    const user = await currentUser()

    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      }
    }

    const interviewReports = await db.interviewReport.findMany({
      where: {
        userId: user.id, 
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        title: true,
        matchScore: true,
        createdAt: true,
      },
    })

    return {
      success: true,
      message: "Interview reports fetched successfully",
      data: interviewReports,
    }

  } catch (error) {
    console.error("Error in finding interview reports:", error)
    return {
      success: false,
      message: "Can't find all interview reports",
    }
  }
}

export {
    generateInterviewReport,
    getReportById,
    getAllInterviewReports
}