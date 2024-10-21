import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utilities/supabase/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST requests allowed' });
    return;
  }

  const { formIdentifier, ...formData } = req.body;

  if (!formIdentifier) {
    res.status(400).json({ message: 'Form identifier is missing' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([{ form_identifier: formIdentifier, form_data: formData, created_at: new Date().toISOString() }]);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Form submitted successfully.', data });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Error submitting form.', error });
  }
}
