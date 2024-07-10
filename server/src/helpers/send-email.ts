import nodemailer from 'nodemailer'
import { format } from 'date-fns'
import { createEmailLinkWithToken } from './create-email-magic-link'

interface SendEmailProps {
  email: string
  eventCreator: string
  eventId: string
  eventTitle: string
  eventStartDateTime: string
  eventEndDateTime: string
  eventPurpose: string
  eventLocation: string
  eventCategory: string
  eventEstimatedAttendees: number
  eventExpenses: any
  eventFee: any
}

export const sendEmail = async ({
  email,
  eventCreator,
  eventId,
  eventTitle,
  eventStartDateTime,
  eventEndDateTime,
  eventPurpose,
  eventLocation,
  eventCategory,
  eventEstimatedAttendees,
  eventExpenses,
  eventFee,
}: SendEmailProps) => {
  const startDateTime = format(new Date(eventStartDateTime), 'PPp')
  const endDateTime = format(new Date(eventEndDateTime), 'PPp')

  const requestRevisionLink = createEmailLinkWithToken({
    email,
    eventId: eventId,
    status: 'REQUESTING_REVISION',
  })
  const rejectLink = createEmailLinkWithToken({
    email,
    eventId: eventId,
    status: 'REJECTED',
  })
  const approveLink = createEmailLinkWithToken({
    email,
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
    to: email,
    subject: `Requesting Approval for ${eventTitle}`,
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
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">I am writing to request your approval for <b>${eventTitle}</b>, which is planned to take place on <b>${startDateTime}</b> until <b>${endDateTime}</b> at <b>${eventLocation}</b>. The purpose of this event is/are: <b>${eventPurpose}</b>. This event falls under the category of <b>${eventCategory}</b>. We anticipate an attendance of approximately <b>${eventEstimatedAttendees}</b> people. Additionally, we have prepared a budget outlining the estimated expenses, which amount to <b>${new Intl.NumberFormat(
      'fil-PH',
      {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
      },
    ).format(
      parseFloat(eventExpenses),
    )}</b>. There would be a joining fee for the participants that costs <b>${new Intl.NumberFormat(
      'fil-PH',
      {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
      },
    ).format(parseFloat(eventFee))}</b>.</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">To ensure everything proceeds smoothly, we seek your valuable approval. Please let us know if you require any additional information or have any questions regarding the event. Your feedback is important to us, and we are open to any suggestions you may have.</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Thank you for considering this proposal. I look forward to your positive response.</p>
              <br/>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Sincerely,</p>
              <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;"><b>${eventCreator}</b></p>
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

  console.log(sentEmail)
}
