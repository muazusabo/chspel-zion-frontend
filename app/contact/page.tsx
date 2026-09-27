'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { FellowshipSettings } from '@/types';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});
type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [settings, setSettings] = useState<FellowshipSettings | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  useEffect(() => {
    api.get<FellowshipSettings>('/api/settings', { skipAuth: true }).then(setSettings).catch(() => {});
  }, []);

  const onSubmit = async (data: ContactForm) => {
    setError(null);
    try {
      await api.post('/api/contact', data, { skipAuth: true });
      setSubmitted(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <PageHeader eyebrow="Get In Touch" title="Contact Us" description="Questions, prayer requests, or just want to say hello? We'd love to hear from you." />

      <section className="container py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-5 md:gap-14">
          <div className="h-fit space-y-0 border-y border-ink-100 bg-white px-5 md:col-span-2">
            <div className="flex gap-4 border-b border-ink-100 py-6 last:border-b-0">
              <Mail size={19} className="mt-0.5 shrink-0 text-fcs-700" />
              <div>
                <p className="text-sm font-medium text-ink">Email</p>
                <p className="text-sm text-slate-600">{settings?.contactEmail || '[CONTACT EMAIL]'}</p>
              </div>
            </div>
            <div className="flex gap-4 border-b border-ink-100 py-6 last:border-b-0">
              <Phone size={19} className="mt-0.5 shrink-0 text-fcs-700" />
              <div>
                <p className="text-sm font-medium text-ink">Phone</p>
                <p className="text-sm text-slate-600">{settings?.phoneNumber || '[PHONE NUMBER]'}</p>
              </div>
            </div>
            <div className="flex gap-4 border-b border-ink-100 py-6 last:border-b-0">
              <MapPin size={19} className="mt-0.5 shrink-0 text-fcs-700" />
              <div>
                <p className="text-sm font-medium text-ink">Location</p>
                <p className="text-sm text-slate-600">{settings?.address || '[FELLOWSHIP ADDRESS]'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-ink-100 bg-white p-6 sm:p-8 md:col-span-3">
            {submitted ? (
              <div className="rounded-md border border-forest-100 bg-forest-50 p-8 flex flex-col items-center text-center">
                <CheckCircle2 className="text-forest-700 mb-3" size={32} />
                <p className="font-display text-lg text-ink mb-1.5">Message sent</p>
                <p className="text-sm text-slate-600 mb-5">We&apos;ll get back to you as soon as we can.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-xs text-red-700 mt-1.5">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && <p className="text-xs text-red-700 mt-1.5">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register('subject')} />
                  {errors.subject && <p className="text-xs text-red-700 mt-1.5">{errors.subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} {...register('message')} />
                  {errors.message && <p className="text-xs text-red-700 mt-1.5">{errors.message.message}</p>}
                </div>
                {error && <p className="text-sm text-red-700">{error}</p>}
                <Button type="submit" variant="gold" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
