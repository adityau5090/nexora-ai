const OpenAI = require("openai");
const { z } = require("zod");
const { zodTextFormat } = require("openai/helpers/zod");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const interviewReportSchema = z.object({
  title: z.string(),
  matchScore: z.number(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string()
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string()
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"])
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string())
    })
  )
});

async function generateReport({ resume, selfDescription }) {

  const response = await client.responses.parse({
    model: "gpt-5.2",

    input: [{ role: "system", content: "You are resume analyizer"},
          {role: "user", content: `
Resume:
${resume}

Self Description:
${selfDescription}


Generate a structured interview preparation report.`}
    ],

    text: {
      format: zodTextFormat(interviewReportSchema, "interview_report")
    }
  });

  const interview_report = response.output_parsed;
//   console.log(interview_report)
  return interview_report
}

export { generateReport };