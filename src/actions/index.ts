import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";
import { formSchema } from "@/lib/schemas";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "json",
    input: formSchema, // ← Built-in Zod validation!
    handler: async (values) => { // ← Already validated!
      try {
        const { data, error } = await resend.emails.send({
          from: "Cleenly <Quote_Form@itsfh.com>",
          to: ["fardinhusi@gmail.com"],
          replyTo: `${values.email}`,
          subject: `New Quote Request from ${values.name}`,
          html: `
            <strong>New Quote Request</strong>
            <br><br>
            <strong>Name:</strong> ${values.name}<br>
            <strong>Phone:</strong> ${values.phone}<br>
            <strong>Email:</strong> ${values.email || 'Not provided'}<br>
            <strong>Address:</strong> ${values.address || 'Not provided'}<br>
            <strong>Bedrooms:</strong> ${values.bedroom || 'Not provided'}<br>
            <strong>Bathrooms:</strong> ${values.bathroom || 'Not provided'}<br>
            <strong>Additional Info:</strong> ${values.message || 'None'}
          `,
        });

        if (error) {
          console.log("Error sending email:", error);
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Failed to send email. Please call us directly.",
          });
        }
        console.log("Email sent successfully:", data);
        return { success: true };
      } catch (error) {
        console.log("Error submitting form:", error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Failed to submit form. Please call us directly.",
        });
      }
    },
  }),
};