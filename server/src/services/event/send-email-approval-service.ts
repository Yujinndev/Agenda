import nodemailer from 'nodemailer'
import { format } from 'date-fns'
import { Prisma, type PrismaClient } from '@prisma/client'
import { getUserData } from '../../data/user/get-user'
import { concatenateStrings } from '../../utils/concatenate-strings'
import { createEmailLinkWithToken } from '../../helpers/create-email-magic-link'
import { getEventData } from '../../data/event/get-event'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { updateSentEmailCommitteeData } from '../../data/committee/update-sent-email-committee'
import { getSentEmailCommitteeData } from '../../data/committee/get-sent-email-committee'

export type SendEmailApprovalServiceArgs = {
  prisma: PrismaClient | Prisma.TransactionClient
  committeeEmail: string
  eventId: string
}

export const sendEmailApprovalService = async ({
  prisma,
  committeeEmail,
  eventId,
}: SendEmailApprovalServiceArgs) => {
  const event = await getEventData({ prisma, id: eventId })

  const organizer = await getUserData({
    prisma,
    id: event.organizerId,
  })
  const organizerFullName = concatenateStrings(
    organizer?.firstName,
    organizer?.lastName,
  )

  const startDateTime = event.startDateTime
    ? format(new Date(event.startDateTime)!, 'PPp')
    : null
  const endDateTime = event.endDateTime
    ? format(new Date(event.endDateTime)!, 'PPp')
    : null

  const requestRevisionLink = createEmailLinkWithToken({
    email: committeeEmail,
    eventId: eventId,
    status: 'REQUESTING_REVISION',
  })
  const rejectLink = createEmailLinkWithToken({
    email: committeeEmail,
    eventId: eventId,
    status: 'REJECTED',
  })
  const approveLink = createEmailLinkWithToken({
    email: committeeEmail,
    eventId: eventId,
    status: 'APPROVED',
  })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_GMAIL_USER,
      pass: process.env.SMTP_GMAIL_PASS,
    },
  })

  const sentEmail = await transporter.sendMail({
    from: `Agenda Inc. <${process.env.SMTP_GMAIL_USER}>`,
    to: committeeEmail,
    subject: `Requesting Approval for ${event.title}`,
    headers: {
      Priority: 'urgent',
      Importance: 'high',
    },
    html: `<!doctype html>
      <html lang="en">

      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Simple Transactional Email</title>
        <style media="all" type="text/css">
          @media only screen and (max-width: 640px) {
            .main p,
            .main td,
            .main span {
              font-size: 16px !important;
            }

            .wrapper {
              padding: 8px !important;
            }

            .content {
              padding: 0 !important;
            }

            .container {
              padding: 0 !important;
              padding-top: 8px !important;
              width: 100% !important;
            }

            .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }

            .btn table {
              max-width: 100% !important;
              width: 100% !important;
            }

            .btn a {
              font-size: 16px !important;
              max-width: 100% !important;
              width: 100% !important;
            }
          }

          @media all {
            .ExternalClass {
              width: 100%;
            }

            .ExternalClass,
            .ExternalClass p,
            .ExternalClass font,
            .ExternalClass span,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }

            p {
              line-height: 200%;
            }

            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
            }
          }
        </style>
      </head>
      <body style="-webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 8px; text-align: justify;">
        <div style="font-family: Helvetica, sans-serif; background-color: #ffffff; padding: 1rem">
          <div style="padding: 1rem;">
            <div>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">To whom it may concern,</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">I am writing to request your approval for <b>${
                event.title
              }</b>, which is planned to take place on <b>${startDateTime}</b> until <b>${endDateTime}</b> at <b>${
      event.location
    }</b>. The purpose of this event is/are: <b>${
      event.purpose
    }</b>. This event falls under the category of <b>${
      event.category
    }</b>. We anticipate an attendance of approximately <b>${
      event.estimatedAttendees
    }</b> people. Additionally, we have prepared a budget outlining the estimated expenses, which amount to <b>${new Intl.NumberFormat(
      'fil-PH',
      {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
      },
    ).format(
      parseFloat(event.estimatedExpense?.toString()!),
    )}</b>. There would be a joining fee for the participants that costs <b>${new Intl.NumberFormat(
      'fil-PH',
      {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
      },
    ).format(parseFloat(event.price?.toString()!))}</b>.</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${
                event.details
              }</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">To ensure everything proceeds smoothly, we seek your valuable approval. Please let us know if you require any additional information or have any questions regarding the event. Your feedback is important to us, and we are open to any suggestions you may have.</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Thank you for considering this proposal. I look forward to your positive response.</p>
              <br/>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Sincerely,</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;"><b>${organizerFullName}</b></p>
            </div>

            <br/>
            <br/>
            <div style="display: flex; font-family: Helvetica, sans-serif;">
              <a href="${requestRevisionLink}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 4px; padding: 8px; text-decoration: none; text-transform: capitalize; background-color: #0867ec; border-color: #0867ec; color: #ffffff;">Request Revision</a>
              <a href="${rejectLink}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 4px; padding: 8px; text-decoration: none; text-transform: capitalize; background-color: #C70039; border-color: #C70039; color: #ffffff;">Reject</a>
              <a href="${approveLink}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 4px; padding: 8px; text-decoration: none; text-transform: capitalize; background-color: #2AAA8A; border-color: #2AAA8A; color: #ffffff;">Approve</a>
            </div>
          </div>
        </div>

        <div style="padding-top: 24px; border-top: 1px solid #9a9ea6; padding-bottom: 24px; text-align: center; width: 100%; font-family: Courier New, monospace">
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p style="color: #9a9ea6; font-size: 16px; text-align: center;">Agenda simplifies event planning, making tasks like guest management and budget tracking efficient. 
              </br>
              Copyright © SynchroFission 2023 - Present
            </p>
          </div>
        </div>
      </body>
    </html>`,
  })

  if (sentEmail.messageId) {
    const findCommitteeId = await getSentEmailCommitteeData({
      prisma,
      email: committeeEmail,
    })

    await updateSentEmailCommitteeData({
      prisma,
      id: findCommitteeId.id,
      values: { isSent: true, messageId: sentEmail.messageId },
    })

    await createHistoryLogData({
      prisma,
      values: {
        message: `Sent email approval to ${committeeEmail}`,
        action: 'SUBMITTED',
        eventId: event.id,
      },
    })
  }

  return sentEmail
}
