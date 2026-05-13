"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formSchema } from "@/lib/schemas";
import { actions } from "astro:actions";
import { useState } from "react";

export default function QuoteFormNext() {
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await actions.send(values);
      if (result?.error) {
        const errors = JSON.parse(
          result.error.message.replace("Failed to validate: ", ""),
        );
        const errorMsg = errors[0]?.message || "Please check your form";
        toast.error(errorMsg);
        return;
      }
      setSuccess(true);
    } catch (error) {
      toast.error("Failed to submit form. Please call us directly.");
    } finally {
      return;
    }
  }

  return success ? (
    <div className="p-6 bg-green-100 rounded-md text-center">
      <h2 className="text-2xl font-semibold mb-4">Thank you!</h2>
      <p>
        Your quote request has been received. We will get back to you shortly.
      </p>
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => setSuccess(false)}
      >
        Submit Another Request
      </Button>
    </div>
  ) : (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 max-w-3xl mx-auto"
    >
      <Field>
        <FieldLabel htmlFor="name">Full Name *</FieldLabel>
        <Input
          className="h-12 text-lg"
          id="name"
          placeholder="John Smith"
          {...form.register("name")}
        />

        <FieldError>{form.formState.errors.name?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email *</FieldLabel>
        <Input
          className="h-12 text-lg"
          id="email"
          placeholder="you@gmail.com"
          {...form.register("email")}
        />

        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="phone">Phone number *</FieldLabel>
        <Input
          className="h-12 text-lg"
          id="phone"
          placeholder="(778) 555-5555"
          {...form.register("phone")}
        />
        <FieldError>{form.formState.errors.phone?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="address">Home Address *</FieldLabel>
        <Input
          className="h-12 text-lg"
          id="address"
          placeholder="123 Main St, Langley BC"
          {...form.register("address")}
        />
        <FieldError>{form.formState.errors.address?.message}</FieldError>
      </Field>
      <div className="flex gap-4">
        <Field>
          <FieldLabel htmlFor="bedroom">Bedrooms *</FieldLabel>
          <Select onValueChange={(value) => form.setValue("bedroom", value)}>
            <SelectTrigger id="bedroom">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
              <SelectItem value="2 Bedrooms">2 Bedrooms</SelectItem>
              <SelectItem value="3 Bedrooms">3 Bedrooms</SelectItem>
              <SelectItem value="4 Bedrooms">4 Bedrooms</SelectItem>
              <SelectItem value="5+ Bedrooms">5+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>

          <FieldError>{form.formState.errors.bedroom?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="bathroom">Bathrooms *</FieldLabel>
          <Select onValueChange={(value) => form.setValue("bathroom", value)}>
            <SelectTrigger id="bathroom">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 Bathroom">1 Bathroom</SelectItem>
              <SelectItem value="2 Bathrooms">2 Bathrooms</SelectItem>
              <SelectItem value="3 Bathrooms">3 Bathrooms</SelectItem>
              <SelectItem value="4+ Bathrooms">4+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>{form.formState.errors.bathroom?.message}</FieldError>
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea id="message" {...form.register("message")} />
        <FieldError>{form.formState.errors.message?.message}</FieldError>
      </Field>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
